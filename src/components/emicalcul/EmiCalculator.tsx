"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  Calendar,
  Info,
  DollarSign,
  Percent,
  Download,
  FileText,
  Wallet,
} from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Interfaces for type safety
interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalProcessingFee: number;
  totalAmount: number;
  schedule: {
    month: string;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

interface DefaultValues {
  productName: string;
  price: string;
  interestRate: string;
  tenure: string;
}

interface EmiCalculatorProps {
  defaultValues: DefaultValues;
  tabType: "product" | "home" | "car" | "salary";
}

interface Errors {
  productName?: string;
  loanAmount?: string;
  downPayment?: string;
  interestRate?: string;
  tenure?: string;
  processingFee?: string;
  salary?: string;
  desiredEmi?: string;
}

// Number formatter for INR
const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

// Calculate EMI with processing fee
const calculateEmi = (
  loanAmount: number,
  downPayment: number,
  interestRate: number,
  tenure: number,
  emiType: "reducing" | "flat",
  startDate: string,
  processingFee: number
): EmiResult => {
  const principal = loanAmount - downPayment;
  const rate = interestRate / 100 / 12;
  let monthlyEmi = 0;
  let totalInterest = 0;
  const schedule = [];

  if (emiType === "reducing") {
    if (rate === 0) {
      monthlyEmi = principal / tenure;
    } else {
      const x = Math.pow(1 + rate, tenure);
      monthlyEmi = (principal * rate * x) / (x - 1);
    }
    totalInterest = monthlyEmi * tenure - principal;
  } else {
    totalInterest = principal * (interestRate / 100) * (tenure / 12);
    monthlyEmi = (principal + totalInterest) / tenure;
  }

  let balance = principal;
  const start = new Date(startDate || new Date());
  for (let i = 0; i < tenure && balance > 0; i++) {
    const interest = balance * rate;
    const principalPaid = monthlyEmi - interest;
    balance -= principalPaid;
    const month = new Date(
      start.getFullYear(),
      start.getMonth() + i,
      1
    ).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    schedule.push({
      month,
      emi: monthlyEmi,
      principal: principalPaid,
      interest,
      balance: Math.max(balance, 0),
    });
  }

  return {
    monthlyEmi,
    totalInterest,
    totalProcessingFee: processingFee,
    totalAmount: monthlyEmi * tenure + downPayment + processingFee,
    schedule,
  };
};

// Animation variants for inputs
const inputVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Skeleton component for loading state
const Skeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-blue-100 rounded w-3/4"></div>
    <div className="h-10 bg-blue-100 rounded"></div>
    <div className="h-10 bg-blue-100 rounded"></div>
    <div className="h-10 bg-blue-100 rounded"></div>
    <div className="h-64 bg-blue-100 rounded"></div>
  </div>
);

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  defaultValues,
  tabType,
}) => {
  // State management
  const [productName, setProductName] = useState(defaultValues.productName);
  const [loanAmount, setLoanAmount] = useState(defaultValues.price);
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState(defaultValues.interestRate);
  const [tenure, setTenure] = useState(defaultValues.tenure);
  const [tenureUnit, setTenureUnit] = useState<"months" | "years">("months");
  const [startDate, setStartDate] = useState("");
  const [processingFee, setProcessingFee] = useState("");
  const [emiType, setEmiType] = useState<"reducing" | "flat">("reducing");
  const [salary, setSalary] = useState(tabType === "salary" ? "25000" : "");
  const [desiredEmi, setDesiredEmi] = useState(
    tabType === "salary" ? "5000" : ""
  );
  const [selectedBank, setSelectedBank] = useState("custom");
  const [result, setResult] = useState<EmiResult | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showProfessionalView, setShowProfessionalView] = useState(false);

  // Bank interest rates
  const bankRates = [
    { name: "SBI", rate: 8.75 },
    { name: "PNB", rate: 8.9 },
    { name: "Bank of Baroda", rate: 9.0 },
    { name: "Custom", rate: parseFloat(defaultValues.interestRate) || 7 },
  ];

  // Initialize from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProductName(params.get("productName") || defaultValues.productName);
    setLoanAmount(params.get("loanAmount") || defaultValues.price);
    setDownPayment(params.get("downPayment") || "");
    setInterestRate(params.get("interestRate") || defaultValues.interestRate);
    setTenure(params.get("tenure") || defaultValues.tenure);
    setTenureUnit((params.get("tenureUnit") as "months" | "years") || "months");
    setStartDate(params.get("startDate") || "");
    setProcessingFee(params.get("processingFee") || "");
    setEmiType((params.get("emiType") as "reducing" | "flat") || "reducing");
    if (tabType === "salary") {
      setSalary(params.get("salary") || "25000");
      setDesiredEmi(params.get("desiredEmi") || "5000");
    }
    setIsLoading(false);
  }, [defaultValues, tabType]);

  // Update interest rate when bank is selected
  useEffect(() => {
    const bank = bankRates.find((b) => b.name === selectedBank);
    if (bank) setInterestRate(bank.rate.toString());
  }, [selectedBank]);

  // Convert tenure between months and years
  const getTenureInMonths = () => {
    const tenureNum = parseFloat(tenure);
    return tenureUnit === "years" ? tenureNum * 12 : tenureNum;
  };

  const setTenureFromInput = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setTenure(num.toString());
    }
  };

  // Validate inputs
  const validateInputs = () => {
    const newErrors: Errors = {};
    const tenureInMonths = getTenureInMonths();
    const interestRateNum = parseFloat(interestRate);
    const processingFeeNum = parseFloat(processingFee || "0");

    if (tabType !== "salary") {
      const loanAmountNum = parseFloat(loanAmount);
      const downPaymentNum = parseFloat(downPayment || "0");
      if (!productName.trim()) newErrors.productName = "Required";
      if (!loanAmount || loanAmountNum <= 0)
        newErrors.loanAmount = "Valid amount required";
      if (
        downPayment &&
        (downPaymentNum < 0 || downPaymentNum >= loanAmountNum)
      )
        newErrors.downPayment = "0 to loan amount";
    } else {
      const loanAmountNum = parseFloat(loanAmount);
      const salaryNum = parseFloat(salary || "25000");
      const desiredEmiNum = parseFloat(desiredEmi || "5000");
      if (!loanAmount || loanAmountNum <= 0)
        newErrors.loanAmount = "Valid amount required";
      if (!salary || salaryNum <= 0) newErrors.salary = "Valid salary required";
      if (!desiredEmi || desiredEmiNum <= 0)
        newErrors.desiredEmi = "Valid EMI required";
      if (desiredEmiNum > salaryNum * 0.4)
        newErrors.desiredEmi = "EMI exceeds 40% of salary";
    }

    if (!interestRate || interestRateNum < 0 || interestRateNum > 100)
      newErrors.interestRate = "0-100%";
    if (!tenure || tenureInMonths <= 0 || tenureInMonths > 360)
      newErrors.tenure = tenureUnit === "years" ? "1-30 years" : "1-360 months";
    if (processingFee && processingFeeNum < 0)
      newErrors.processingFee = "Non-negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate EMI on input change
  useEffect(() => {
    if (validateInputs()) {
      setIsLoading(true);
      const emiResult = calculateEmi(
        parseFloat(loanAmount),
        tabType === "salary" ? 0 : parseFloat(downPayment || "0"),
        parseFloat(interestRate),
        getTenureInMonths(),
        emiType,
        startDate,
        parseFloat(processingFee || "0")
      );
      setResult(emiResult);
      setIsLoading(false);
    } else {
      setResult(null);
      setIsLoading(false);
    }
  }, [
    loanAmount,
    downPayment,
    interestRate,
    tenure,
    tenureUnit,
    emiType,
    startDate,
    processingFee,
    productName,
    salary,
    desiredEmi,
    tabType,
  ]);

  // Chart data for EMI breakdown
  const chartData = result
    ? {
        labels:
          tabType === "salary"
            ? ["Loan Amount", "Interest", "Processing Fee"]
            : ["Principal", "Interest", "Down Payment", "Processing Fee"],
        datasets: [
          {
            data:
              tabType === "salary"
                ? [
                    parseFloat(loanAmount),
                    result.totalInterest,
                    result.totalProcessingFee,
                  ]
                : [
                    parseFloat(loanAmount) - parseFloat(downPayment || "0"),
                    result.totalInterest,
                    parseFloat(downPayment || "0"),
                    result.totalProcessingFee,
                  ],
            backgroundColor:
              tabType === "salary"
                ? ["#3b82f6", "#ec4899", "#f59e0b"]
                : ["#3b82f6", "#ec4899", "#10b981", "#f59e0b"],
            borderColor: ["#fff", "#fff", "#fff", "#fff"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Affordability check for salary tab
  const isEmiAffordable =
    tabType === "salary" && parseFloat(desiredEmi) <= parseFloat(salary) * 0.4;

  // Calculate range progress for dynamic background
  const getRangeProgress = (value: string, min: number, max: number) => {
    const val = parseFloat(value) || min;
    const progress = ((val - min) / (max - min)) * 100;
    return `${progress}%`;
  };

  // Download results as PDF
  const downloadPdf = async () => {
    const element = document.getElementById("emi-results");
    if (!element) return;

    const dataUrl = await toPng(element, { quality: 0.95 });
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;
    pdf.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`${productName || "Loan"}_EMI_Report.pdf`);
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={inputVariants}
      className="space-y-4 max-w-3xl mx-auto p-4 sm:p-6"
      aria-labelledby="emi-calculator-heading"
    >
      <h2 id="emi-calculator-heading" className="sr-only">
        EMI Calculator
      </h2>

      {isLoading ? (
        <Skeleton />
      ) : (
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            {/* Salary Tab Inputs */}
            {tabType === "salary" && (
              <>
                {/* Loan Amount */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="loanAmount"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <DollarSign
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Loan Amount (₹)
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="loanAmount-desc"
                    />
                  </label>
                  <input
                    id="loanAmount-range"
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        loanAmount,
                        10000,
                        5000000
                      )}, #e5e7eb ${getRangeProgress(
                        loanAmount,
                        10000,
                        5000000
                      )})`,
                    }}
                    aria-label="Adjust loan amount"
                  />
                  <input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="e.g., 300000"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    aria-describedby="loanAmount-desc"
                  />
                  {errors.loanAmount && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.loanAmount}
                    </p>
                  )}
                </motion.div>

                {/* Salary */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="salary"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <Wallet
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Your Salary (₹)
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="salary-desc"
                    />
                  </label>
                  <input
                    id="salary-range"
                    type="range"
                    min="10000"
                    max="1000000"
                    step="1000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        salary,
                        10000,
                        1000000
                      )}, #e5e7eb ${getRangeProgress(salary, 10000, 1000000)})`,
                    }}
                    aria-label="Adjust salary"
                  />
                  <input
                    id="salary"
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g., 25000"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    aria-describedby="salary-desc"
                  />
                  {errors.salary && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.salary}
                    </p>
                  )}
                </motion.div>

                {/* Desired EMI */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="desiredEmi"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <DollarSign
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Desired EMI per Month (₹)
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="desiredEmi-desc"
                    />
                  </label>
                  <input
                    id="desiredEmi-range"
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={desiredEmi}
                    onChange={(e) => setDesiredEmi(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        desiredEmi,
                        1000,
                        100000
                      )}, #e5e7eb ${getRangeProgress(
                        desiredEmi,
                        1000,
                        100000
                      )})`,
                    }}
                    aria-label="Adjust desired EMI"
                  />
                  <input
                    id="desiredEmi"
                    type="number"
                    value={desiredEmi}
                    onChange={(e) => setDesiredEmi(e.target.value)}
                    placeholder="e.g., 5000"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    aria-describedby="desiredEmi-desc"
                  />
                  {errors.desiredEmi && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.desiredEmi}
                    </p>
                  )}
                </motion.div>

                {/* Interest Rate */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="interestRate"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <Percent
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Interest Rate (%)
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="interestRate-desc"
                    />
                  </label>
                  <select
                    id="bankRate"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    aria-label="Select bank for interest rate"
                  >
                    {bankRates.map((bank) => (
                      <option key={bank.name} value={bank.name}>
                        {bank.name} ({bank.rate}%)
                      </option>
                    ))}
                  </select>
                  <input
                    id="interestRate-range"
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        interestRate,
                        0,
                        100
                      )}, #e5e7eb ${getRangeProgress(interestRate, 0, 100)})`,
                    }}
                    aria-label="Adjust interest rate"
                  />
                  <input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="e.g., 7"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    max="100"
                    step="0.01"
                    aria-describedby="interestRate-desc"
                  />
                  {errors.interestRate && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.interestRate}
                    </p>
                  )}
                </motion.div>

                {/* Tenure */}
                <motion.div variants={inputVariants}>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="tenure"
                      className="flex items-center text-base font-medium text-black"
                    >
                      <Calendar
                        className="w-4 h-4 mr-1 animate-pulse"
                        aria-hidden="true"
                      />{" "}
                      Tenure ({tenureUnit})
                      <Info
                        className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                        aria-describedby="tenure-desc"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setTenureUnit(
                          tenureUnit === "months" ? "years" : "months"
                        )
                      }
                      className={`px-2 py-1 text-sm rounded-md transition-colors ${
                        tenureUnit === "months"
                          ? "bg-blue-500 text-white"
                          : "bg-blue-200 text-black"
                      }`}
                      aria-label={`Switch to ${
                        tenureUnit === "months" ? "years" : "months"
                      }`}
                    >
                      {tenureUnit === "months" ? "Years" : "Months"}
                    </button>
                  </div>
                  <input
                    id="tenure-range"
                    type="range"
                    min={tenureUnit === "years" ? 1 : 1}
                    max={tenureUnit === "years" ? 30 : 360}
                    step={tenureUnit === "years" ? 1 : 12}
                    value={tenure}
                    onChange={(e) => setTenureFromInput(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        tenure,
                        tenureUnit === "years" ? 1 : 1,
                        tenureUnit === "years" ? 30 : 360
                      )}, #e5e7eb ${getRangeProgress(
                        tenure,
                        tenureUnit === "years" ? 1 : 1,
                        tenureUnit === "years" ? 30 : 360
                      )})`,
                    }}
                    aria-label={`Adjust tenure in ${tenureUnit}`}
                  />
                  <input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenureFromInput(e.target.value)}
                    placeholder={
                      tenureUnit === "years" ? "e.g., 3" : "e.g., 36"
                    }
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="1"
                    max={tenureUnit === "years" ? 30 : 360}
                    step={tenureUnit === "years" ? 0.1 : 1}
                    aria-describedby="tenure-desc"
                  />
                  {errors.tenure && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.tenure}
                    </p>
                  )}
                </motion.div>

                {/* Processing Fee */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="processingFee"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <DollarSign
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Processing Fee (₹)
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="processingFee-desc"
                    />
                  </label>
                  <input
                    id="processingFee-range"
                    type="range"
                    min="0"
                    max="50000"
                    step="5000"
                    value={processingFee || "0"}
                    onChange={(e) => setProcessingFee(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        processingFee || "0",
                        0,
                        50000
                      )}, #e5e7eb ${getRangeProgress(
                        processingFee || "0",
                        0,
                        50000
                      )})`,
                    }}
                    aria-label="Adjust processing fee"
                  />
                  <input
                    id="processingFee"
                    type="number"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(e.target.value)}
                    placeholder="0"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    aria-describedby="processingFee-desc"
                  />
                  {errors.processingFee && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.processingFee}
                    </p>
                  )}
                </motion.div>
              </>
            )}

            {/* Other Tabs Inputs */}
            {tabType !== "salary" && (
              <>
                {/* Product Name */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="productName"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <DollarSign
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Product Name
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="productName-desc"
                    />
                  </label>
                  <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Home Loan"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    aria-describedby="productName-desc"
                  />
                  {errors.productName && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.productName}
                    </p>
                  )}
                </motion.div>

                {/* Loan Amount */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="loanAmount"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <DollarSign
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    {tabType === "product"
                      ? "Product Price (₹)"
                      : "Loan Amount (₹)"}
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="loanAmount-desc"
                    />
                  </label>
                  <input
                    id="loanAmount-range"
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        loanAmount,
                        10000,
                        5000000
                      )}, #e5e7eb ${getRangeProgress(
                        loanAmount,
                        10000,
                        5000000
                      )})`,
                    }}
                    aria-label="Adjust loan amount"
                  />
                  <input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="e.g., 100000"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    aria-describedby="loanAmount-desc"
                  />
                  {errors.loanAmount && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.loanAmount}
                    </p>
                  )}
                </motion.div>

                {/* Down Payment */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="downPayment"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <DollarSign
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Down Payment (₹)
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="downPayment-desc"
                    />
                  </label>
                  <input
                    id="downPayment-range"
                    type="range"
                    min="0"
                    max={parseFloat(loanAmount) || 5000000}
                    step="10000"
                    value={downPayment || "0"}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        downPayment || "0",
                        0,
                        parseFloat(loanAmount) || 5000000
                      )}, #e5e7eb ${getRangeProgress(
                        downPayment || "0",
                        0,
                        parseFloat(loanAmount) || 5000000
                      )})`,
                    }}
                    aria-label="Adjust down payment"
                  />
                  <input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="0"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    aria-describedby="downPayment-desc"
                  />
                  {errors.downPayment && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.downPayment}
                    </p>
                  )}
                </motion.div>

                {/* Interest Rate */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="interestRate"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <Percent
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Interest Rate (%)
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="interestRate-desc"
                    />
                  </label>
                  <select
                    id="bankRate"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    aria-label="Select bank for interest rate"
                  >
                    {bankRates.map((bank) => (
                      <option key={bank.name} value={bank.name}>
                        {bank.name} ({bank.rate}%)
                      </option>
                    ))}
                  </select>
                  <input
                    id="interestRate-range"
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        interestRate,
                        0,
                        100
                      )}, #e5e7eb ${getRangeProgress(interestRate, 0, 100)})`,
                    }}
                    aria-label="Adjust interest rate"
                  />
                  <input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="e.g., 5"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    max="100"
                    step="0.01"
                    aria-describedby="interestRate-desc"
                  />
                  {errors.interestRate && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.interestRate}
                    </p>
                  )}
                </motion.div>

                {/* Tenure */}
                <motion.div variants={inputVariants}>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="tenure"
                      className="flex items-center text-base font-medium text-black"
                    >
                      <Calendar
                        className="w-4 h-4 mr-1 animate-pulse"
                        aria-hidden="true"
                      />{" "}
                      Tenure ({tenureUnit})
                      <Info
                        className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                        aria-describedby="tenure-desc"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setTenureUnit(
                          tenureUnit === "months" ? "years" : "months"
                        )
                      }
                      className={`px-2 py-1 text-sm rounded-md transition-colors ${
                        tenureUnit === "months"
                          ? "bg-blue-500 text-white"
                          : "bg-blue-200 text-black"
                      }`}
                      aria-label={`Switch to ${
                        tenureUnit === "months" ? "years" : "months"
                      }`}
                    >
                      {tenureUnit === "months" ? "Years" : "Months"}
                    </button>
                  </div>
                  <input
                    id="tenure-range"
                    type="range"
                    min={tenureUnit === "years" ? 1 : 1}
                    max={tenureUnit === "years" ? 30 : 360}
                    step={tenureUnit === "years" ? 1 : 12}
                    value={tenure}
                    onChange={(e) => setTenureFromInput(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        tenure,
                        tenureUnit === "years" ? 1 : 1,
                        tenureUnit === "years" ? 30 : 360
                      )}, #e5e7eb ${getRangeProgress(
                        tenure,
                        tenureUnit === "years" ? 1 : 1,
                        tenureUnit === "years" ? 30 : 360
                      )})`,
                    }}
                    aria-label={`Adjust tenure in ${tenureUnit}`}
                  />
                  <input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenureFromInput(e.target.value)}
                    placeholder={
                      tenureUnit === "years" ? "e.g., 10" : "e.g., 120"
                    }
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="1"
                    max={tenureUnit === "years" ? 30 : 360}
                    step={tenureUnit === "years" ? 0.1 : 1}
                    aria-describedby="tenure-desc"
                  />
                  {errors.tenure && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.tenure}
                    </p>
                  )}
                </motion.div>

                {/* Processing Fee */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="processingFee"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <DollarSign
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Processing Fee (₹)
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="processingFee-desc"
                    />
                  </label>
                  <input
                    id="processingFee-range"
                    type="range"
                    min="0"
                    max="50000"
                    step="5000"
                    value={processingFee || "0"}
                    onChange={(e) => setProcessingFee(e.target.value)}
                    className="w-full mt-1 h-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(to right, #bfdbfe ${getRangeProgress(
                        processingFee || "0",
                        0,
                        50000
                      )}, #e5e7eb ${getRangeProgress(
                        processingFee || "0",
                        0,
                        50000
                      )})`,
                    }}
                    aria-label="Adjust processing fee"
                  />
                  <input
                    id="processingFee"
                    type="number"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(e.target.value)}
                    placeholder="0"
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    min="0"
                    aria-describedby="processingFee-desc"
                  />
                  {errors.processingFee && (
                    <p role="alert" className="text-red-500 text-xs mt-1">
                      {errors.processingFee}
                    </p>
                  )}
                </motion.div>

                {/* EMI Type */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="emiType"
                    className="flex items-center text-base font-medium text-black"
                  >
                    EMI Type
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="emiType-desc"
                    />
                  </label>
                  <select
                    id="emiType"
                    value={emiType}
                    onChange={(e) =>
                      setEmiType(e.target.value as "reducing" | "flat")
                    }
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    aria-describedby="emiType-desc"
                  >
                    <option value="reducing">Reducing Balance</option>
                    <option value="flat">Flat Rate</option>
                  </select>
                </motion.div>

                {/* Start Date */}
                <motion.div variants={inputVariants}>
                  <label
                    htmlFor="startDate"
                    className="flex items-center text-base font-medium text-black"
                  >
                    <Calendar
                      className="w-4 h-4 mr-1 animate-pulse"
                      aria-hidden="true"
                    />{" "}
                    Start Date
                    <Info
                      className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
                      aria-describedby="startDate-desc"
                    />
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full border-blue-500 bg-white text-black rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-105 transition-all"
                    aria-describedby="startDate-desc"
                  />
                </motion.div>
              </>
            )}
          </fieldset>
        </form>
      )}

      {/* Results Section */}
      {result && !isLoading && (
        <motion.article
          id="emi-results"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 sm:p-6 bg-white rounded-lg shadow-md"
          aria-labelledby="emi-results-heading"
        >
          <h2
            id="emi-results-heading"
            className="text-lg font-semibold text-black mb-3"
          >
            EMI Results
          </h2>
          <div className="space-y-3">
            {/* Salary Tip */}
            {tabType === "salary" && parseFloat(salary) < 30000 && (
              <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-600 text-base">
                <p>
                  <strong>Tip:</strong> Your salary is below ₹30,000. Consider a
                  smaller loan amount or longer tenure to improve affordability.
                </p>
              </div>
            )}

            {/* Standard View */}
            {!showProfessionalView && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                <p className="text-black">
                  Monthly EMI: {formatter.format(result.monthlyEmi)}
                </p>
                <p className="text-black">
                  Total Interest: {formatter.format(result.totalInterest)}
                </p>
                <p className="text-black">
                  Processing Fee: {formatter.format(result.totalProcessingFee)}
                </p>
                <p className="text-black">
                  Total Payable: {formatter.format(result.totalAmount)}
                </p>
                {tabType === "salary" && (
                  <p className="text-black">
                    Affordability:{" "}
                    {isEmiAffordable ? "Affordable" : "Exceeds 40% of salary"}
                  </p>
                )}
              </div>
            )}

            {/* Professional View */}
            {showProfessionalView && (
              <div className="space-y-3 text-base">
                <h3 className="font-medium text-black">
                  Loan Summary for{" "}
                  {tabType === "salary" ? "Loan Based on Salary" : productName}
                </h3>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-1 pr-4 font-medium text-black">
                        Monthly EMI
                      </td>
                      <td className="text-black">
                        {formatter.format(result.monthlyEmi)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium text-black">
                        Total Interest
                      </td>
                      <td className="text-black">
                        {formatter.format(result.totalInterest)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium text-black">
                        Processing Fee
                      </td>
                      <td className="text-black">
                        {formatter.format(result.totalProcessingFee)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium text-black">
                        Total Payable
                      </td>
                      <td className="text-black">
                        {formatter.format(result.totalAmount)}
                      </td>
                    </tr>
                    {tabType !== "salary" && (
                      <>
                        <tr>
                          <td className="py-1 pr-4 font-medium text-black">
                            Loan Type
                          </td>
                          <td className="text-black">
                            {emiType === "reducing"
                              ? "Reducing Balance"
                              : "Flat Rate"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-4 font-medium text-black">
                            Start Date
                          </td>
                          <td className="text-black">{startDate || "N/A"}</td>
                        </tr>
                      </>
                    )}
                    {tabType === "salary" && (
                      <tr>
                        <td className="py-1 pr-4 font-medium text-black">
                          Affordability
                        </td>
                        <td className="text-black">
                          {isEmiAffordable
                            ? "Affordable"
                            : "Exceeds 40% of salary"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Chart */}
            <div className="h-48 sm:h-64">
              <Pie
                data={chartData!}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => formatter.format(ctx.parsed),
                      },
                    },
                  },
                }}
                aria-label="EMI breakdown chart"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowProfessionalView(!showProfessionalView)}
                className="px-3 py-1 bg-blue-200 text-black rounded-md hover:bg-blue-300 text-base flex items-center justify-center transition-colors"
                aria-label={
                  showProfessionalView
                    ? "Switch to standard view"
                    : "Switch to professional view"
                }
              >
                <FileText
                  className="w-4 h-4 mr-1 animate-pulse"
                  aria-hidden="true"
                />
                {showProfessionalView ? "Standard View" : "Professional View"}
              </button>
              <button
                onClick={downloadPdf}
                className="px-3 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 text-base flex items-center justify-center transition-colors"
                aria-label="Download EMI report as PDF"
              >
                <Download
                  className="w-4 h-4 mr-1 animate-pulse"
                  aria-hidden="true"
                />
                Download PDF
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    productName,
                    loanAmount,
                    downPayment: downPayment || "0",
                    interestRate,
                    tenure,
                    tenureUnit,
                    emiType,
                    startDate: startDate || "",
                    processingFee: processingFee || "0",
                    ...(tabType === "salary" && { salary, desiredEmi }),
                  });
                  navigator.clipboard.writeText(
                    `${window.location.origin}/emi-calculator?${params}`
                  );
                  alert("Link copied!");
                }}
                className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-base flex items-center justify-center transition-colors"
                aria-label="Share EMI results"
              >
                Share
              </button>
            </div>
          </div>
        </motion.article>
      )}
    </motion.section>
  );
};

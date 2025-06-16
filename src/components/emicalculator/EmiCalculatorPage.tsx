"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import LoanInputForm from "./LoanInputForm";
import ResultsDisplay from "./ResultsDisplay";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  EmiResult,
  EmiCalculatorProps,
  Errors,
  ChartData,
} from "@/interface/types";
import { calculateEmi } from "@/utils/utils";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const EmiCalculatorPage: React.FC<EmiCalculatorProps> = ({
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
  const chartData = useMemo<ChartData | null>(() => {
    if (!result) return null;
    return {
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
    };
  }, [result, loanAmount, downPayment, tabType]);

  // Affordability check for salary tab
  const isEmiAffordable =
    tabType === "salary" && parseFloat(desiredEmi) <= parseFloat(salary) * 0.4;

  // Download results as PDF
  const downloadPdf = async () => {
    const element = document.getElementById("emi-results");
    if (!element) {
      alert("Error: Could not generate PDF.");
      return;
    }
    try {
      const dataUrl = await toPng(element, { quality: 0.95 });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;
      pdf.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${productName || "Loan"}_EMI_Report.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <main
      className="max-w-3xl mx-auto p-4 sm:p-6"
      aria-labelledby="emi-calculator-heading"
    >
      <header>
        <h1
          id="emi-calculator-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
        >
          EMI Calculator
        </h1>
      </header>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <LoanInputForm
            tabType={tabType}
            productName={productName}
            setProductName={setProductName}
            loanAmount={loanAmount}
            setLoanAmount={setLoanAmount}
            downPayment={downPayment}
            setDownPayment={setDownPayment}
            interestRate={interestRate}
            setInterestRate={setInterestRate}
            tenure={tenure}
            setTenure={setTenureFromInput}
            tenureUnit={tenureUnit}
            setTenureUnit={setTenureUnit}
            startDate={startDate}
            setStartDate={setStartDate}
            processingFee={processingFee}
            setProcessingFee={setProcessingFee}
            emiType={emiType}
            setEmiType={setEmiType}
            salary={salary}
            setSalary={setSalary}
            desiredEmi={desiredEmi}
            setDesiredEmi={setDesiredEmi}
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            bankRates={bankRates}
            errors={errors}
          />
        )}
        {result && !isLoading && (
          <ResultsDisplay
            result={result}
            tabType={tabType}
            productName={productName}
            emiType={emiType}
            startDate={startDate}
            isEmiAffordable={isEmiAffordable}
            showProfessionalView={showProfessionalView}
            setShowProfessionalView={setShowProfessionalView}
            chartData={chartData}
            downloadPdf={downloadPdf}
            loanAmount={loanAmount}
            downPayment={downPayment}
            interestRate={interestRate}
            tenure={tenure}
            tenureUnit={tenureUnit}
            processingFee={processingFee}
            salary={salary}
            desiredEmi={desiredEmi}
          />
        )}
      </motion.section>
    </main>
  );
};

export default EmiCalculatorPage;

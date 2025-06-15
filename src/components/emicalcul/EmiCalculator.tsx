"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Info, DollarSign, Percent, IndianRupee } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
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
}

interface Errors {
  productName?: string;
  price?: string;
  downPayment?: string;
  interestRate?: string;
  tenure?: string;
}

// Custom Indian number formatter to avoid locale mismatches
const formatIndianNumber = (num: number): string => {
  const str = num.toFixed(0);
  const lastThree = str.slice(-3);
  const otherDigits = str.slice(0, -3);
  if (otherDigits !== "") {
    return `${otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
  }
  return lastThree;
};

const calculateEmi = (
  price: number,
  downPayment: number,
  interestRate: number,
  tenure: number,
  emiType: "reducing" | "flat",
  startDate: string,
  noCostEmi: boolean
): EmiResult => {
  const principal = price - downPayment;
  const rate = noCostEmi ? 0 : interestRate / 100 / 12;
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
    ).toLocaleString("en-IN", {
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
    totalAmount: monthlyEmi * tenure + downPayment,
    schedule,
  };
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  defaultValues,
}) => {
  const [productName, setProductName] = useState(defaultValues.productName);
  const [price, setPrice] = useState(defaultValues.price);
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState(defaultValues.interestRate);
  const [tenure, setTenure] = useState(defaultValues.tenure);
  const [startDate, setStartDate] = useState("");
  const [emiType, setEmiType] = useState<"reducing" | "flat">("reducing");
  const [noCostEmi, setNoCostEmi] = useState(false);
  const [result, setResult] = useState<EmiResult | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isClient, setIsClient] = useState(false);

  // Ensure animations and locale-dependent rendering only happen on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProductName(params.get("productName") || defaultValues.productName);
    setPrice(params.get("price") || defaultValues.price);
    setDownPayment(params.get("downPayment") || "");
    setInterestRate(params.get("interestRate") || defaultValues.interestRate);
    setTenure(params.get("tenure") || defaultValues.tenure);
    setStartDate(params.get("startDate") || "");
    setEmiType((params.get("emiType") as "reducing" | "flat") || "reducing");
    setNoCostEmi(params.get("noCostEmi") === "true");
  }, [defaultValues]);

  const validateInputs = () => {
    const newErrors: Errors = {};
    const priceNum = parseFloat(price);
    const downPaymentNum = parseFloat(downPayment || "0");
    const interestRateNum = parseFloat(interestRate);
    const tenureNum = parseInt(tenure);

    if (!productName.trim()) newErrors.productName = "Required";
    if (!price || priceNum <= 0) newErrors.price = "Must be > 0";
    if (downPayment && (downPaymentNum < 0 || downPaymentNum >= priceNum))
      newErrors.downPayment = "Must be 0 to price";
    if (!interestRate || interestRateNum < 0 || interestRateNum > 100)
      newErrors.interestRate = "Must be 0-100";
    if (!tenure || tenureNum <= 0 || tenureNum > 360)
      newErrors.tenure = "Must be 1-360";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validateInputs()) {
      const result = calculateEmi(
        parseFloat(price),
        parseFloat(downPayment || "0"),
        parseFloat(interestRate),
        parseInt(tenure),
        emiType,
        startDate,
        noCostEmi
      );
      setResult(result);
    } else {
      setResult(null);
    }
  }, [
    price,
    downPayment,
    interestRate,
    tenure,
    emiType,
    startDate,
    noCostEmi,
    productName,
  ]);

  const chartData = result
    ? {
        labels: ["Principal", "Interest", "Down Payment"],
        datasets: [
          {
            data: [
              parseFloat(price) - parseFloat(downPayment || "0"),
              result.totalInterest,
              parseFloat(downPayment || "0"),
            ],
            backgroundColor: ["#60a5fa", "#f87171", "#34d399"],
            borderColor: ["#fff", "#fff", "#fff"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Avoid rendering until client-side to prevent hydration issues
  if (!isClient) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <form className="space-y-4">
          <fieldset className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Info className="w-4 h-4 mr-1" />
                  Product Name
                </label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  readOnly
                  className="w-full rounded-md border-gray-300 p-2"
                />
              </div>
              <div className="flex-1">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Price (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  readOnly
                  className="w-full rounded-md border-gray-300 p-2"
                />
              </div>
            </div>
          </fieldset>
        </form>
      </section>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={inputVariants}
      className="space-y-4 text-black bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      aria-labelledby="emi-calculator-heading"
    >
      <h2 id="emi-calculator-heading" className="sr-only">
        EMI Calculator Form
      </h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="space-y-4">
          <legend className="sr-only">EMI Input Fields</legend>

          <motion.div
            variants={inputVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative group">
              <label
                htmlFor="productName"
                className="flex items-center text-sm font-medium text-gray-700 mb-1"
              >
                <Info className="w-4 h-4 mr-1" aria-hidden="true" />
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Smartphone"
                className="w-full rounded-md border-1 border-sky-400 p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                aria-required="true"
              />
              <div className="absolute hidden group-hover:block top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Enter the name of the product or loan type
              </div>
              {errors.productName && (
                <p role="alert" className="text-red-500 text-xs mt-1">
                  {errors.productName}
                </p>
              )}
            </div>
            <div className="flex-1 relative group">
              <label
                htmlFor="price"
                className="flex items-center text-sm font-medium text-gray-700 mb-1"
              >
                <IndianRupee className="w-4 h-4 mr-1" aria-hidden="true" />
                Price (₹)
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 5000000"
                className="w-full border-1 border-sky-400 rounded-md  p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                min="0"
                aria-required="true"
              />
              <div className="absolute hidden group-hover:block top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Enter the total price or loan amount
              </div>
              <input
                id="price-range"
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-2 border-1 border-sky-400 bg-blue-100 rounded-lg cursor-pointer mt-2"
                aria-label="Adjust product price"
              />
              <span className="text-xs text-gray-500 mt-1 block">
                ₹{formatIndianNumber(parseFloat(price) || 0)}
              </span>
              {errors.price && (
                <p role="alert" className="text-red-500 text-xs mt-1">
                  {errors.price}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div variants={inputVariants} className="relative group">
            <label
              htmlFor="downPayment"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <DollarSign className="w-4 h-4 mr-1" aria-hidden="true" />
              Down Payment (₹, optional)
            </label>
            <input
              id="downPayment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="0"
              className="w-full rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              min="0"
            />
            <div className="absolute hidden group-hover:block top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Amount paid upfront
            </div>
            {errors.downPayment && (
              <p role="alert" className="text-red-500 text-xs mt-1">
                {errors.downPayment}
              </p>
            )}
          </motion.div>

          <motion.div variants={inputVariants} className="relative group">
            <label
              htmlFor="interestRate"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Percent className="w-4 h-4 mr-1" aria-hidden="true" />
              Interest Rate (%)
            </label>
            <input
              id="interestRate"
              type="number"
              value={noCostEmi ? "0" : interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              disabled={noCostEmi}
              placeholder="e.g., 12"
              className="w-full rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all disabled:opacity-50"
              min="0"
              max="100"
              step="0.01"
            />
            <input
              id="interestRate-range"
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={noCostEmi ? "0" : interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              disabled={noCostEmi}
              className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer mt-2 disabled:opacity-50"
              aria-label="Adjust interest rate"
            />
            <div className="absolute hidden group-hover:block top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Annual interest rate (typical: 7-20%)
            </div>
            <span className="text-xs text-gray-500 mt-1 block">
              {noCostEmi ? "0%" : `${interestRate}%`}
            </span>
            {errors.interestRate && (
              <p role="alert" className="text-red-500 text-xs mt-1">
                {errors.interestRate}
              </p>
            )}
          </motion.div>

          <motion.div variants={inputVariants} className="relative group">
            <label
              htmlFor="tenure"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
              Tenure (Months)
            </label>
            <input
              id="tenure"
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="e.g., 12"
              className="w-full rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              min="1"
              max="360"
            />
            <input
              id="tenure-range"
              type="range"
              min="1"
              max="360"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer mt-2"
              aria-label="Adjust loan tenure"
            />
            <div className="absolute hidden group-hover:block top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Repayment period in months
            </div>
            <span className="text-xs text-gray-500 mt-1 block">
              {tenure} months
            </span>
            {errors.tenure && (
              <p role="alert" className="text-red-500 text-xs mt-1">
                {errors.tenure}
              </p>
            )}
          </motion.div>

          <motion.div variants={inputVariants} className="relative group">
            <label
              htmlFor="startDate"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
              Start Date (Optional)
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
            <div className="absolute hidden group-hover:block top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Date when EMI payments begin
            </div>
          </motion.div>

          <motion.div variants={inputVariants} className="relative group">
            <label
              htmlFor="emiType"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Info className="w-4 h-4 mr-1" aria-hidden="true" />
              EMI Type
            </label>
            <select
              id="emiType"
              value={emiType}
              onChange={(e) =>
                setEmiType(e.target.value as "reducing" | "flat")
              }
              className="w-full rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            >
              <option value="reducing">Reducing Balance</option>
              <option value="flat">Flat Rate</option>
            </select>
            <div className="absolute hidden group-hover:block top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Flat Rate: Higher interest; Reducing: Lower interest over time
            </div>
          </motion.div>

          <motion.div
            variants={inputVariants}
            className="flex items-center gap-2 relative group"
          >
            <input
              type="checkbox"
              id="noCostEmi"
              checked={noCostEmi}
              onChange={(e) => setNoCostEmi(e.target.checked)}
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 rounded"
              aria-label="Enable No-Cost EMI"
            />
            <label
              htmlFor="noCostEmi"
              className="text-sm text-gray-700 flex items-center"
            >
              No-Cost EMI{" "}
              {noCostEmi && (
                <span className="text-green-500 ml-1">(0% Interest)</span>
              )}
            </label>
            <div className="absolute hidden group-hover:block top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              No interest charged; equal payments
            </div>
          </motion.div>
        </fieldset>
      </form>

      {result && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm"
          aria-labelledby="emi-results-heading"
        >
          <h2
            id="emi-results-heading"
            className="text-lg font-semibold text-blue-700 mb-4"
          >
            EMI Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-white rounded-md shadow">
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-lg font-bold text-blue-600">
                ₹{formatIndianNumber(result.monthlyEmi)}
              </p>
            </div>
            <div className="p-3 bg-white rounded-md shadow">
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-lg font-bold text-red-500">
                ₹{formatIndianNumber(result.totalInterest)}
              </p>
            </div>
            <div className="p-3 bg-white rounded-md shadow">
              <p className="text-sm text-gray-600">Total Payable</p>
              <p className="text-lg font-bold text-green-500">
                ₹{formatIndianNumber(result.totalAmount)}
              </p>
            </div>
          </div>

          <section className="mt-4" aria-labelledby="emi-breakdown-heading">
            <h3
              id="emi-breakdown-heading"
              className="text-md font-semibold text-blue-700 mb-2"
            >
              Cost Breakdown
            </h3>
            <div className="h-64 max-w-xs mx-auto">
              <Pie
                data={chartData!}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top", labels: { font: { size: 12 } } },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `₹${formatIndianNumber(context.parsed)}`,
                      },
                    },
                  },
                }}
                aria-label="EMI breakdown chart"
              />
            </div>
          </section>

          <section className="mt-6" aria-labelledby="explanations-heading">
            <h3
              id="explanations-heading"
              className="text-md font-semibold text-blue-700 mb-2"
            >
              Key Terms
            </h3>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 rounded-lg text-sm text-gray-600 space-y-3"
            >
              <div>
                <h4 className="font-semibold">Flat Rate EMI</h4>
                <p>Interest on initial loan amount; higher cost.</p>
              </div>
              <div>
                <h4 className="font-semibold">Reducing Balance EMI</h4>
                <p>Interest on outstanding balance; lower cost.</p>
              </div>
              <div>
                <h4 className="font-semibold">No-Cost EMI</h4>
                <p>0% interest; equal payments over tenure.</p>
              </div>
              <div>
                <h4 className="font-semibold">Down Payment</h4>
                <p>Upfront payment to reduce loan amount.</p>
              </div>
            </motion.div>
          </section>

          {result.schedule.length > 0 && (
            <section
              className="mt-6"
              aria-labelledby="payment-schedule-heading"
            >
              <h3
                id="payment-schedule-heading"
                className="text-md font-semibold text-blue-700 mb-2"
              >
                Payment Schedule
              </h3>
              <div className="overflow-x-auto rounded-lg">
                <table
                  className="w-full text-sm text-gray-600"
                  aria-label="EMI payment schedule"
                >
                  <thead className="text-xs uppercase bg-blue-100">
                    <tr>
                      <th scope="col" className="px-4 py-2">
                        Month
                      </th>
                      <th scope="col" className="px-4 py-2">
                        EMI (₹)
                      </th>
                      <th scope="col" className="px-4 py-2">
                        Principal (₹)
                      </th>
                      <th scope="col" className="px-4 py-2">
                        Interest (₹)
                      </th>
                      <th scope="col" className="px-4 py-2">
                        Balance (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 py-2">{item.month}</td>
                        <td className="px-4 py-2">
                          {formatIndianNumber(item.emi)}
                        </td>
                        <td className="px-4 py-2">
                          {formatIndianNumber(item.principal)}
                        </td>
                        <td className="px-4 py-2">
                          {formatIndianNumber(item.interest)}
                        </td>
                        <td className="px-4 py-2">
                          {formatIndianNumber(item.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </motion.article>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const params = new URLSearchParams({
                productName,
                price,
                downPayment: downPayment || "0",
                interestRate,
                tenure,
                emiType,
                noCostEmi: noCostEmi.toString(),
                startDate: startDate || "",
              });
              navigator.clipboard.writeText(
                `${window.location.origin}/emi-calculator?${params}`
              );
              alert("Link copied to clipboard!");
            }}
            className="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-all"
            aria-label="Share EMI calculation results"
          >
            Share Results
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
};

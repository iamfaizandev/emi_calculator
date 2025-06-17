"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Download, FileText, Share2 } from "lucide-react";
import { EmiResult, EmiCalculatorProps, ChartData } from "@/interface/types";
import { formatter } from "@/utils/utils";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components for Pie chart
Chart.register(ArcElement, Tooltip, Legend);

interface ResultsDisplayProps {
  result: EmiResult;
  tabType: EmiCalculatorProps["tabType"];
  productName: string;
  emiType: "reducing" | "flat";
  startDate: string;
  isEmiAffordable: boolean;
  showProfessionalView: boolean;
  setShowProfessionalView: (value: boolean) => void;
  chartData: ChartData | null;
  downloadPdf: () => void;
  loanAmount: string;
  downPayment: string;
  interestRate: string;
  tenure: string;
  tenureUnit: "months" | "years";
  processingFee: string;
  salary: string;
  desiredEmi: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  tabType,
  productName,
  emiType,
  startDate,
  isEmiAffordable,
  showProfessionalView,
  setShowProfessionalView,
  chartData,
  downloadPdf,
  loanAmount,
  downPayment,
  interestRate,
  tenure,
  tenureUnit,
  processingFee,
  salary,
  desiredEmi,
}) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUserName(storedName || null);
  }, []);

  const handleShare = () => {
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
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <motion.article
      id="emi-results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-4  p-3 sm:p-5 bg-white dark:bg-white rounded-xl shadow-lg"
      aria-labelledby="emi-results-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-3"
        aria-live="polite"
      >
        <p className="text-base sm:text-lg font-semibold text-red-900 dark:text-black">
          {userName
            ? `Hello, ${userName}! Your EMI results are ready.`
            : "Hello! Your EMI results are ready."}
        </p>
      </motion.div>
      <h2
        id="emi-results-heading"
        className="text-base sm:text-lg font-semibold text-gray-900 dark:text-black mb-2 sm:mb-3"
      >
        EMI Results
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {tabType === "salary" &&
          parseFloat(result.monthlyEmi.toString()) < 30000 && (
            <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-600 dark:text-yellow-300 text-xs sm:text-sm">
              <p>
                <strong>Tip:</strong> Your salary is below ₹30,000. Consider a
                smaller loan or longer tenure for better affordability.
              </p>
            </div>
          )}

        {!showProfessionalView && (
          <div className="grid grid-cols-1 gap-2 text-sm sm:text-base">
            <p className="text-gray-900 dark:text-black">
              <span className="font-semibold">Monthly EMI:</span>{" "}
              {formatter.format(result.monthlyEmi)}
            </p>
            <p className="text-gray-900 dark:text-black">
              <span className="font-semibold">Total Interest:</span>{" "}
              {formatter.format(result.totalInterest)}
            </p>
            <p className="text-gray-900 dark:text-black">
              <span className="font-semibold">Processing Fee:</span>{" "}
              {formatter.format(result.totalProcessingFee)}
            </p>
            <p className="text-gray-900 dark:text-black">
              <span className="font-semibold">Total Payable:</span>{" "}
              {formatter.format(result.totalAmount)}
            </p>
            {tabType === "salary" && (
              <p className="text-gray-900 dark:text-black">
                <span className="font-semibold">Affordability:</span>{" "}
                {isEmiAffordable ? "Affordable" : "Exceeds 40% of salary"}
              </p>
            )}
          </div>
        )}

        {showProfessionalView && (
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              Loan Summary for{" "}
              {tabType === "salary" ? "Loan Based on Salary" : productName}
            </h3>
            <div className="space-y-1 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  Monthly EMI
                </span>
                <span className="text-gray-900 dark:text-black">
                  {formatter.format(result.monthlyEmi)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  Total Interest
                </span>
                <span className="text-gray-900 dark:text-black">
                  {formatter.format(result.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  Processing Fee
                </span>
                <span className="text-gray-900 dark:text-black">
                  {formatter.format(result.totalProcessingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  Total Payable
                </span>
                <span className="text-gray-900 dark:text-black">
                  {formatter.format(result.totalAmount)}
                </span>
              </div>
              {tabType !== "salary" && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Loan Type
                    </span>
                    <span className="text-gray-900 dark:text-black">
                      {emiType === "reducing"
                        ? "Reducing Balance"
                        : "Flat Rate"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Start Date
                    </span>
                    <span className="text-gray-900 dark:text-black">
                      {startDate || "N/A"}
                    </span>
                  </div>
                </>
              )}
              {tabType === "salary" && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Affordability
                  </span>
                  <span className="text-gray-900 dark:text-black">
                    {isEmiAffordable ? "Affordable" : "Exceeds 40% of salary"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {chartData && (
          <div className="h-40 sm:h-48 md:h-64 mt-4">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { font: { size: 12 } },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => formatter.format(ctx.parsed),
                    },
                  },
                  title: {
                    display: true,
                    text: "EMI Breakdown",
                    font: { size: 14 },
                  },
                },
              }}
              aria-label="EMI breakdown chart"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          <motion.button
            onClick={() => setShowProfessionalView(!showProfessionalView)}
            className="px-4 py-3 bg-blue-200 text-gray-900 dark:text-gray-900 rounded-lg hover:bg-blue-300 flex items-center justify-center text-sm sm:text-base font-medium transition-colors touch-manipulation"
            whileTap={{ scale: 0.95 }}
            animate={showProfessionalView ? { rotate: 1 } : { rotate: -1 }}
            transition={{ type: "spring", stiffness: 300 }}
            aria-label={
              showProfessionalView
                ? "Switch to standard view"
                : "Switch to professional view"
            }
          >
            <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
            {showProfessionalView ? "Standard View" : "Professional View"}
          </motion.button>
          <motion.button
            onClick={downloadPdf}
            className="px-4 py-3 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600 flex items-center justify-center text-sm sm:text-base font-medium transition-colors touch-manipulation"
            whileTap={{ scale: 0.95 }}
            aria-label="Download EMI report as PDF"
          >
            <Download className="w-5 h-5 mr-2" aria-hidden="true" />
            Download PDF
          </motion.button>
          <motion.button
            onClick={handleShare}
            className="px-4 py-3 bg-purple-500 text-black rounded-lg hover:bg-purple-600 flex items-center justify-center text-sm sm:text-base font-medium transition-colors touch-manipulation relative"
            whileTap={{ scale: 0.95 }}
            aria-label="Share EMI results"
          >
            <Share2 className="w-5 h-5 mr-2" aria-hidden="true" />
            Share
            <AnimatePresence>
              {showCopied && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-[-30px] bg-gray-800 text-black text-xs rounded px-2 py-1"
                >
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ResultsDisplay;

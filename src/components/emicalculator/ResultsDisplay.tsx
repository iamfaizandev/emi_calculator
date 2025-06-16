import React from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Download, FileText } from "lucide-react";
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
}) => (
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
      className="text-lg font-semibold text-gray-900 mb-3"
    >
      EMI Results
    </h2>
    <div className="space-y-3">
      {tabType === "salary" &&
        parseFloat(result.monthlyEmi.toString()) < 30000 && (
          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-600">
            <p>
              <strong>Tip:</strong> Your salary is below ₹30,000. Consider a
              smaller loan amount or longer tenure to improve affordability.
            </p>
          </div>
        )}

      {!showProfessionalView && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
          <p className="text-gray-900">
            Monthly EMI: {formatter.format(result.monthlyEmi)}
          </p>
          <p className="text-gray-900">
            Total Interest: {formatter.format(result.totalInterest)}
          </p>
          <p className="text-gray-900">
            Processing Fee: {formatter.format(result.totalProcessingFee)}
          </p>
          <p className="text-gray-900">
            Total Payable: {formatter.format(result.totalAmount)}
          </p>
          {tabType === "salary" && (
            <p className="text-gray-900">
              Affordability:{" "}
              {isEmiAffordable ? "Affordable" : "Exceeds 40% of salary"}
            </p>
          )}
        </div>
      )}

      {showProfessionalView && (
        <div className="space-y-3">
          <h3 className="text-base font-medium text-gray-900">
            Loan Summary for{" "}
            {tabType === "salary" ? "Loan Based on Salary" : productName}
          </h3>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr>
                <td className="py-1 pr-4 font-medium text-gray-900">
                  Monthly EMI
                </td>
                <td className="text-gray-900">
                  {formatter.format(result.monthlyEmi)}
                </td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-medium text-gray-900">
                  Total Interest
                </td>
                <td className="text-gray-900">
                  {formatter.format(result.totalInterest)}
                </td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-medium text-gray-900">
                  Processing Fee
                </td>
                <td className="text-gray-900">
                  {formatter.format(result.totalProcessingFee)}
                </td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-medium text-gray-900">
                  Total Payable
                </td>
                <td className="text-gray-900">
                  {formatter.format(result.totalAmount)}
                </td>
              </tr>
              {tabType !== "salary" && (
                <>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-900">
                      Loan Type
                    </td>
                    <td className="text-gray-900">
                      {emiType === "reducing"
                        ? "Reducing Balance"
                        : "Flat Rate"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-900">
                      Start Date
                    </td>
                    <td className="text-gray-900">{startDate || "N/A"}</td>
                  </tr>
                </>
              )}
              {tabType === "salary" && (
                <tr>
                  <td className="py-1 pr-4 font-medium text-gray-900">
                    Affordability
                  </td>
                  <td className="text-gray-900">
                    {isEmiAffordable ? "Affordable" : "Exceeds 40% of salary"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {chartData && (
        <div className="h-48 sm:h-64">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: (ctx) => formatter.format(ctx.parsed),
                  },
                },
                title: { display: true, text: "EMI Breakdown" },
              },
            }}
            aria-label="EMI breakdown chart"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setShowProfessionalView(!showProfessionalView)}
          className="px-3 py-1 bg-blue-200 text-gray-900 rounded-md hover:bg-blue-300 flex items-center justify-center transition-colors"
          aria-label={
            showProfessionalView
              ? "Switch to standard view"
              : "Switch to professional view"
          }
        >
          <FileText className="w-4 h-4 mr-1 animate-pulse" aria-hidden="true" />
          {showProfessionalView ? "Standard View" : "Professional View"}
        </button>
        <button
          onClick={downloadPdf}
          className="px-3 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 flex items-center justify-center transition-colors"
          aria-label="Download EMI report as PDF"
        >
          <Download className="w-4 h-4 mr-1 animate-pulse" aria-hidden="true" />
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
          className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center justify-center transition-colors"
          aria-label="Share EMI results"
        >
          Share
        </button>
      </div>
    </div>
  </motion.article>
);

export default ResultsDisplay;

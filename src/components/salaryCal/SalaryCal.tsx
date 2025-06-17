"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Download, Share2, RotateCcw, Info } from "lucide-react";
import { jsPDF } from "jspdf";
import InputField from "../emicalculator/InputField";
import { Header } from "../header/Header";
import PwaInstall from "@/components/PWAinstall";
import Footer from "../Footer";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { formatter } from "@/utils/utils";

Chart.register(ArcElement, Tooltip, Legend);

interface SalaryInputs {
  ctc: string;
  city: "metro" | "non-metro";
  hra: string;
  bonus: string;
  investment80C: string;
  investment80D: string;
  investmentNPS: string;
}

interface SalaryBreakup {
  basic: number;
  hra: number;
  hraExempt: number;
  allowances: number;
  bonus: number;
  gross: number;
  pfEmployee: number;
  pfEmployer: number;
  esicEmployee: number;
  esicEmployer: number;
  professionalTax: number;
  incomeTax: number;
  inHandMonthly: number;
  inHandAnnual: number;
}

const containerVariants: HTMLMotionProps<"div">["variants"] = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: "easeOut" },
  },
};

const itemVariants: HTMLMotionProps<"div">["variants"] = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const chartVariants: HTMLMotionProps<"div">["variants"] = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const warningVariants: HTMLMotionProps<"div">["variants"] = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const SalaryCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<SalaryInputs>({
    ctc: "1000000",
    city: "metro",
    hra: "200000",
    bonus: "50000",
    investment80C: "150000",
    investment80D: "25000",
    investmentNPS: "50000",
  });
  const [taxRegime, setTaxRegime] = useState<"new" | "old">("new");
  const [breakup, setBreakup] = useState<SalaryBreakup | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUserName(storedName || null);
  }, []);

  const calculateSalary = () => {
    const ctc = parseFloat(inputs.ctc) || 0;
    if (ctc < 250000) {
      setError("CTC must be at least ₹2,50,000.");
      setBreakup(null);
      return;
    }
    setError(null);

    // Salary Components
    const basic = ctc * 0.5;
    const hra = parseFloat(inputs.hra) || basic * 0.2;
    const bonus = parseFloat(inputs.bonus) || 0;
    const allowances = ctc - basic - hra - bonus;
    const grossAnnual = basic + hra + allowances + bonus;

    // Deductions
    const pfCap = 15000 * 12; // PF on basic up to ₹15,000/month
    const pfEmployee = Math.min(basic, pfCap) * 0.12;
    const pfEmployer = pfEmployee;
    const grossMonthly = grossAnnual / 12;
    const esicEmployee = grossMonthly < 21000 ? grossAnnual * 0.0075 : 0;
    const esicEmployer = grossMonthly < 21000 ? grossAnnual * 0.0325 : 0;
    const professionalTax = 2400; // Maharashtra-specific

    // HRA Exemption (Old Regime)
    const hraExempt =
      taxRegime === "old"
        ? Math.min(
            hra,
            inputs.city === "metro" ? basic * 0.5 : basic * 0.4,
            basic * 0.1
          )
        : 0;

    // Taxable Income
    let taxable = grossAnnual - pfEmployee - professionalTax;
    if (taxRegime === "old") {
      taxable -=
        hraExempt +
        (parseFloat(inputs.investment80C) || 0) +
        (parseFloat(inputs.investment80D) || 0) +
        (parseFloat(inputs.investmentNPS) || 0) +
        50000; // Standard deduction
    } else {
      taxable -= 50000; // Standard deduction
    }
    taxable = Math.max(0, taxable);

    // Income Tax (New Regime, FY 2025–26)
    let tax = 0;
    if (taxRegime === "new") {
      if (taxable > 1500000) tax = (taxable - 1500000) * 0.3 + 140000;
      else if (taxable > 1200000) tax = (taxable - 1200000) * 0.2 + 80000;
      else if (taxable > 1000000) tax = (taxable - 1000000) * 0.15 + 50000;
      else if (taxable > 700000) tax = (taxable - 700000) * 0.1 + 20000;
      else if (taxable > 300000) tax = (taxable - 300000) * 0.05;
    } else {
      // Old Regime (Simplified, 2025–26)
      if (taxable > 1000000) tax = (taxable - 1000000) * 0.3 + 112500;
      else if (taxable > 500000) tax = (taxable - 500000) * 0.2 + 12500;
      else if (taxable > 250000) tax = (taxable - 250000) * 0.05;
    }
    tax *= 1.04; // 4% cess

    // In-Hand Salary
    const inHandAnnual =
      grossAnnual - pfEmployee - esicEmployee - professionalTax - tax;
    const inHandMonthly = inHandAnnual / 12;

    setBreakup({
      basic,
      hra,
      hraExempt,
      allowances,
      bonus,
      gross: grossAnnual,
      pfEmployee,
      pfEmployer,
      esicEmployee,
      esicEmployer,
      professionalTax,
      incomeTax: tax,
      inHandMonthly,
      inHandAnnual,
    });
  };

  const downloadPdf = () => {
    if (!breakup) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Salary Breakup Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${userName || "User"}`, 20, 30);
    doc.text(`CTC: ${formatter.format(parseFloat(inputs.ctc))}`, 20, 40);
    doc.text(`Tax Regime: ${taxRegime === "new" ? "New" : "Old"}`, 20, 50);
    doc.text("Breakup:", 20, 60);
    doc.text(`Basic: ${formatter.format(breakup.basic)}`, 20, 70);
    doc.text(`HRA: ${formatter.format(breakup.hra)}`, 20, 80);
    doc.text(`Allowances: ${formatter.format(breakup.allowances)}`, 20, 90);
    doc.text(`Bonus: ${formatter.format(breakup.bonus)}`, 20, 100);
    doc.text(`PF (Employee): ${formatter.format(breakup.pfEmployee)}`, 20, 110);
    doc.text(`Income Tax: ${formatter.format(breakup.incomeTax)}`, 20, 120);
    doc.text(
      `In-Hand Monthly: ${formatter.format(breakup.inHandMonthly)}`,
      20,
      130
    );
    doc.save("salary_breakup.pdf");
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      ctc: inputs.ctc,
      city: inputs.city,
      hra: inputs.hra,
      bonus: inputs.bonus,
      investment80C: inputs.investment80C,
      investment80D: inputs.investment80D,
      investmentNPS: inputs.investmentNPS,
      taxRegime,
    });
    navigator.clipboard.writeText(
      `${window.location.origin}/salary-calculator?${params}`
    );
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const chartData = breakup
    ? {
        labels: ["Basic", "HRA", "Allowances", "Bonus", "PF", "Tax"],
        datasets: [
          {
            data: [
              breakup.basic,
              breakup.hra,
              breakup.allowances,
              breakup.bonus,
              breakup.pfEmployee,
              breakup.incomeTax,
            ],
            backgroundColor: [
              "#4ade80",
              "#facc15",
              "#60a5fa",
              "#f472b6",
              "#ef4444",
              "#6b7280",
            ],
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50  dark:bg-white">
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-gray-300/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8"
        >
          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-xl sm:text-2xl font-bold text-black dark:text-black mb-4"
          >
            Salary Breakup & In-Hand Calculator
          </motion.h1>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <InputField
              id="ctc"
              label="Annual CTC (₹)"
              value={inputs.ctc}
              onChange={(value) => setInputs({ ...inputs, ctc: value })}
              type="number"
              placeholder="Enter CTC"
              min={250000}
              required
              sliderMin={250000}
              sliderMax={5000000}
              sliderStep={10000}
            />
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="city"
                className="flex items-center text-base font-medium text-black dark:text-black mb-1"
              >
                <span>City Type</span>
                <Info
                  className="w-4 h-4 ml-1 hover:text-gray-500 transition-colors"
                  aria-hidden="true"
                />
              </label>
              <select
                id="city"
                value={inputs.city}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    city: e.target.value as "metro" | "non-metro",
                  })
                }
                className="block w-full border border-gray-300 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md p-2 text-base focus:ring-2 focus:ring-gray-400"
              >
                <option value="metro">
                  Metro (Delhi, Mumbai, Kolkata, Chennai)
                </option>
                <option value="non-metro">Non-Metro</option>
              </select>
            </motion.div>
            <InputField
              id="hra"
              label="Annual HRA (₹)"
              value={inputs.hra}
              onChange={(value) => setInputs({ ...inputs, hra: value })}
              type="number"
              placeholder="Enter HRA"
              min={0}
            />
            <InputField
              id="bonus"
              label="Annual Bonus (₹)"
              value={inputs.bonus}
              onChange={(value) => setInputs({ ...inputs, bonus: value })}
              type="number"
              placeholder="Enter Bonus"
              min={0}
            />
            <InputField
              id="investment80C"
              label="80C Investments (₹)"
              value={inputs.investment80C}
              onChange={(value) =>
                setInputs({ ...inputs, investment80C: value })
              }
              type="number"
              placeholder="Enter 80C (up to ₹1,50,000)"
              min={0}
              max={150000}
            />
            <InputField
              id="investment80D"
              label="80D Investments (₹)"
              value={inputs.investment80D}
              onChange={(value) =>
                setInputs({ ...inputs, investment80D: value })
              }
              type="number"
              placeholder="Enter 80D (up to ₹25,000)"
              min={0}
              max={25000}
            />
            <InputField
              id="investmentNPS"
              label="NPS Investments (₹)"
              value={inputs.investmentNPS}
              onChange={(value) =>
                setInputs({ ...inputs, investmentNPS: value })
              }
              type="number"
              placeholder="Enter NPS (up to ₹50,000)"
              min={0}
              max={50000}
            />
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center space-x-4"
            >
              <label className="text-base font-medium text-black dark:text-black">
                Tax Regime
              </label>
              <button
                onClick={() => setTaxRegime("new")}
                className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium ${
                  taxRegime === "new"
                    ? "bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
                    : "bg-white dark:bg-gray-800 text-gray-500"
                } transition-colors`}
              >
                New Regime
              </button>
              <button
                onClick={() => setTaxRegime("old")}
                className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium ${
                  taxRegime === "old"
                    ? "bg-gray-200 dark:bg-gray-600 text-black dark:white"
                    : "bg-white dark:bg-gray-800 text-gray-500"
                } transition-colors`}
              >
                Old Regime
              </button>
            </motion.div>
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-2"
            >
              <button
                onClick={calculateSalary}
                className="px-4 py-3 cursor-pointer bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-sm sm:text-base font-medium transition-colors touch-manipulation"
              >
                Calculate
              </button>
              <button
                onClick={() =>
                  setInputs({
                    ctc: "1000000",
                    city: "metro",
                    hra: "200000",
                    bonus: "50000",
                    investment80C: "150000",
                    investment80D: "25000",
                    investmentNPS: "50000",
                  })
                }
                className="px-4 py-3 cursor-pointer bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-sm sm:text-base font-medium transition-colors touch-manipulation"
              >
                <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                Reset
              </button>
            </motion.div>
          </motion.div>
          <AnimatePresence>
            {error && (
              <motion.div
                variants={warningVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mt-4 p-2 sm:p-3 bg-amber-50 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 rounded-md text-amber-600 dark:text-amber-300 text-xs sm:text-sm"
              >
                <p>{error}</p>
              </motion.div>
            )}
            {breakup && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 p-3 sm:p-5 bg-white/80 dark:bg-gray-200 backdrop-blur-lg rounded-xl shadow-lg"
              >
                <motion.p
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-base sm:text-lg font-semibold text-black dark:text-black mb-3"
                  aria-live="polite"
                >
                  {userName
                    ? `Hello, ${userName}! Your salary breakup is ready.`
                    : "Hello! Your salary breakup is ready."}
                </motion.p>
                <motion.h2
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-base sm:text-lg font-semibold text-black dark:text-black mb-2 sm:mb-3"
                >
                  Salary Breakup
                </motion.h2>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-2 text-sm sm:text-base"
                >
                  <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-black dark:text-black"
                  >
                    <span className="font-semibold">Basic Salary:</span>{" "}
                    {formatter.format(breakup.basic)}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-black dark:text-black"
                  >
                    <span className="font-semibold">HRA:</span>{" "}
                    {formatter.format(breakup.hra)} (
                    {formatter.format(breakup.hraExempt)} exempt)
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-black dark:text-black"
                  >
                    <span className="font-semibold">Allowances:</span>{" "}
                    {formatter.format(breakup.allowances)}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-black dark:text-black"
                  >
                    <span className="font-semibold">Bonus:</span>{" "}
                    {formatter.format(breakup.bonus)}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-black dark:text-black"
                  >
                    <span className="font-semibold">PF (Employee):</span>{" "}
                    {formatter.format(breakup.pfEmployee)}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-black dark:text-black"
                  >
                    <span className="font-semibold">Income Tax:</span>{" "}
                    {formatter.format(breakup.incomeTax)}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-black dark:text-black"
                  >
                    <span className="font-semibold">In-Hand Monthly:</span>{" "}
                    {formatter.format(breakup.inHandMonthly)}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-black dark:text-black"
                  >
                    <span className="font-semibold">In-Hand Annual:</span>{" "}
                    {formatter.format(breakup.inHandAnnual)}
                  </motion.p>
                </motion.div>
                {chartData && (
                  <motion.div
                    variants={chartVariants}
                    initial="hidden"
                    animate="visible"
                    className="h-40 sm:h-48 md:h-64 mt-4"
                  >
                    <Pie
                      className="text-black"
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
                            text: "Salary Breakup",
                            font: { size: 14 },
                          },
                        },
                      }}
                      aria-label="Salary breakup chart"
                    />
                  </motion.div>
                )}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-4 flex flex-col gap-2"
                >
                  <button
                    onClick={downloadPdf}
                    className="px-4 py-3 bg-gray-200 dark:bg-gray-600 text-black dark:text-black rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-sm sm:text-base font-medium transition-colors touch-manipulation"
                    aria-label="Download salary breakup as PDF"
                  >
                    <Download className="w-5 h-5 mr-2" aria-hidden="true" />
                    Download PDF
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="px-4 py-3 bg-gray-200 dark:bg-gray-600 text-black dark:text-black rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-sm sm:text-base font-medium transition-colors touch-manipulation w-full"
                      aria-label="Share salary breakup"
                    >
                      <Share2 className="w-5 h-5 mr-2" aria-hidden="true" />
                      Share
                    </button>
                    <AnimatePresence>
                      {showCopied && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs sm:text-sm rounded-lg px-2 py-1"
                          aria-live="polite"
                        >
                          Copied!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                <motion.div
                  variants={warningVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-4 p-2 sm:p-3 bg-amber-50 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 rounded-md text-amber-600 dark:text-amber-300 text-xs sm:text-sm"
                >
                  <p>
                    <strong>Tip:</strong> Maximize 80C (₹1,50,000), 80D
                    (₹25,000), and NPS (₹50,000) investments to reduce tax
                    liability in the old regime.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <PwaInstall />
      <Footer />
    </div>
  );
};

export default SalaryCalculator;

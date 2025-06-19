// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
// import { Pie } from "react-chartjs-2";
// import {
//   Download,
//   Share2,
//   ChevronDown,
//   ChevronUp,
//   Info,
//   RotateCcw,
// } from "lucide-react";
// import { jsPDF } from "jspdf";
// import InputField from "../emicalculator/InputField";
// import { Header } from "../header/Header";
// import PwaInstall from "@/components/PWAinstall";
// import Footer from "../Footer";
// import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
// import { formatter } from "@/utils/utils";

// Chart.register(ArcElement, Tooltip, Legend);

// interface SalaryInputs {
//   ctc: string;
//   city: "metro" | "non-metro";
//   hra: string;
//   bonus: string;
//   investment80C: string;
//   investment80D: string;
//   investmentNPS: string;
// }

// interface SalaryBreakup {
//   basic: number;
//   hra: number;
//   hraExempt: number;
//   allowances: number;
//   bonus: number;
//   gross: number;
//   pfEmployee: number;
//   pfEmployer: number;
//   esicEmployee: number;
//   esicEmployer: number;
//   professionalTax: number;
//   incomeTax: number;
//   inHandMonthly: number;
//   inHandAnnual: number;
// }

// const containerVariants: HTMLMotionProps<"div">["variants"] = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1, ease: "easeOut" },
//   },
// };

// const itemVariants: HTMLMotionProps<"div">["variants"] = {
//   hidden: { opacity: 0, y: 10 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
// };

// const chartVariants: HTMLMotionProps<"div">["variants"] = {
//   hidden: { opacity: 0, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: { duration: 0.4, ease: "easeOut" },
//   },
// };

// const warningVariants: HTMLMotionProps<"div">["variants"] = {
//   hidden: { opacity: 0, x: -20 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
// };

// const faqVariants: HTMLMotionProps<"section">["variants"] = {
//   hidden: { opacity: 0, x: 50 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

// const SalaryCalculator: React.FC = () => {
//   const [inputs, setInputs] = useState<SalaryInputs>({
//     ctc: "1000000",
//     city: "metro",
//     hra: "200000",
//     bonus: "50000",
//     investment80C: "150000",
//     investment80D: "25000",
//     investmentNPS: "50000",
//   });
//   const [taxRegime, setTaxRegime] = useState<"new" | "old">("new");
//   const [breakup, setBreakup] = useState<SalaryBreakup | null>(null);
//   const [showCopied, setShowCopied] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [userName, setUserName] = useState<string | null>(null);

//   useEffect(() => {
//     const storedName = localStorage.getItem("userName");
//     setUserName(storedName || null);
//   }, []);

//   const calculateSalary = () => {
//     const ctc = parseFloat(inputs.ctc) || 0;
//     if (ctc < 250000) {
//       setError("CTC must be at least ₹2,50,000.");
//       setBreakup(null);
//       return;
//     }
//     setError(null);

//     const basic = ctc * 0.5;
//     const hra = parseFloat(inputs.hra) || basic * 0.2;
//     const bonus = parseFloat(inputs.bonus) || 0;
//     const allowances = ctc - basic - hra - bonus;
//     const grossAnnual = basic + hra + allowances + bonus;

//     const pfCap = 15000 * 12;
//     const pfEmployee = Math.min(basic, pfCap) * 0.12;
//     const pfEmployer = pfEmployee;
//     const grossMonthly = grossAnnual / 12;
//     const esicEmployee = grossMonthly < 21000 ? grossAnnual * 0.0075 : 0;
//     const esicEmployer = grossMonthly < 21000 ? grossAnnual * 0.0325 : 0;
//     const professionalTax = 2400;

//     const hraExempt =
//       taxRegime === "old"
//         ? Math.min(
//             hra,
//             inputs.city === "metro" ? basic * 0.5 : basic * 0.4,
//             basic * 0.1
//           )
//         : 0;

//     let taxable = grossAnnual - pfEmployee - professionalTax;
//     if (taxRegime === "old") {
//       taxable -=
//         hraExempt +
//         (parseFloat(inputs.investment80C) || 0) +
//         (parseFloat(inputs.investment80D) || 0) +
//         (parseFloat(inputs.investmentNPS) || 0) +
//         50000;
//     } else {
//       taxable -= 50000;
//     }
//     taxable = Math.max(0, taxable);

//     let tax = 0;
//     if (taxRegime === "new") {
//       if (taxable > 1500000) tax = (taxable - 1500000) * 0.3 + 140000;
//       else if (taxable > 1200000) tax = (taxable - 1200000) * 0.2 + 80000;
//       else if (taxable > 1000000) tax = (taxable - 1000000) * 0.15 + 50000;
//       else if (taxable > 700000) tax = (taxable - 700000) * 0.1 + 20000;
//       else if (taxable > 300000) tax = (taxable - 300000) * 0.05;
//     } else {
//       if (taxable > 1000000) tax = (taxable - 1000000) * 0.3 + 112500;
//       else if (taxable > 500000) tax = (taxable - 500000) * 0.2 + 12500;
//       else if (taxable > 250000) tax = (taxable - 250000) * 0.05;
//     }
//     tax *= 1.04;

//     const inHandAnnual =
//       grossAnnual - pfEmployee - esicEmployee - professionalTax - tax;
//     const inHandMonthly = inHandAnnual / 12;

//     setBreakup({
//       basic,
//       hra,
//       hraExempt,
//       allowances,
//       bonus,
//       gross: grossAnnual,
//       pfEmployee,
//       pfEmployer,
//       esicEmployee,
//       esicEmployer,
//       professionalTax,
//       incomeTax: tax,
//       inHandMonthly,
//       inHandAnnual,
//     });
//   };

//   const downloadPdf = () => {
//     if (!breakup) return;
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Salary Breakup Report", 20, 20);
//     doc.setFontSize(12);
//     doc.text(`Name: ${userName || "User"}`, 20, 30);
//     doc.text(`CTC: ${formatter.format(parseFloat(inputs.ctc))}`, 20, 40);
//     doc.text(`Tax Regime: ${taxRegime === "new" ? "New" : "Old"}`, 20, 50);
//     doc.text("Breakup:", 20, 60);
//     doc.text(`Basic: ${formatter.format(breakup.basic)}`, 20, 70);
//     doc.text(`HRA: ${formatter.format(breakup.hra)}`, 20, 80);
//     doc.text(`Allowances: ${formatter.format(breakup.allowances)}`, 20, 90);
//     doc.text(`Bonus: ${formatter.format(breakup.bonus)}`, 20, 100);
//     doc.text(`PF (Employee): ${formatter.format(breakup.pfEmployee)}`, 20, 110);
//     doc.text(`Income Tax: ${formatter.format(breakup.incomeTax)}`, 20, 120);
//     doc.text(
//       `In-Hand Monthly: ${formatter.format(breakup.inHandMonthly)}`,
//       20,
//       130
//     );
//     doc.save("salary_breakup.pdf");
//   };

//   const handleShare = () => {
//     const params = new URLSearchParams({
//       ctc: inputs.ctc,
//       city: inputs.city,
//       hra: inputs.hra,
//       bonus: inputs.bonus,
//       investment80C: inputs.investment80C,
//       investment80D: inputs.investment80D,
//       investmentNPS: inputs.investmentNPS,
//       taxRegime,
//     });
//     navigator.clipboard.writeText(
//       `${window.location.origin}/salary-calculator?${params}`
//     );
//     setShowCopied(true);
//     setTimeout(() => setShowCopied(false), 2000);
//   };

//   const chartData = breakup
//     ? {
//         labels: ["Basic", "HRA", "Allowances", "Bonus", "PF", "Tax"],
//         datasets: [
//           {
//             data: [
//               breakup.basic,
//               breakup.hra,
//               breakup.allowances,
//               breakup.bonus,
//               breakup.pfEmployee,
//               breakup.incomeTax,
//             ],
//             backgroundColor: [
//               "#4ade80",
//               "#facc15",
//               "#60a5fa",
//               "#f472b6",
//               "#ef4444",
//               "#6b7280",
//             ],
//           },
//         ],
//       }
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-white">
//       <Header />
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8"
//       >
//         <div className="flex flex-col sm:flex-row gap-6">
//           {/* Calculator Section */}
//           <motion.section
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             viewport={{ once: true }}
//             className="w-full sm:w-2/3 bg-white/80 dark:bg-gray-200 backdrop-blur-lg rounded-xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-0"
//           >
//             <motion.h1
//               variants={itemVariants}
//               className="text-2xl sm:text-3xl font-bold text-black dark:text-black mb-6"
//             >
//               Salary Breakup & In-Hand Calculator
//             </motion.h1>
//             <motion.div variants={containerVariants} className="space-y-6">
//               <InputField
//                 id="ctc"
//                 label="Annual CTC (₹)"
//                 value={inputs.ctc}
//                 onChange={(value) => setInputs({ ...inputs, ctc: value })}
//                 type="number"
//                 placeholder="Enter CTC"
//                 min={250000}
//                 required
//                 sliderMin={250000}
//                 sliderMax={5000000}
//                 sliderStep={10000}
//               />
//               <motion.div variants={itemVariants}>
//                 <label
//                   htmlFor="city"
//                   className="flex items-center text-base font-medium text-black dark:text-black mb-2"
//                 >
//                   <span>City Type</span>
//                   <Info
//                     className="w-4 h-4 ml-1 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
//                     aria-hidden="true"
//                   />
//                 </label>
//                 <select
//                   id="city"
//                   value={inputs.city}
//                   onChange={(e) =>
//                     setInputs({
//                       ...inputs,
//                       city: e.target.value as "metro" | "non-metro",
//                     })
//                   }
//                   className="block w-full border border-gray-300 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md p-3 text-base focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="metro">
//                     Metro (Delhi, Mumbai, Kolkata, Chennai)
//                   </option>
//                   <option value="non-metro">Non-Metro</option>
//                 </select>
//               </motion.div>
//               <InputField
//                 id="hra"
//                 label="Annual HRA (₹)"
//                 value={inputs.hra}
//                 onChange={(value) => setInputs({ ...inputs, hra: value })}
//                 type="number"
//                 placeholder="Enter HRA"
//                 min={0}
//               />
//               <InputField
//                 id="bonus"
//                 label="Annual Bonus (₹)"
//                 value={inputs.bonus}
//                 onChange={(value) => setInputs({ ...inputs, bonus: value })}
//                 type="number"
//                 placeholder="Enter Bonus"
//                 min={0}
//               />
//               <InputField
//                 id="investment80C"
//                 label="80C Investments (₹)"
//                 value={inputs.investment80C}
//                 onChange={(value) =>
//                   setInputs({ ...inputs, investment80C: value })
//                 }
//                 type="number"
//                 placeholder="Enter 80C (up to ₹1,50,000)"
//                 min={0}
//                 max={150000}
//               />
//               <InputField
//                 id="investment80D"
//                 label="80D Investments (₹)"
//                 value={inputs.investment80D}
//                 onChange={(value) =>
//                   setInputs({ ...inputs, investment80D: value })
//                 }
//                 type="number"
//                 placeholder="Enter 80D (up to ₹25,000)"
//                 min={0}
//                 max={25000}
//               />
//               <InputField
//                 id="investmentNPS"
//                 label="NPS Investments (₹)"
//                 value={inputs.investmentNPS}
//                 onChange={(value) =>
//                   setInputs({ ...inputs, investmentNPS: value })
//                 }
//                 type="number"
//                 placeholder="Enter NPS (up to ₹50,000)"
//                 min={0}
//                 max={50000}
//               />
//               <motion.div
//                 variants={itemVariants}
//                 className="flex items-center gap-4"
//               >
//                 <label className="text-base font-medium text-black dark:text-black">
//                   Tax Regime
//                 </label>
//                 <button
//                   onClick={() => setTaxRegime("new")}
//                   className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium ${
//                     taxRegime === "new"
//                       ? "bg-blue-600 text-white"
//                       : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400"
//                   } transition-colors`}
//                 >
//                   New Regime
//                 </button>
//                 <button
//                   onClick={() => setTaxRegime("old")}
//                   className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium ${
//                     taxRegime === "old"
//                       ? "bg-blue-600 text-white"
//                       : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400"
//                   } transition-colors`}
//                 >
//                   Old Regime
//                 </button>
//               </motion.div>
//               <motion.div
//                 variants={itemVariants}
//                 className="flex flex-col sm:flex-row gap-2"
//               >
//                 <button
//                   onClick={calculateSalary}
//                   className="px-4 py-2 cursor-pointer bg-black text-white rounded-md hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base font-medium transition-colors"
//                 >
//                   Calculate
//                 </button>
//                 <button
//                   onClick={() =>
//                     setInputs({
//                       ctc: "1000000",
//                       city: "metro",
//                       hra: "200000",
//                       bonus: "50000",
//                       investment80C: "150000",
//                       investment80D: "25000",
//                       investmentNPS: "50000",
//                     })
//                   }
//                   className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-sm sm:text-base font-medium transition-colors"
//                 >
//                   <RotateCcw className="w-5 h-5 mr-2" />
//                   Reset
//                 </button>
//               </motion.div>
//             </motion.div>
//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   variants={warningVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="hidden"
//                   className="mt-4 p-4 bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 rounded-md text-amber-700 dark:text-amber-300 text-sm"
//                 >
//                   <p>{error}</p>
//                 </motion.div>
//               )}
//               {breakup && (
//                 <motion.div
//                   variants={containerVariants}
//                   className="mt-6 p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg"
//                 >
//                   <motion.p
//                     variants={itemVariants}
//                     className="text-base sm:text-lg font-semibold text-black dark:text-white mb-3"
//                     aria-live="polite"
//                   >
//                     {userName
//                       ? `Hello, ${userName}! Your salary breakup is ready.`
//                       : "Hello! Your salary breakup is ready."}
//                   </motion.p>
//                   <motion.h2
//                     variants={itemVariants}
//                     className="text-base sm:text-lg font-semibold text-black dark:text-white mb-2 sm:mb-3"
//                   >
//                     Salary Breakup
//                   </motion.h2>
//                   <motion.div
//                     variants={containerVariants}
//                     className="grid grid-cols-1 gap-2 text-sm sm:text-base"
//                   >
//                     <motion.p
//                       variants={itemVariants}
//                       className="text-black dark:text-white"
//                     >
//                       <span className="font-semibold">Basic Salary:</span>{" "}
//                       {formatter.format(breakup.basic)}
//                     </motion.p>
//                     <motion.p
//                       variants={itemVariants}
//                       className="text-black dark:text-white"
//                     >
//                       <span className="font-semibold">HRA:</span>{" "}
//                       {formatter.format(breakup.hra)} (
//                       {formatter.format(breakup.hraExempt)} exempt)
//                     </motion.p>
//                     <motion.p
//                       variants={itemVariants}
//                       className="text-black dark:text-white"
//                     >
//                       <span className="font-semibold">Allowances:</span>{" "}
//                       {formatter.format(breakup.allowances)}
//                     </motion.p>
//                     <motion.p
//                       variants={itemVariants}
//                       className="text-black dark:text-white"
//                     >
//                       <span className="font-semibold">Bonus:</span>{" "}
//                       {formatter.format(breakup.bonus)}
//                     </motion.p>
//                     <motion.p
//                       variants={itemVariants}
//                       className="text-black dark:text-white"
//                     >
//                       <span className="font-semibold">PF (Employee):</span>{" "}
//                       {formatter.format(breakup.pfEmployee)}
//                     </motion.p>
//                     <motion.p
//                       variants={itemVariants}
//                       className="text-black dark:text-white"
//                     >
//                       <span className="font-semibold">Income Tax:</span>{" "}
//                       {formatter.format(breakup.incomeTax)}
//                     </motion.p>
//                     <motion.p
//                       variants={itemVariants}
//                       className="text-black dark:text-white"
//                     >
//                       <span className="font-semibold">In-Hand Monthly:</span>{" "}
//                       {formatter.format(breakup.inHandMonthly)}
//                     </motion.p>
//                     <motion.p
//                       variants={itemVariants}
//                       className="text-black dark:text-white"
//                     >
//                       <span className="font-semibold">In-Hand Annual:</span>{" "}
//                       {formatter.format(breakup.inHandAnnual)}
//                     </motion.p>
//                   </motion.div>
//                   {chartData && (
//                     <motion.div
//                       variants={chartVariants}
//                       className="h-40 sm:h-48 md:h-64 mt-4"
//                     >
//                       <Pie
//                         data={chartData}
//                         options={{
//                           responsive: true,
//                           maintainAspectRatio: false,
//                           plugins: {
//                             legend: {
//                               position: "bottom",
//                               labels: { font: { size: 12 } },
//                             },
//                             tooltip: {
//                               callbacks: {
//                                 label: (ctx) => formatter.format(ctx.parsed),
//                               },
//                             },
//                             title: {
//                               display: true,
//                               text: "Salary Breakup",
//                               font: { size: 14 },
//                             },
//                           },
//                         }}
//                         aria-label="Salary breakup chart"
//                       />
//                     </motion.div>
//                   )}
//                   <motion.div
//                     variants={containerVariants}
//                     className="mt-4 flex flex-col gap-2"
//                   >
//                     <button
//                       onClick={downloadPdf}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base font-medium transition-colors"
//                       aria-label="Download salary breakup as PDF"
//                     >
//                       <Download className="w-5 h-5 mr-2" aria-hidden="true" />
//                       Download PDF
//                     </button>
//                     <div className="relative">
//                       <button
//                         onClick={handleShare}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base font-medium transition-colors w-full"
//                         aria-label="Share salary breakup"
//                       >
//                         <Share2 className="w-5 h-5 mr-2" aria-hidden="true" />
//                         Share
//                       </button>
//                       <AnimatePresence>
//                         {showCopied && (
//                           <motion.div
//                             initial={{ opacity: 0, y: -10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: 10 }}
//                             className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs sm:text-sm rounded-md px-2 py-1"
//                             aria-live="polite"
//                           >
//                             Copied!
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   </motion.div>
//                   <motion.div
//                     variants={warningVariants}
//                     className="mt-4 p-4 bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 rounded-md text-amber-700 dark:text-amber-300 text-sm"
//                   >
//                     <p>
//                       <strong>Tip:</strong> Maximize 80C (₹1,50,000), 80D
//                       (₹25,000), and NPS (₹50,000) investments to reduce tax
//                       liability in the old regime.
//                     </p>
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.section>
//           {/* FAQ Section */}
//           <motion.section
//             variants={faqVariants}
//             initial="hidden"
//             animate="visible"
//             className="w-full sm:w-1/3 sm:sticky sm:top-20 bg-white/ dark:bg-gray-200 backdrop-blur-lg rounded-xl shadow-xl p-6 sm:p-8 mt-8 sm:mt-0"
//             aria-labelledby="faq-heading"
//           >
//             <h2
//               id="faq-heading"
//               className="text-xl font-bold text-black dark:text-black mb-4"
//             >
//               FAQs
//             </h2>
//             <div className="space-y-4">
//               <details className="group">
//                 <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-black dark:text-black">
//                   <span>80C Investments (₹)</span>
//                   <ChevronDown className="w-5 h-5 group-open:hidden" />
//                   <ChevronUp className="w-5 h-5 hidden group-open:block" />
//                 </summary>
//                 <p className="mt-2 text-sm text-gray-700 dark:text-black">
//                   Section 80C allows deductions up to ₹1,50,000 on investments
//                   like ELSS, PPF, EPF, life insurance premiums, and home loan
//                   principal repayment. Enter your annual investment amount to
//                   reduce taxable income in the old tax regime.
//                 </p>
//               </details>
//               <details className="group">
//                 <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-black dark:text-black">
//                   <span>80D Investments (₹)</span>
//                   <ChevronDown className="w-5 h-5 group-open:hidden" />
//                   <ChevronUp className="w-5 h-5 hidden group-open:block" />
//                 </summary>
//                 <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//                   Section 80D offers deductions up to ₹25,000 (₹50,000 for
//                   senior citizens) on health insurance premiums and preventive
//                   health check-ups. Input your annual expenditure to lower
//                   taxable income in the old regime.
//                 </p>
//               </details>
//               <details className="group">
//                 <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-black dark:text-black">
//                   <span>NPS Investments (₹)</span>
//                   <ChevronDown className="w-5 h-5 group-open:hidden" />
//                   <ChevronUp className="w-5 h-5 hidden group-open:block" />
//                 </summary>
//                 <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//                   National Pension System (NPS) contributions up to ₹50,000 are
//                   deductible under Section 80CCD(1B), in addition to 80C limits.
//                   Enter your annual NPS investment to optimize tax savings in
//                   the old regime.
//                 </p>
//               </details>
//               <details className="group">
//                 <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-black dark:text-black">
//                   <span>Annual CTC (₹)</span>
//                   <ChevronDown className="w-5 h-5 group-open:hidden" />
//                   <ChevronUp className="w-5 h-5 hidden group-open:block" />
//                 </summary>
//                 <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//                   Cost to Company (CTC) is your total annual compensation,
//                   including basic salary, HRA, allowances, bonuses, and employer
//                   contributions (e.g., PF, ESIC). Enter your CTC to calculate
//                   your in-hand salary.
//                 </p>
//               </details>
//               <details className="group">
//                 <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-black dark:text-black">
//                   <span>Annual HRA (₹)</span>
//                   <ChevronDown className="w-5 h-5 group-open:hidden" />
//                   <ChevronUp className="w-5 h-5 hidden group-open:block" />
//                 </summary>
//                 <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//                   House Rent Allowance (HRA) is a salary component to cover
//                   rental expenses. In the old regime, HRA exemptions are
//                   calculated based on rent paid, city type (metro: 50%,
//                   non-metro: 40%), and basic salary. Enter your annual HRA
//                   amount.
//                 </p>
//               </details>
//             </div>
//           </motion.section>
//         </div>
//       </motion.div>
//       <PwaInstall />
//       <Footer />
//     </div>
//   );
// };

// export default SalaryCalculator;
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { Pie } from "react-chartjs-2";
import {
  Download,
  Share2,
  Info,
  RotateCcw,
  X,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import { jsPDF } from "jspdf";
import InputField from "../emicalculator/InputField";
import { Header } from "../header/Header";
import PwaInstall from "@/components/PWAinstall";
import Footer from "../Footer";
import SalaryFAQ from "./SalaryFaq";
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
  lta: string;
  medical: string;
}

interface SalaryBreakup {
  basic: number;
  hra: number;
  hraExempt: number;
  allowances: number;
  bonus: number;
  lta: number;
  ltaExempt: number;
  medical: number;
  medicalExempt: number;
  gross: number;
  pfEmployee: number;
  pfEmployer: number;
  esicEmployee: number;
  esicEmployer: number;
  professionalTax: number;
  incomeTax: number;
  gratuity: number;
  inHandMonthly: number;
  inHandAnnual: number;
  taxSlabs: { range: string; rate: number; amount: number }[];
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
    lta: "20000",
    medical: "15000",
  });
  const [compareInputs, setCompareInputs] = useState<SalaryInputs | null>(null);
  const [taxRegime, setTaxRegime] = useState<"new" | "old">("new");
  const [breakup, setBreakup] = useState<SalaryBreakup | null>(null);
  const [compareBreakup, setCompareBreakup] = useState<SalaryBreakup | null>(
    null
  );
  const [showCopied, setShowCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "annual">("monthly");
  const [showTaxSlabs, setShowTaxSlabs] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const ctcPresets = [350000, 500000, 700000, 1000000, 1500000];

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const savedInputs = localStorage.getItem("salaryInputs");
    setUserName(storedName || null);
    if (savedInputs) {
      try {
        setInputs(JSON.parse(savedInputs));
      } catch (e) {
        console.error("Failed to parse saved inputs:", e);
      }
    }
  }, []);

  const calculateSalary = (data: SalaryInputs, isCompare: boolean = false) => {
    const ctc = parseFloat(data.ctc) || 0;
    if (ctc < 250000) {
      setError("CTC must be at least ₹2,50,000.");
      if (!isCompare) setBreakup(null);
      if (isCompare) setCompareBreakup(null);
      return;
    }
    setError(null);

    const basic = ctc * 0.5;
    const hra = parseFloat(data.hra) || basic * 0.2;
    const bonus = parseFloat(data.bonus) || 0;
    const lta = parseFloat(data.lta) || 0;
    const medical = parseFloat(data.medical) || 0;
    const allowances = ctc - basic - hra - bonus - lta - medical;
    const grossAnnual = basic + hra + allowances + bonus + lta + medical;

    const pfCap = 15000 * 12;
    const pfEmployee = Math.min(basic, pfCap) * 0.12;
    const pfEmployer = pfEmployee;
    const grossMonthly = grossAnnual / 12;
    const esicEmployee = grossMonthly < 21000 ? grossAnnual * 0.0075 : 0;
    const esicEmployer = grossMonthly < 21000 ? grossAnnual * 0.0325 : 0;
    const professionalTax = 2400;
    const gratuity = basic * 0.0481;

    const hraExempt =
      taxRegime === "old"
        ? Math.min(
            hra,
            data.city === "metro" ? basic * 0.5 : basic * 0.4,
            basic * 0.1
          )
        : 0;
    const ltaExempt = taxRegime === "old" ? Math.min(lta, 20000) : 0;
    const medicalExempt = taxRegime === "old" ? Math.min(medical, 15000) : 0;

    let taxable = grossAnnual - pfEmployee - professionalTax;
    // eslint-disable-next-line prefer-const
    let taxSlabs: { range: string; rate: number; amount: number }[] = [];
    if (taxRegime === "old") {
      taxable -=
        hraExempt +
        ltaExempt +
        medicalExempt +
        (parseFloat(data.investment80C) || 0) +
        (parseFloat(data.investment80D) || 0) +
        (parseFloat(data.investmentNPS) || 0) +
        50000;
      taxable = Math.max(0, taxable);
      if (taxable > 1000000) {
        taxSlabs.push({
          range: "₹10L+",
          rate: 30,
          amount: (taxable - 1000000) * 0.3,
        });
        taxSlabs.push({ range: "₹5L-₹10L", rate: 20, amount: 500000 * 0.2 });
        taxSlabs.push({ range: "₹2.5L-₹5L", rate: 5, amount: 250000 * 0.05 });
      } else if (taxable > 500000) {
        taxSlabs.push({
          range: "₹5L-₹10L",
          rate: 20,
          amount: (taxable - 500000) * 0.2,
        });
        taxSlabs.push({ range: "₹2.5L-₹5L", rate: 5, amount: 250000 * 0.05 });
      } else if (taxable > 250000) {
        taxSlabs.push({
          range: "₹2.5L-₹5L",
          rate: 5,
          amount: (taxable - 250000) * 0.05,
        });
      }
    } else {
      taxable -= 50000;
      taxable = Math.max(0, taxable);
      if (taxable > 1500000) {
        taxSlabs.push({
          range: "₹15L+",
          rate: 30,
          amount: (taxable - 1500000) * 0.3,
        });
        taxSlabs.push({ range: "₹12L-₹15L", rate: 20, amount: 300000 * 0.2 });
        taxSlabs.push({ range: "₹10L-₹12L", rate: 15, amount: 200000 * 0.15 });
        taxSlabs.push({ range: "₹7L-₹10L", rate: 10, amount: 300000 * 0.1 });
        taxSlabs.push({ range: "₹3L-₹7L", rate: 5, amount: 400000 * 0.05 });
      } else if (taxable > 1200000) {
        taxSlabs.push({
          range: "₹12L-₹15L",
          rate: 20,
          amount: (taxable - 1200000) * 0.2,
        });
        taxSlabs.push({ range: "₹10L-₹12L", rate: 15, amount: 200000 * 0.15 });
        taxSlabs.push({ range: "₹7L-₹10L", rate: 10, amount: 300000 * 0.1 });
        taxSlabs.push({ range: "₹3L-₹7L", rate: 5, amount: 400000 * 0.05 });
      } else if (taxable > 1000000) {
        taxSlabs.push({
          range: "₹10L-₹12L",
          rate: 15,
          amount: (taxable - 1000000) * 0.15,
        });
        taxSlabs.push({ range: "₹7L-₹10L", rate: 10, amount: 300000 * 0.1 });
        taxSlabs.push({ range: "₹3L-₹7L", rate: 5, amount: 400000 * 0.05 });
      } else if (taxable > 700000) {
        taxSlabs.push({
          range: "₹7L-₹10L",
          rate: 10,
          amount: (taxable - 700000) * 0.1,
        });
        taxSlabs.push({ range: "₹3L-₹7L", rate: 5, amount: 400000 * 0.05 });
      } else if (taxable > 300000) {
        taxSlabs.push({
          range: "₹3L-₹7L",
          rate: 5,
          amount: (taxable - 300000) * 0.05,
        });
      }
    }

    let tax = taxSlabs.reduce((sum, slab) => sum + slab.amount, 0);
    tax *= 1.04;

    const inHandAnnual =
      grossAnnual - pfEmployee - esicEmployee - professionalTax - tax;
    const inHandMonthly = inHandAnnual / 12;

    const result: SalaryBreakup = {
      basic,
      hra,
      hraExempt,
      allowances,
      bonus,
      lta,
      ltaExempt,
      medical,
      medicalExempt,
      gross: grossAnnual,
      pfEmployee,
      pfEmployer,
      esicEmployee,
      esicEmployer,
      professionalTax,
      incomeTax: tax,
      gratuity,
      inHandMonthly,
      inHandAnnual,
      taxSlabs,
    };

    if (!isCompare) {
      setBreakup(result);
      localStorage.setItem("salaryInputs", JSON.stringify(data));
    } else {
      setCompareBreakup(result);
    }
  };

  const downloadPdf = () => {
    if (!breakup) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Salary Breakup Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${userName || "User"}`, 20, 30);
    doc.text(`CTC: ${formatter.format(parseFloat(inputs.ctc) || 0)}`, 20, 40);
    doc.text(`Tax Regime: ${taxRegime === "new" ? "New" : "Old"}`, 20, 50);
    doc.text(
      `City: ${inputs.city === "metro" ? "Metro" : "Non-Metro"}`,
      20,
      60
    );
    doc.text("Breakup:", 20, 70);
    doc.text(`Basic: ${formatter.format(breakup.basic)}`, 20, 80);
    doc.text(
      `HRA: ${formatter.format(breakup.hra)} (${formatter.format(
        breakup.hraExempt
      )} exempt)`,
      20,
      90
    );
    doc.text(`Allowances: ${formatter.format(breakup.allowances)}`, 20, 100);
    doc.text(`Bonus: ${formatter.format(breakup.bonus)}`, 20, 110);
    doc.text(
      `LTA: ${formatter.format(breakup.lta)} (${formatter.format(
        breakup.ltaExempt
      )} exempt)`,
      20,
      120
    );
    doc.text(
      `Medical: ${formatter.format(breakup.medical)} (${formatter.format(
        breakup.medicalExempt
      )} exempt)`,
      20,
      130
    );
    doc.text(`PF (Employee): ${formatter.format(breakup.pfEmployee)}`, 20, 140);
    doc.text(`Gratuity: ${formatter.format(breakup.gratuity)}`, 20, 150);
    doc.text(`Income Tax: ${formatter.format(breakup.incomeTax)}`, 20, 160);
    doc.text(
      `In-Hand ${
        viewMode === "monthly" ? "Monthly" : "Annual"
      }: ${formatter.format(
        viewMode === "monthly" ? breakup.inHandMonthly : breakup.inHandAnnual
      )}`,
      20,
      170
    );
    doc.save("salary_breakup.pdf");
  };

  const handleShare = (isTwitter = false) => {
    const params = new URLSearchParams({
      ctc: inputs.ctc,
      city: inputs.city,
      hra: inputs.hra,
      bonus: inputs.bonus,
      investment80C: inputs.investment80C,
      investment80D: inputs.investment80D,
      investmentNPS: inputs.investmentNPS,
      lta: inputs.lta,
      medical: inputs.medical,
      taxRegime,
    });
    const url = `${window.location.origin}/salary-calculator?${params}`;
    if (isTwitter) {
      const tweet = `Check out my salary breakup with EMI Mitra! In-hand: ${formatter.format(
        breakup?.inHandMonthly || 0
      )}/month for ₹${(parseFloat(inputs.ctc) / 100000).toFixed(
        1
      )}L CTC. Calculate yours: ${url} #SalaryCalculator`;
      window.open(
        `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
        "_blank"
      );
    } else {
      navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const chartData = breakup
    ? {
        labels: [
          "Basic",
          "HRA",
          "Allowances",
          "Bonus",
          "LTA",
          "Medical",
          "PF",
          "Tax",
        ],
        datasets: [
          {
            data: [
              breakup.basic,
              breakup.hra,
              breakup.allowances,
              breakup.bonus,
              breakup.lta,
              breakup.medical,
              breakup.pfEmployee,
              breakup.incomeTax,
            ],
            backgroundColor: [
              "#4ade80",
              "#facc15",
              "#60a5fa",
              "#f472b6",
              "#34d399",
              "#a78bfa",
              "#ef4444",
              "#6b7280",
            ],
          },
        ],
      }
    : null;

  const getTaxTips = () => {
    const tips: string[] = [];
    if (taxRegime === "old" && parseFloat(inputs.investment80C) < 150000)
      tips.push(
        "Invest up to ₹1,50,000 in 80C (ELSS, PPF) to reduce taxable income."
      );
    if (taxRegime === "old" && parseFloat(inputs.investment80D) < 25000)
      tips.push("Claim up to ₹25,000 in 80D for health insurance premiums.");
    if (taxRegime === "old" && parseFloat(inputs.investmentNPS) < 50000)
      tips.push(
        "Contribute up to ₹50,000 in NPS for additional 80CCD(1B) benefits."
      );
    if (taxRegime === "new" && parseFloat(inputs.investment80C) > 0)
      tips.push("Switch to old regime to benefit from 80C deductions.");
    if (inputs.city === "non-metro" && breakup?.hraExempt === 0)
      tips.push(
        "Consider metro cities for higher HRA exemptions (50% vs. 40%)."
      );
    return tips.length
      ? tips
      : ["You're optimizing well! Share your results to help others."];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-white-200 dark:to-gray-100">
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
            className="w-full sm:w-2/3 bg-white/90 dark:bg-white-100/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-0"
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-black mb-6"
            >
              Salary Breakup & In-Hand Calculator
            </motion.h1>
            <motion.div className="space-y-6">
              <div className="relative">
                <label className="flex items-center text-base font-medium text-gray-900 dark:text-black mb-2">
                  Annual CTC (₹)
                  <Info
                    className="w-4 h-4 ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-black "
                    aria-hidden="true"
                  />
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ctcPresets.map((ctc) => (
                    <button
                      key={ctc}
                      onClick={() =>
                        setInputs({ ...inputs, ctc: ctc.toString() })
                      }
                      className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                        parseFloat(inputs.ctc) === ctc
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                    >
                      {(ctc / 100000).toFixed(1)}L
                    </button>
                  ))}
                </div>
                <InputField
                  id="ctc"
                  value={inputs.ctc}
                  onChange={(value) => setInputs({ ...inputs, ctc: value })}
                  type="number"
                  placeholder="Enter custom CTC"
                  min={250000}
                  required
                  sliderMin={250000}
                  sliderMax={5000000}
                  sliderStep={10000}
                  label={""}
                />
              </div>
              <motion.div variants={itemVariants}>
                <label className="flex items-center text-base font-medium text-gray-900 dark:text-black mb-2">
                  City Type
                  <Info
                    className="w-4 h-4 ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-black"
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
                  className="block w-full border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
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
                id="lta"
                label="Leave Travel Allowance (₹)"
                value={inputs.lta}
                onChange={(value) => setInputs({ ...inputs, lta: value })}
                type="number"
                placeholder="Enter LTA (up to ₹20,000)"
                min={0}
                max={20000}
              />
              <InputField
                id="medical"
                label="Medical Allowance (₹)"
                value={inputs.medical}
                onChange={(value) => setInputs({ ...inputs, medical: value })}
                type="number"
                placeholder="Enter Medical (up to ₹15,000)"
                min={0}
                max={15000}
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
                className="flex items-center gap-4"
              >
                <label className="text-base font-medium text-gray-900 dark:text-black">
                  Tax Regime
                </label>
                <button
                  onClick={() => setTaxRegime("new")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                    taxRegime === "new"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  New Regime
                </button>
                <button
                  onClick={() => setTaxRegime("old")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                    taxRegime === "old"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  Old Regime
                </button>
              </motion.div>
              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setCompareInputs({ ...inputs })}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm sm:text-base font-medium transition-all hover:scale-105"
                >
                  <BarChart2 className="w-5 h-5 mr-2" />
                  Compare Another Salary
                </button>
              </motion.div>
              {compareInputs && (
                <motion.div
                  variants={containerVariants}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      Compare Salary
                    </h3>
                    <button
                      onClick={() => setCompareInputs(null)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                      aria-label="Close comparison"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <InputField
                    id="compare-ctc"
                    label="Compare CTC (₹)"
                    value={compareInputs.ctc}
                    onChange={(value) =>
                      setCompareInputs({ ...compareInputs, ctc: value })
                    }
                    type="number"
                    placeholder="Enter CTC"
                    min={250000}
                  />
                  <select
                    id="compare-city"
                    value={compareInputs.city}
                    onChange={(e) =>
                      setCompareInputs({
                        ...compareInputs,
                        city: e.target.value as "metro" | "non-metro",
                      })
                    }
                    className="block w-full border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="metro">Metro</option>
                    <option value="non-metro">Non-Metro</option>
                  </select>
                </motion.div>
              )}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => {
                    calculateSalary(inputs);
                    if (compareInputs) calculateSalary(compareInputs, true);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-base font-semibold transition-all hover:scale-105"
                  aria-label="Calculate salary"
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
                      lta: "20000",
                      medical: "15000",
                    })
                  }
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-base font-semibold transition-all hover:scale-105"
                  aria-label="Reset inputs"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
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
                  className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm"
                >
                  <p>{error}</p>
                </motion.div>
              )}
              {breakup && (
                <motion.div
                  variants={containerVariants}
                  className="mt-6 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-between items-center mb-4"
                  >
                    <p
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                      aria-live="polite"
                    >
                      {userName ? `Hello, ${userName}!` : "Hello!"} Your salary
                      breakup is ready.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setViewMode(
                            viewMode === "monthly" ? "annual" : "monthly"
                          )
                        }
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                        aria-label={`Switch to ${
                          viewMode === "monthly" ? "annual" : "monthly"
                        } view`}
                      >
                        View {viewMode === "monthly" ? "Annual" : "Monthly"}
                      </button>
                    </div>
                  </motion.div>
                  <motion.h2
                    variants={itemVariants}
                    className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Salary Breakup
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      variants={containerVariants}
                      className="space-y-2 text-sm md:text-base"
                    >
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">Basic Salary: </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.basic / 12
                            : breakup.basic
                        )}
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">HRA: </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.hra / 12
                            : breakup.hra
                        )}{" "}
                        (
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.hraExempt / 12
                            : breakup.hraExempt
                        )}{" "}
                        exempt)
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">Allowances: </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.allowances / 12
                            : breakup.allowances
                        )}
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">Bonus: </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.bonus / 12
                            : breakup.bonus
                        )}
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">LTA: </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.lta / 12
                            : breakup.lta
                        )}{" "}
                        (
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.ltaExempt / 12
                            : breakup.ltaExempt
                        )}{" "}
                        exempt)
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">Medical: </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.medical / 12
                            : breakup.medical
                        )}{" "}
                        (
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.medicalExempt / 12
                            : breakup.medicalExempt
                        )}{" "}
                        exempt)
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">PF (Employee): </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.pfEmployee / 12
                            : breakup.pfEmployee
                        )}
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">Gratuity: </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.gratuity / 12
                            : breakup.gratuity
                        )}
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white"
                      >
                        <span className="font-semibold">Income Tax: </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.incomeTax / 12
                            : breakup.incomeTax
                        )}
                      </motion.p>
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-900 dark:text-white font-bold"
                      >
                        <span className="font-semibold">
                          In-Hand{" "}
                          {viewMode === "monthly" ? "Monthly" : "Annual"}:{" "}
                        </span>
                        {formatter.format(
                          viewMode === "monthly"
                            ? breakup.inHandMonthly
                            : breakup.inHandAnnual
                        )}
                      </motion.p>
                    </motion.div>
                    {compareBreakup && compareInputs && (
                      <motion.div
                        variants={containerVariants}
                        className="space-y-2 text-sm md:text-base border-l border-gray-300 pl-4"
                      >
                        <motion.p
                          variants={itemVariants}
                          className="text-gray-900 dark:text-white font-semibold"
                        >
                          Comparison (CTC:{" "}
                          {formatter.format(parseFloat(compareInputs.ctc) || 0)}
                          , {compareInputs.city})
                        </motion.p>
                        <motion.p
                          variants={itemVariants}
                          className="text-gray-900 dark:text-white"
                        >
                          <span className="font-semibold">Basic Salary: </span>
                          {formatter.format(
                            viewMode === "monthly"
                              ? compareBreakup.basic / 12
                              : compareBreakup.basic
                          )}
                        </motion.p>
                        <motion.p
                          variants={itemVariants}
                          className="text-gray-900 dark:text-white"
                        >
                          <span className="font-semibold">HRA: </span>
                          {formatter.format(
                            viewMode === "monthly"
                              ? compareBreakup.hra / 12
                              : compareBreakup.hra
                          )}{" "}
                          (
                          {formatter.format(
                            viewMode === "monthly"
                              ? compareBreakup.hraExempt / 12
                              : compareBreakup.hraExempt
                          )}{" "}
                          exempt)
                        </motion.p>
                        <motion.p
                          variants={itemVariants}
                          className="text-gray-900 dark:text-white"
                        >
                          <span className="font-semibold">
                            In-Hand{" "}
                            {viewMode === "monthly" ? "Monthly" : "Annual"}:{" "}
                          </span>
                          {formatter.format(
                            viewMode === "monthly"
                              ? compareBreakup.inHandMonthly
                              : compareBreakup.inHandAnnual
                          )}
                        </motion.p>
                      </motion.div>
                    )}
                  </div>
                  <motion.div variants={itemVariants} className="mt-4">
                    <button
                      onClick={() => setShowTaxSlabs(!showTaxSlabs)}
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      aria-label={
                        showTaxSlabs
                          ? "Hide tax slab details"
                          : "Show tax slab details"
                      }
                    >
                      {showTaxSlabs ? "Hide" : "Show"} Tax Slab Details
                      <ChevronDown
                        className={`w-5 h-5 ml-1 transition-transform ${
                          showTaxSlabs ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showTaxSlabs && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 text-sm"
                      >
                        {breakup.taxSlabs.map((slab, idx) => (
                          <p
                            key={idx}
                            className="text-gray-900 dark:text-white"
                          >
                            {slab.range}: {slab.rate}% ={" "}
                            {formatter.format(slab.amount)}
                          </p>
                        ))}
                        <p className="text-gray-900 dark:text-white">
                          Cess (4%):{" "}
                          {formatter.format(breakup.incomeTax * 0.04)}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                  {chartData && (
                    <motion.div
                      variants={chartVariants}
                      className="h-40 sm:h-48 md:h-64 mt-6"
                    >
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
                                label: (ctx) =>
                                  formatter.format(Number(ctx.parsed) || 0),
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
                    className="mt-6 flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={downloadPdf}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-base font-semibold transition-all hover:scale-105"
                        aria-label="Download salary breakup as PDF"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download PDF
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => handleShare()}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-base font-semibold transition-all hover:scale-105 w-full"
                          aria-label="Share salary breakup link"
                        >
                          <Share2 className="w-5 h-5 mr-2" />
                          Share Link
                        </button>
                        <AnimatePresence>
                          {showCopied && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs sm:text-sm rounded-md px-3 py-1"
                              aria-live="polite"
                            >
                              Copied!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button
                        onClick={() => handleShare(true)}
                        className="px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 flex items-center justify-center text-base font-semibold transition-all hover:scale-105"
                        aria-label="Share on Twitter/X"
                      >
                        Share on X
                      </button>
                    </div>
                    <button
                      onClick={() => setShowTips(true)}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center text-base font-semibold transition-all hover:scale-105"
                      aria-label="View tax saving tips"
                    >
                      View Tax Saving Tips
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showTips && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Tax Saving Tips
                      </h3>
                      <button
                        onClick={() => setShowTips(false)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        aria-label="Close tax tips"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {getTaxTips().map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
          <SalaryFAQ isOpen={faqOpen} toggleOpen={() => setFaqOpen(!faqOpen)} />
        </div>
      </motion.div>
      <PwaInstall />
      <Footer />
    </div>
  );
};

export default SalaryCalculator;

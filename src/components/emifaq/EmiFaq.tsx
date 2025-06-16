"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What is a Home Loan EMI Calculator?",
    answer:
      "A home loan EMI calculator is a tool to estimate your monthly EMI (Equated Monthly Installment) for a home loan. It calculates payments based on the loan amount, interest rate, and tenure. For example, a ₹20,00,000 home loan at 8% interest for 10 years has an EMI of approximately ₹29,882. Use our home loan EMI calculator for accurate results.",
  },
  {
    question:
      "What is the difference between flat rate and reducing balance rate in a loan calculator?",
    answer:
      "In a **flat rate** loan, interest is calculated on the initial loan amount for the entire tenure, resulting in higher EMIs. For example, a ₹1,00,000 loan at 10% flat rate for 3 years charges ₹30,000 interest. In a **reducing balance** loan, interest is calculated on the outstanding principal each month, reducing total interest. Use our loan calculator to compare flat and reducing rates for car loans or personal loans.",
  },
  {
    question: "How does a car loan calculator work?",
    answer:
      "A car loan calculator estimates your monthly EMI for a car loan based on the loan amount, interest rate, and tenure. For example, a ₹5,00,000 car loan at 7% interest for 3 years has an EMI of approximately ₹15,103. Our car loan calculator also accounts for down payments and processing fees to provide accurate car payment calculations.",
  },
  {
    question: "What is loan tenure in a payment calculator?",
    answer:
      "Loan tenure is the duration over which you repay a loan through EMIs, typically in months or years. For example, a car loan might have a 36-month tenure, while a home loan could span 240 months. Longer tenures reduce EMIs but increase total interest. Use our payment calculator to find the ideal tenure for your loan.",
  },
  {
    question: "What is a processing fee in an automotive loan calculator?",
    answer:
      "A processing fee is a charge by lenders to cover loan application costs, usually 0.5% to 2% of the loan amount. For example, a ₹10,00,000 automotive loan with a 1% fee incurs ₹10,000. Our automotive loan calculator includes processing fees to estimate your total loan cost accurately.",
  },
  {
    question: "What happens if I miss a car loan payment?",
    answer:
      "Missing a car loan payment incurs late fees, damages your credit score, and may lead to lender recovery actions. Repeated defaults could result in vehicle repossession. Use our car payment calculator to ensure your EMIs are affordable and contact your lender if payment issues arise.",
  },
  {
    question: "Can I prepay my loan using a loan calculator?",
    answer:
      "Yes, prepaying a loan reduces the principal, lowering EMIs or shortening the tenure. Some lenders charge a prepayment penalty (1-3%). Our loan calculator helps estimate savings from prepayment for personal, home, or car loans, especially early in the tenure when interest is high.",
  },
  {
    question: "How does a down payment affect a car loan calculator?",
    answer:
      "A down payment is an upfront payment for a car purchase, reducing the loan amount and EMI. For example, a ₹5,00,000 car with a ₹1,00,000 down payment requires a ₹4,00,000 loan, lowering EMIs. Use our car loan calculator to see how down payments impact your monthly car payments.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const EmiFaq: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-md"
      aria-labelledby="emi-faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <h2
        id="emi-faq-heading"
        className="text-xl sm:text-2xl font-bold text-gray-900 mb-6"
      >
        Frequently Asked Questions about EMI and Loan Calculators
      </h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <details
            key={index}
            className="border border-gray-200 rounded-md shadow-sm group"
          >
            <summary className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors p-4 cursor-pointer">
              <span className="text-base sm:text-lg font-semibold text-gray-800">
                {faq.question}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="bg-white p-4">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </motion.section>
  );
};

export default EmiFaq;

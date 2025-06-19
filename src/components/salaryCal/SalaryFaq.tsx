"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqVariants: HTMLMotionProps<"section">["variants"] = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const SalaryFAQ: React.FC<{ isOpen: boolean; toggleOpen: () => void }> = ({
  isOpen,
  toggleOpen,
}) => {
  return (
    <motion.section
      variants={faqVariants}
      initial="hidden"
      animate="visible"
      className="w-full sm:w-1/3 sm:sticky sm:top-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 mt-8 sm:mt-0"
      aria-labelledby="faq-heading"
    >
      <div className="flex justify-between items-center">
        <h2
          id="faq-heading"
          className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white"
        >
          Salary FAQs
        </h2>
        <button
          className="sm:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          onClick={toggleOpen}
          aria-label={isOpen ? "Collapse FAQs" : "Expand FAQs"}
        >
          {isOpen ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </button>
      </div>
      <div className={`${isOpen ? "block" : "hidden"} sm:block space-y-4 mt-4`}>
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-gray-900 dark:text-white">
            <span>80C Investments</span>
            <ChevronDown className="w-5 h-5 group-open:hidden" />
            <ChevronUp className="w-5 h-5 hidden group-open:block" />
          </summary>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Section 80C allows deductions up to ₹1,50,000 on investments like
            ELSS, PPF, EPF, life insurance premiums, and home loan principal
            repayment. Available only in the old tax regime.
          </p>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-gray-900 dark:text-white">
            <span>80D Investments</span>
            <ChevronDown className="w-5 h-5 group-open:hidden" />
            <ChevronUp className="w-5 h-5 hidden group-open:block" />
          </summary>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Section 80D offers deductions up to ₹25,000 (₹50,000 for senior
            citizens) on health insurance premiums and preventive health
            check-ups. Applicable in the old regime.
          </p>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-gray-900 dark:text-white">
            <span>NPS Investments</span>
            <ChevronDown className="w-5 h-5 group-open:hidden" />
            <ChevronUp className="w-5 h-5 hidden group-open:block" />
          </summary>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            National Pension System (NPS) contributions up to ₹50,000 are
            deductible under Section 80CCD(1B), in addition to 80C limits.
            Available in the old regime.
          </p>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-gray-900 dark:text-white">
            <span>Annual CTC</span>
            <ChevronDown className="w-5 h-5 group-open:hidden" />
            <ChevronUp className="w-5 h-5 hidden group-open:block" />
          </summary>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Cost to Company (CTC) includes basic salary, HRA, allowances,
            bonuses, and employer contributions (PF, ESIC, gratuity). It’s your
            total annual compensation.
          </p>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-gray-900 dark:text-white">
            <span>Annual HRA</span>
            <ChevronDown className="w-5 h-5 group-open:hidden" />
            <ChevronUp className="w-5 h-5 hidden group-open:block" />
          </summary>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            House Rent Allowance (HRA) covers rental expenses. Exemptions in the
            old regime depend on rent paid, city type (metro: 50%, non-metro:
            40%), and basic salary.
          </p>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-gray-900 dark:text-white">
            <span>Old vs. New Tax Regime</span>
            <ChevronDown className="w-5 h-5 group-open:hidden" />
            <ChevronUp className="w-5 h-5 hidden group-open:block" />
          </summary>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            The old regime offers deductions (80C, 80D, HRA, NPS) but higher tax
            rates. The new regime has lower rates but no deductions except
            standard ₹50,000. Choose based on your investments.
          </p>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer text-base font-medium text-gray-900 dark:text-white">
            <span>Metro vs. Non-Metro Salary</span>
            <ChevronDown className="w-5 h-5 group-open:hidden" />
            <ChevronUp className="w-5 h-5 hidden group-open:block" />
          </summary>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Metro cities (Delhi, Mumbai, Kolkata, Chennai) have higher HRA
            exemptions (50% of basic) compared to non-metro cities (40%). This
            impacts in-hand salary in the old regime.
          </p>
        </details>
      </div>
    </motion.section>
  );
};

export default SalaryFAQ;

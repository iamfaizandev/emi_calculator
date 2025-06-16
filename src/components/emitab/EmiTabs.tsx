"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Home, Car, Wallet } from "lucide-react";
import EmiCalculatorPage from "@/components/emicalculator/EmiCalculatorPage";

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const tabButtonVariants = {
  inactive: { scale: 1, opacity: 0.7 },
  active: { scale: 1.05, opacity: 1 },
  hover: { scale: 1.1, transition: { duration: 0.2 } },
};

export const EmiCalculatorTabs: React.FC = () => {
  const [value, setValue] = useState(0);

  const emiConfigs = [
    {
      label: "Product",
      icon: <ShoppingCart className="w-4 sm:w-5 h-5" />,
      tabType: "product" as const,
      defaultValues: {
        productName: "",
        price: "100000",
        interestRate: "5",

        tenure: "12",
      },
    },
    {
      label: "Based On Salary",
      icon: <Wallet className="w-4 sm:w-5 h-5" />,
      tabType: "salary" as const,
      defaultValues: {
        productName: "Loan Based on Salary",

        price: "300000",
        interestRate: "7",
        tenure: "36",
      },
    },
    {
      label: "Home Loan",
      icon: <Home className="w-4 sm:w-5 h-5" />,
      tabType: "home" as const,
      defaultValues: {
        productName: "",
        price: "2000000",
        interestRate: "5",

        tenure: "120",
      },
    },
    {
      label: "Car Loan",
      icon: <Car className="w-4 sm:w-5 h-5" />,
      tabType: "car" as const,
      defaultValues: {
        productName: "",

        price: "500000",
        interestRate: "7",
        tenure: "36",
      },
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tabVariants}
      className="max-w-3xl cursor-pointer mx-auto bg-gradient-to-br from-gray-50 to-white dark:from-white-800 dark:to-white-900 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8"
    >
      {/* Custom Tabs */}
      <nav
        className="flex overflow-x-auto whitespace-nowrap scrollbar-hide bg-gray-100 dark:bg-gray-700 rounded-full p-1.5 sm:p-2"
        aria-label="EMI Calculator Tabs"
        role="tablist"
      >
        {emiConfigs.map((config, index) => (
          <motion.button
            key={index}
            variants={tabButtonVariants}
            animate={value === index ? "active" : "inactive"}
            whileHover="hover"
            onClick={() => setValue(index)}
            className={`cursor-pointer flex items-center flex-shrink-0 space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-7 py-2 text-xs sm:text-sm lg:text-base font-semibold transition-colors duration-300 ${
              value === index
                ? "bg-blue-500 text-white shadow-md"
                : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            } rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300`}
            aria-label={`Select ${config.label} tab`}
            aria-selected={value === index}
            role="tab"
          >
            {config.icon}
            <span>{config.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6 lg:mt-8">
        {emiConfigs.map((config, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: value > index ? -20 : 20 }}
            animate={{
              opacity: value === index ? 1 : 0,
              x: value === index ? 0 : value > index ? -20 : 20,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`${
              value === index ? "block" : "hidden"
            } bg-white dark:bg-white-800 rounded-lg p-4 sm:p-6 lg:p-8 shadow-inner`}
          >
            <EmiCalculatorPage
              defaultValues={config.defaultValues}
              tabType={config.tabType}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

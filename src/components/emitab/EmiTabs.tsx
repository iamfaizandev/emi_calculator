"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Home, Car } from "lucide-react";
import { EmiCalculator } from "@/components/emicalcul/EmiCalculator";

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
      label: "Product EMI",
      icon: <ShoppingCart className="w-5 h-5" />,
      defaultValues: {
        productName: "eg Smartphone",
        price: "0",
        interestRate: "5",
        tenure: "1",
      },
    },
    {
      label: "Home Loan EMI",
      icon: <Home className="w-5 h-5" />,
      defaultValues: {
        productName: "Home Loan",
        price: "0",
        interestRate: "5",
        tenure: "1",
      },
    },
    {
      label: "Car Loan EMI",
      icon: <Car className="w-5 h-5" />,
      defaultValues: {
        productName: "Car Loan",
        price: "0",
        interestRate: "7",
        tenure: "1",
      },
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tabVariants}
      className="max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-6 sm:p-8"
    >
      {/* Custom Tabs */}
      <div className="flex justify-center space-x-2 sm:space-x-4 bg-gray-100 rounded-full p-2">
        {emiConfigs.map((config, index) => (
          <motion.button
            key={index}
            variants={tabButtonVariants}
            animate={value === index ? "active" : "inactive"}
            whileHover="hover"
            onClick={() => setValue(index)}
            className={`flex cursor-pointer items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-colors duration-300 ${
              value === index
                ? "bg-blue-500 text-white shadow-md"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
            aria-label={config.label}
            aria-selected={value === index}
            role="tab"
          >
            {config.icon}
            <span>{config.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 sm:mt-8">
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
            } bg-white rounded-lg p-4 sm:p-6 shadow-inner`}
          >
            <EmiCalculator defaultValues={config.defaultValues} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

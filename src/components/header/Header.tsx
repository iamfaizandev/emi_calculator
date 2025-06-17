"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Calculator } from "lucide-react";

// Explicitly type headerVariants as Variants
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1], // Bezier curve values
    },
  },
};

export const Header: React.FC = () => {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className="bg-gradient-to-r from-blue-100 via-cyan-50 to-blue-100 dark:from-blue-900 dark:via-blue-900 dark:to-blue-900 shadow-md py-4 px-4 sm:px-6"
      aria-label="Main header"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:scale-105 transition-transform"
        >
          <div className="font-bold text-black dark:text-white flex items-center">
            <Calculator />
            <h1 className="text-3xl">Emi Mitra</h1>
          </div>
        </Link>
        <div className="bold flex items-center justify-between">
          <Link href="/" className="me-6">
            Home
          </Link>
          <Link href="/about" className="me-2">
            About
          </Link>
          <Link href="/emifaq" className="ms-4">
            EMI FAQ
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copyright } from "lucide-react";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const linkVariants = {
  hover: { scale: 1.05, color: "#2563eb", transition: { duration: 0.2 } },
};

export const Footer: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // Ensure dynamic content (if any) only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hardcode year to avoid hydration issues; alternatively, use isClient for dynamic year
  const currentYear = 2025;

  // Minimal static render for SSR
  if (!isClient) {
    return (
      <footer className="bg-gradient-to-br from-gray-50 to-white py-4 mt-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-600">
          <span>© {currentYear} </span>
          <a
            href="https://md-faizan-ahmad.web.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            Md Faizan Ahmad
          </a>
        </div>
      </footer>
    );
  }

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className="bg-gradient-to-br from-gray-50 to-white py-4 mt-8 border-t border-gray-200"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-600 flex items-center justify-center gap-1">
        <Copyright className="w-4 h-4" aria-hidden="true" />
        <span>© {currentYear} </span>
        <motion.a
          href="https://md-faizan-ahmad.web.app/"
          target="_blank"
          rel="noopener noreferrer"
          variants={linkVariants}
          whileHover="hover"
          className="text-blue-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Visit Md Faizan Ahmad's portfolio"
        >
          Md Faizan Ahmad
        </motion.a>
      </div>
    </motion.footer>
  );
};

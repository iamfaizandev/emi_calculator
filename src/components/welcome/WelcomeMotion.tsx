"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WelcomeMotionProps {
  children: ReactNode;
}

const WelcomeMotion: React.FC<WelcomeMotionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default WelcomeMotion;

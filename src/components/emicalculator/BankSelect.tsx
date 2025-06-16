import React from "react";
import { motion } from "framer-motion";
import { Percent, Info } from "lucide-react";

interface BankSelectProps {
  selectedBank: string;
  setSelectedBank: (value: string) => void;
  bankRates: { name: string; rate: number }[];
}

const BankSelect: React.FC<BankSelectProps> = ({
  selectedBank,
  setSelectedBank,
  bankRates,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-2"
  >
    <label
      htmlFor="bankRate"
      className="flex items-center text-base font-medium text-gray-900"
    >
      <Percent className="w-4 h-4 mr-1 animate-pulse" aria-hidden="true" />
      Bank Interest Rate
      <Info
        className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
        aria-hidden="true"
      />
    </label>
    <select
      id="bankRate"
      value={selectedBank}
      onChange={(e) => setSelectedBank(e.target.value)}
      className="block w-full border-blue-500 bg-white text-gray-900 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-[1.02] transition-all"
      aria-label="Select bank for interest rate"
    >
      {bankRates.map((bank) => (
        <option key={bank.name} value={bank.name}>
          {bank.name} ({bank.rate}%)
        </option>
      ))}
    </select>
  </motion.div>
);

export default BankSelect;

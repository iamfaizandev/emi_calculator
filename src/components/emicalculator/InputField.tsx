import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "date";
  icon?: React.ReactNode;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  error,
  min,
  max,
  step,
  sliderMin,
  sliderMax,
  sliderStep,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-2"
  >
    <label
      htmlFor={id}
      className="flex items-center text-base font-medium text-gray-900"
    >
      {icon}
      <span className="ml-1">{label}</span>
      <Info
        className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
        aria-hidden="true"
      />
    </label>
    {sliderMin !== undefined &&
      sliderMax !== undefined &&
      sliderStep !== undefined && (
        <input
          id={`${id}-range`}
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          value={value || "0"}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-2 rounded-lg cursor-pointer bg-gray-200 accent-blue-500 hover:accent-blue-600 transition-colors"
          aria-label={`Adjust ${label.toLowerCase()}`}
        />
      )}
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`block w-full border ${
          error ? "border-rose-500" : "border-blue-500"
        } bg-white text-gray-900 rounded-md p-2 pl-10 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-[1.02] transition-all`}
        aria-describedby={`${id}-error`}
        aria-invalid={!!error}
      />
      {icon && (
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
          {icon}
        </span>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="text-rose-500 text-xs" role="alert">
        {error}
      </p>
    )}
  </motion.div>
);

export default InputField;

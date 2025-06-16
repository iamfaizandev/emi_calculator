import React from "react";

interface TenureToggleProps {
  tenureUnit: "months" | "years";
  setTenureUnit: (unit: "months" | "years") => void;
}

const TenureToggle: React.FC<TenureToggleProps> = ({
  tenureUnit,
  setTenureUnit,
}) => (
  <button
    type="button"
    onClick={() => setTenureUnit(tenureUnit === "months" ? "years" : "months")}
    className={`px-3 py-1 text-sm rounded-md transition-colors ${
      tenureUnit === "months"
        ? "bg-blue-500 text-white"
        : "bg-blue-100 text-gray-900"
    } hover:bg-blue-600 hover:text-white`}
    aria-label={`Switch to ${tenureUnit === "months" ? "years" : "months"}`}
  >
    {tenureUnit === "months" ? "Years" : "Months"}
  </button>
);

export default TenureToggle;

import React from "react";
import InputField from "./InputField";
import BankSelect from "./BankSelect";
import TenureToggle from "./TenureToggle";
import { EmiCalculatorProps, Errors } from "@/interface/types";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  IndianRupee,
  Info,
  Percent,
  Wallet,
} from "lucide-react";

interface LoanInputFormProps {
  tabType: EmiCalculatorProps["tabType"];
  productName: string;
  setProductName: (value: string) => void;
  loanAmount: string;
  setLoanAmount: (value: string) => void;
  downPayment: string;
  setDownPayment: (value: string) => void;
  interestRate: string;
  setInterestRate: (value: string) => void;
  tenure: string;
  setTenure: (value: string) => void;
  tenureUnit: "months" | "years";
  setTenureUnit: (unit: "months" | "years") => void;
  startDate: string;
  setStartDate: (value: string) => void;
  processingFee: string;
  setProcessingFee: (value: string) => void;
  emiType: "reducing" | "flat";
  setEmiType: (value: "reducing" | "flat") => void;
  salary: string;
  setSalary: (value: string) => void;
  desiredEmi: string;
  setDesiredEmi: (value: string) => void;
  selectedBank: string;
  setSelectedBank: (value: string) => void;
  bankRates: { name: string; rate: number }[];
  errors: Errors;
}

const LoanInputForm: React.FC<LoanInputFormProps> = ({
  tabType,
  productName,
  setProductName,
  loanAmount,
  setLoanAmount,
  downPayment,
  setDownPayment,
  interestRate,
  setInterestRate,
  tenure,
  setTenure,
  tenureUnit,
  setTenureUnit,
  startDate,
  setStartDate,
  processingFee,
  setProcessingFee,
  emiType,
  setEmiType,
  salary,
  setSalary,
  desiredEmi,
  setDesiredEmi,
  selectedBank,
  setSelectedBank,
  bankRates,
  errors,
}) => (
  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
    {tabType === "salary" ? (
      <>
        <InputField
          id="loanAmount"
          label="Loan Amount (₹)"
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="e.g., 300000"
          type="number"
          icon={
            <IndianRupee className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
          error={errors.loanAmount}
          min={0}
          sliderMin={10000}
          sliderMax={5000000}
          sliderStep={10000}
        />
        <InputField
          id="salary"
          label="Your Salary (₹)"
          value={salary}
          onChange={setSalary}
          placeholder="e.g., 25000"
          type="number"
          icon={<Wallet className="w-4 h-4 animate-pulse" aria-hidden="true" />}
          error={errors.salary}
          min={0}
          sliderMin={10000}
          sliderMax={1000000}
          sliderStep={1000}
        />
        <InputField
          id="desiredEmi"
          label="Desired EMI per Month (₹)"
          value={desiredEmi}
          onChange={setDesiredEmi}
          placeholder="e.g., 5000"
          type="number"
          icon={
            <DollarSign className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
          error={errors.desiredEmi}
          min={0}
          sliderMin={1000}
          sliderMax={100000}
          sliderStep={1000}
        />
        <BankSelect
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
          bankRates={bankRates}
        />
        <div className="space-y-2">
          <InputField
            id="tenure"
            label={`Tenure (${tenureUnit})`}
            value={tenure}
            onChange={setTenure}
            placeholder={tenureUnit === "years" ? "e.g., 3" : "e.g., 36"}
            type="number"
            icon={
              <Calendar className="w-4 h-4 animate-pulse" aria-hidden="true" />
            }
            error={errors.tenure}
            min={1}
            max={tenureUnit === "years" ? 30 : 360}
            step={tenureUnit === "years" ? 0.1 : 1}
            sliderMin={tenureUnit === "years" ? 1 : 1}
            sliderMax={tenureUnit === "years" ? 30 : 360}
            sliderStep={tenureUnit === "years" ? 1 : 12}
          />
          <TenureToggle tenureUnit={tenureUnit} setTenureUnit={setTenureUnit} />
        </div>
        <InputField
          id="processingFee"
          label="Processing Fee (₹)"
          value={processingFee}
          onChange={setProcessingFee}
          placeholder="0"
          type="number"
          icon={
            <DollarSign className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
          error={errors.processingFee}
          min={0}
          sliderMin={0}
          sliderMax={50000}
          sliderStep={5000}
        />
      </>
    ) : (
      <>
        <InputField
          id="productName"
          label="Product Name"
          value={productName}
          onChange={setProductName}
          placeholder="e.g. Product Name or Loan Name"
          type="text"
          icon={
            <IndianRupee className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
          error={errors.productName}
        />
        <InputField
          id="loanAmount"
          label={
            tabType === "product" ? "Product Price (₹)" : "Loan Amount (₹)"
          }
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="e.g., 100000"
          type="number"
          icon={
            <IndianRupee className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
          error={errors.loanAmount}
          min={0}
          sliderMin={10000}
          sliderMax={5000000}
          sliderStep={10000}
        />
        <InputField
          id="downPayment"
          label="Down Payment (₹)"
          value={downPayment}
          onChange={setDownPayment}
          placeholder="0"
          type="number"
          icon={
            <IndianRupee className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
          error={errors.downPayment}
          min={0}
          sliderMin={0}
          sliderMax={parseFloat(loanAmount) || 5000000}
          sliderStep={10000}
        />
        <BankSelect
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
          bankRates={bankRates}
        />
        <InputField
          id="interestRate"
          label="Interest Rate (%)"
          value={interestRate}
          onChange={setInterestRate}
          placeholder="e.g., 5"
          type="number"
          icon={
            <Percent className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
          error={errors.interestRate}
          min={0}
          max={100}
          step={0.01}
          sliderMin={0}
          sliderMax={100}
          sliderStep={0.1}
        />
        <div className="space-y-2">
          <InputField
            id="tenure"
            label={`Tenure (${tenureUnit})`}
            value={tenure}
            onChange={setTenure}
            placeholder={tenureUnit === "years" ? "e.g., 10" : "e.g., 120"}
            type="number"
            icon={
              <Calendar className="w-4 h-4 animate-pulse" aria-hidden="true" />
            }
            error={errors.tenure}
            min={1}
            max={tenureUnit === "years" ? 30 : 360}
            step={tenureUnit === "years" ? 0.1 : 1}
            sliderMin={tenureUnit === "years" ? 1 : 1}
            sliderMax={tenureUnit === "years" ? 30 : 360}
            sliderStep={tenureUnit === "years" ? 1 : 12}
          />
          <TenureToggle tenureUnit={tenureUnit} setTenureUnit={setTenureUnit} />
        </div>
        <InputField
          id="processingFee"
          label="Processing Fee (₹)"
          value={processingFee}
          onChange={setProcessingFee}
          placeholder="0"
          type="number"
          icon={
            <DollarSign className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
          error={errors.processingFee}
          min={0}
          sliderMin={0}
          sliderMax={50000}
          sliderStep={5000}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <label
            htmlFor="emiType"
            className="flex items-center text-base font-medium text-gray-900"
          >
            EMI Type
            <Info
              className="w-4 h-4 ml-1 hover:text-purple-500 transition-colors"
              aria-hidden="true"
            />
          </label>
          <select
            id="emiType"
            value={emiType}
            onChange={(e) => setEmiType(e.target.value as "reducing" | "flat")}
            className="block w-full border-blue-500 bg-white text-gray-900 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-600 hover:scale-[1.02] transition-all"
            aria-describedby="emiType-desc"
          >
            <option value="reducing">Reducing Balance</option>
            <option value="flat">Flat Rate</option>
          </select>
          <p id="emiType-desc" className="text-gray-500 text-xs">
            Select the EMI calculation method
          </p>
        </motion.div>
        <InputField
          id="startDate"
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          type="date"
          icon={
            <Calendar className="w-4 h-4 animate-pulse" aria-hidden="true" />
          }
        />
      </>
    )}
  </form>
);

export default LoanInputForm;

import { ChartData as ChartJsData } from "chart.js";

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalProcessingFee: number;
  totalAmount: number;
  schedule: {
    month: string;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export interface DefaultValues {
  productName: string;
  price: string;
  interestRate: string;
  tenure: string;
}

export interface EmiCalculatorProps {
  defaultValues: DefaultValues;
  tabType: "product" | "home" | "car" | "salary";
}

export interface Errors {
  productName?: string;
  loanAmount?: string;
  downPayment?: string;
  interestRate?: string;
  tenure?: string;
  processingFee?: string;
  salary?: string;
  desiredEmi?: string;
}

export type ChartData = ChartJsData<"pie", number[], string>;

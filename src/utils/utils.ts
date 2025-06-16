interface EmiResult {
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

export const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

export const calculateEmi = (
  loanAmount: number,
  downPayment: number,
  interestRate: number,
  tenure: number,
  emiType: "reducing" | "flat",
  startDate: string,
  processingFee: number
): EmiResult => {
  const principal = loanAmount - downPayment;
  const rate = interestRate / 100 / 12;
  let monthlyEmi = 0;
  let totalInterest = 0;
  const schedule = [];

  if (emiType === "reducing") {
    if (rate === 0) {
      monthlyEmi = principal / tenure;
    } else {
      const x = Math.pow(1 + rate, tenure);
      monthlyEmi = (principal * rate * x) / (x - 1);
    }
    totalInterest = monthlyEmi * tenure - principal;
  } else {
    totalInterest = principal * (interestRate / 100) * (tenure / 12);
    monthlyEmi = (principal + totalInterest) / tenure;
  }

  let balance = principal;
  const start = new Date(startDate || new Date());
  for (let i = 0; i < tenure && balance > 0; i++) {
    const interest = balance * rate;
    const principalPaid = monthlyEmi - interest;
    balance -= principalPaid;
    const month = new Date(
      start.getFullYear(),
      start.getMonth() + i,
      1
    ).toLocaleString("default", { month: "short", year: "numeric" });
    schedule.push({
      month,
      emi: monthlyEmi,
      principal: principalPaid,
      interest,
      balance: Math.max(balance, 0),
    });
  }

  return {
    monthlyEmi,
    totalInterest,
    totalProcessingFee: processingFee,
    totalAmount: monthlyEmi * tenure + downPayment + processingFee,
    schedule,
  };
};

import { EmiCalculatorTabs } from "@/components/emitab/EmiTabs";
import { Footer } from "@/components/Footer";
import Head from "next/head";

export default function EmiCalculatorPage() {
  return (
    <>
      <Head>
        <title>
          EMI Calculator – Product, Home Loan, Car Loan Installments
        </title>
        <meta
          name="description"
          content="Calculate EMIs for products, home loans, or car loans with our smart EMI calculator. Get instant monthly payment breakdowns and payment schedules."
        />
        <meta
          name="keywords"
          content="emi calculator, product emi, home loan emi, car loan emi, monthly installment calculator, loan planner"
        />
        <link rel="canonical" href="/emi-calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Head>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4">
          <div className="flex-1">
            <EmiCalculatorTabs />
          </div>
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-gray-200 dark:bg-gray-700 h-[250px] w-full rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Ad Space (300x250)
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

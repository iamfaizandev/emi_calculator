"use client";

import { Header } from "@/components/header//Header";
import { EmiCalculatorTabs } from "@/components/emitab/EmiTabs";
import Footer from "@/components/Footer";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/next";

export default function EmiCalculatorPage() {
  return (
    <>
      <Head>
        <title>EMI Calculator - Product, Home Loan, Car Loan | EMI Mitra</title>
        <meta
          name="description"
          content="Calculate EMIs for products, home loans, and car loans with EMI Mitra's smart EMI calculator. Get instant monthly payment breakdowns, loan schedules, and affordability checks."
        />
        <meta
          name="keywords"
          content="EMI calculator, home loan calculator, car loan calculator, product EMI, loan EMI, monthly installment calculator, loan planner, EMI Mitra"
        />
        <meta name="author" content="EMI Mitra" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-adsense-account" content="ca-pub-3782365559827375" />
        <link rel="canonical" href="https://emimitra.online" />
        <meta
          property="og:title"
          content="EMI Calculator - Product, Home Loan, Car Loan | EMI Mitra"
        />
        <meta
          property="og:description"
          content="Use EMI Mitra's EMI calculator to compute monthly payments for home loans, car loans, and products. Get detailed schedules and affordability insights."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://emimitra.online" />
        <meta property="og:image" content="https://www.emimitra.online" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="EMI Calculator - Product, Home Loan, Car Loan | EMI Mitra"
        />
        <meta
          name="twitter:description"
          content="Calculate EMIs for loans and products with EMI Mitra. Instant breakdowns and schedules for home loans, car loans, and more."
        />
        <meta name="twitter:image" content="https://www.emimitra.online" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "WebPage",
              name: "EMI Calculator",
              description:
                "Calculate EMIs for products, home loans, and car loans with EMI Mitra’s smart calculator.",
              url: "https://www.emimitra.online",
              publisher: {
                "@type": "Organization",
                name: "EMI Mitra",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.emimitra.online",
                },
              },
            }),
          }}
        />
      </Head>
      <Analytics />
      <div itemScope itemType="http://schema.org/FinancialService">
        <Header />
        <main
          className="min-h-screen bg-gray-50 dark:bg-white-900 flex flex-col items-center py-8"
          itemProp="mainContentOfPage"
        >
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
      </div>
    </>
  );
}

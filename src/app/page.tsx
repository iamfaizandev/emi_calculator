import { Metadata } from "next";
import { Header } from "@/components/header/Header";
import { WelcomeServer } from "@/components/welcome/Welcome";
import WelcomeClient from "@/components/welcome/WelcomeClient";
import WelcomeMotion from "@/components/welcome/WelcomeMotion";
import PwaInstall from "@/components/PWAinstall";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import EmiFaq from "@/components/emifaq/EmiFaq";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "EMI Mitra - Your Trusted EMI Calculator for Loans",
    description:
      "EMI Mitra offers easy EMI calculators for home loans, car loans, bike loans, product purchases, and salary-based loans. Calculate monthly payments instantly with accurate breakdowns.",
    keywords:
      "EMI calculator, home loan EMI calculator, car loan calculator, bike loan calculator, loan calculator, product EMI, salary-based loan, EMI Mitra",
    authors: [
      { name: "Emi Mitra Team ", url: "https://md-faizan-ahmad.web.app/" },
    ],
    robots: "index, follow",
    alternates: {
      canonical: "https://emimitra.online",
    },
    openGraph: {
      title: "EMI Mitra - EMI Calculator for Loans",
      description:
        "Calculate EMIs for home loans, car loans, bike loans, and more with EMI Mitra’s user-friendly tools.",
      url: "https://emimitra.online",
      siteName: "EMI Mitra",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "EMI Mitra Logo",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "EMI Mitra - EMI Calculator for Loans",
      description:
        "Use EMI Mitra’s EMI calculators for accurate loan payment estimates.",
      images: ["/logo.png"],
    },
    other: {
      "google-adsense-account": "ca-pub-3782365559827375",
    },
  };
}

export default async function HomePage() {
  const services = [
    {
      title: "Salary Calculator",
      description:
        "Calculate your in-hand salary with EMI Mitra’s Salary Calculator. Input your CTC, deductions, and tax regime to get a detailed breakup of monthly and annual take-home pay.",
      tab: "salary",
      url: "/salarycalculator",
    },
    {
      title: "Resume Page Builder",
      description:
        "Enter your details, choose a style, and download a professional PDF — no login, no data stored. Perfect for freshers and job seekers ",

      tab: "ResumeBuilder",
      url: "/resume_builder",
    },
    {
      title: "Product EMI Calculator",
      description:
        "Plan your purchases with EMI Mitra’s Product EMI Calculator. Compute monthly installments for electronics, furniture, or any product with ease. Get instant payment schedules to budget smartly.",
      tab: "product",
      url: "/emicalculator?tab=product",
    },
    {
      title: "Home Loan EMI Calculator",
      description:
        "Calculate your home loan EMIs with EMI Mitra’s precise tool. Enter loan amount, interest rate, and tenure to get detailed monthly payment breakdowns and plan your dream home purchase.",
      tab: "home",
      url: "/emicalculator?tab=home",
    },
    {
      title: "Car Loan Calculator",
      description:
        "Estimate your car loan EMIs using EMI Mitra’s Car Loan Calculator. Input loan details to see affordable monthly payments and schedules, making car financing simple and transparent.",
      tab: "car",
      url: "/emicalculator?tab=car",
    },
    {
      title: "Bike Loan Calculator",
      description:
        "Get accurate bike loan EMIs with EMI Mitra’s Bike Loan Calculator. Calculate monthly payments based on loan amount and tenure to ride your dream bike without financial stress.",
      tab: "bike",
      url: "/emicalculator?tab=bike",
    },
    {
      title: "Salary-Based Loan Calculator",
      description:
        "Discover loan affordability with EMI Mitra’s Salary-Based Calculator. Estimate EMIs based on your income, ensuring manageable payments for personal loans tailored to your financial capacity.",
      tab: "salary-loan",
      url: "/emicalculator?tab=salary",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "EMI Mitra",
    description:
      "EMI Mitra provides EMI calculators for home loans, car loans, bike loans, product purchases, and salary-based loans.",
    url: "https://emimitra.online",
    publisher: {
      "@type": "Organization",
      name: "EMI Mitra",
      logo: {
        "@type": "ImageObject",
        url: "https://emimitra.online/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Analytics />
      <SpeedInsights />
      <div itemScope itemType="http://schema.org/FinancialService">
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-white-900 flex flex-col items-center py-8">
          <WelcomeMotion>
            <WelcomeServer />
          </WelcomeMotion>
          <WelcomeClient />
          <section className="w-full max-w-5xl mx-auto px-4 py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-blue text-center mb-8">
              Our EMI Calculator Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-black mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-black mb-4">
                    {service.description}
                  </p>

                  <Link title="Calculate Button" href={service.url}>
                    <button className="px-4 cursor-pointer py-2 bg-black text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Try It
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
          {/* AdSense Placeholder */}
          {/* Uncomment and add Google AdSense script after approval */}
          {/* <aside className="w-full max-w-5xl mx-auto px-4 py-6 bg-gray-200 dark:bg-gray-700 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Sponsored Content
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              AdSense ads will be displayed here once approved (ca-pub-3782365559827375).
            </p>
            {/* Replace with actual ad code, e.g.:
            <Script async src="https://pagead2.googlesyndication.com/pagead/js/ads.js?client=ca-pub-3782365559827375"></Script>
            <ins className="adsbygoogle"></ins>
          </aside> 
            */}
          <PwaInstall />
          <EmiFaq />
        </main>
        <Footer />
      </div>
    </>
  );
}

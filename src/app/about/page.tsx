import Link from "next/link";
import { Calculator } from "lucide-react";
import AboutMotion from "./Motion";
import { Header } from "@/components/header/Header";
import EmiFaq from "@/components/emifaq/EmiFaq";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div>
      <Header />
      <AboutMotion>
        <section className="w-full max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-black text-center mb-8">
            About EMI Mitra
          </h2>
          <div className="text-black rounded-lg  p-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <Calculator className="w-12 h-12 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                Your Trusted Loan Calculator
              </h3>
            </div>
            <p className="text-gray-600 dark:text-black-300 mb-4 text-center">
              At EMI Mitra, our mission is to simplify financial planning for
              everyone. We provide user-friendly EMI calculators to help you
              make informed decisions about loans for homes, cars, bikes,
              products, or personal needs based on your salary.
            </p>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-black mb-2">
              Why Choose EMI Mitra?
            </h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-black-300 mb-4">
              <li>
                Accurate and instant EMI calculations for various loan types.
              </li>
              <li>
                Detailed payment schedules to plan your budget effectively.
              </li>
              <li>
                Accessible anytime, anywhere, with our Progressive Web App.
              </li>
              <li>Free, reliable, and easy-to-use tools for all users.</li>
            </ul>
            <div className="text-center">
              <Link href="/emicalculator">
                <button className="px-6 cursor-pointer py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Start Calculating Now
                </button>
              </Link>
            </div>
          </div>
          <article>
            <EmiFaq />
          </article>
        </section>
        <Footer />
      </AboutMotion>
    </div>
  );
};

export default About;

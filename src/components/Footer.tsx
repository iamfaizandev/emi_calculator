"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-white dark:bg-gray-900 text-black dark:text-white py-10 px-4 sm:px-6 lg:px-8 mt-12"
      aria-label="Footer"
      itemScope
      itemType="http://schema.org/Organization"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Column 1: About */}
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            About EMI Mitra
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            EMI Mitra is your personal EMI and loan assistant. Whether
            you&apos;re planning a new phone, laptop, or any purchase, we help
            you understand what fits your salary and budget. Simple, free, and
            always accessible.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <nav aria-label="Footer quick links">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/contact_us"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms_of_use"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </nav>

        {/* Column 3: Connect With Us */}
        <address
          className="not-italic"
          itemProp="contactPoint"
          itemType="http://schema.org/ContactPoint"
        >
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Connect With Us
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            <a
              href="mailto:support@emimitra.online"
              itemProp="email"
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              support@emimitra.online
            </a>
          </p>
        </address>
      </div>
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-10">
        © {currentYear} <span itemProp="name">EMI Mitra</span>. All rights
        reserved.
      </div>
    </footer>
  );
}

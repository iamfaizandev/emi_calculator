// import type { Metadata } from "next";
// import "./globals.css";
// import { Analytics } from "@vercel/analytics/next";
// import Head from "next/head";
// import { SpeedInsights } from "@vercel/speed-insights/next";

// export const metadata: Metadata = {
//   title: "EMI Calculator | Home Loan , Car Loan",
//   description:
//     "Calculate your EMI for products, home loans, and car loans with ease.",
//   keywords: ["EMI calculator", "loan calculator", "Emi Mitra", "finance tool"],
//   openGraph: {
//     title: "EMI Calculator",
//     description: "Calculate your EMI with our user-friendly tool.",
//     url: "https://emimitra.online/",
//     siteName: "EMI Calculator",
//     images: [
//       {
//         url: "logo.png", // Place an image in public/
//         width: 1200,
//         height: 630,
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "EMI Calculator",
//     description: "Calculate your EMI for various loans.",
//     images: ["/logo.png"],
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <Head>
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#000000" />
//       </Head>
//       <body className="bg-gray-50">
//         {children}
//         <Analytics />
//         <SpeedInsights />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://emimitra.online"),
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" }, // Optional
    ],
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {/* Google AdSense Script (Uncomment after approval) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3782365559827375"
          crossOrigin="anonymous"
        ></script>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

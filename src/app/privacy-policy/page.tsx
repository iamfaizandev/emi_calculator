import Footer from "@/components/Footer";
import { Header } from "@/components/header/Header";

export default function PrivacyPolicy() {
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto p-4 pb-34  pt-20">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-white-700 text-2xl mb-4">
          At EMI Mitra, we value your privacy. We do not collect personal data
          unless necessary for functionality. Your inputs are not stored,
          shared, or tracked.
        </p>
        <p className="text-white-700 text-2xl mb-4">
          We use analytics tools to improve performance but do not associate
          them with any individual identity.
        </p>
        <p className="text-white-700 text-2xl-700">
          By using our tool, you consent to this privacy policy. Contact us at
          support@emimitra.online for concerns.
        </p>
      </main>
      <Footer />
    </div>
  );
}

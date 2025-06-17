import Footer from "@/components/Footer";
import { Header } from "@/components/header/Header";

export default function TermsOfUse() {
  return (
    <div>
      <Header />
      <main className="max-w-3xl mb-4 text-black mx-auto pb-34  p-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        <p className="text-white-700 text-2xl mb-4">
          EMI Mitra provides financial estimation tools for educational and
          informational purposes only. We do not guarantee accuracy or
          responsibility for financial decisions made based on results.
        </p>
        <p className="text-white-700 text-2xl mb07">
          By using our service, you agree to these terms. Use is at your own
          discretion.
        </p>
      </main>
      <Footer />
    </div>
  );
}

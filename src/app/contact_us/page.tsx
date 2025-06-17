import Footer from "@/components/Footer";
import { Header } from "@/components/header/Header";

export default function Contact() {
  return (
    <div>
      <Header />
      <main className="max-w-3xl text-black mx-auto p-4 pb-34 pt-20">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-white-700 text-2xl mb-4">
          Have questions or feedback? We&apos;d love to hear from you.
        </p>
        <p className="text-white-700 text-2xl mb-2">
          Email: mdfaizan7563@gmail.com
        </p>
      </main>
      <Footer />
    </div>
  );
}

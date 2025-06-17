"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
const PwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const installButton = document.getElementById("installButton");
      if (installButton) {
        installButton.classList.remove("hidden");
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA installed");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 py-12  rounded-lg"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-black text-center mb-6">
        You Can Download EMI Mitra as an App!
      </h2>
      <p className="text-gray-600 dark:text-black text-center mb-6">
        Install EMI Mitra as a Progressive Web App (PWA) for quick access to our
        EMI calculators anytime, even offline!
      </p>
      <div className="flex flex-col items-center  gap-4">
        <Smartphone className="w-12 h-12 text-blue-500" />
        <p className="text-gray-700 dark:text-black text-center">
          <strong>Instructions:</strong>
          <br />
          <span className="block mt-2">
            <strong>Chrome (Desktop/Android):</strong> Click the menu {">"}
            &quot;Install EMI Mitra&quot; or &quot;Add to Home screen.&quot;
          </span>
          <span className="block mt-2">
            <strong>Safari (iOS):</strong> Tap the Share icon {">"} &quot;Add to
            Home Screen.&quot;
          </span>
          <span className="block mt-2">
            <strong>Edge:</strong> Click the menu {">"} &quot;Apps&quot; {">"}{" "}
            &quot;Install this site as an app.&quot;
          </span>
        </p>
        <button
          id="installButton"
          onClick={handleInstallClick}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors hidden"
        >
          Install App
        </button>
      </div>
    </motion.section>
  );
};

export default PwaInstall;

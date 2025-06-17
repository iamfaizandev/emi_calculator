"use client";

import { useState, useEffect } from "react";

const WelcomeClient = () => {
  const [, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [, setShowWelcome] = useState(false);

  useEffect(() => {
    // Update greeting client-side
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Check for saved name
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setName(savedName);
      setShowWelcome(true);
      const greetingDiv = document.getElementById("welcome-greeting");
      const form = document.getElementById("welcome-form");
      if (greetingDiv && form) {
        greetingDiv.innerHTML = `${greeting}, ${savedName}! Welcome to EMI Mitra`;
        form.style.display = "none";
      }
    }

    // Add form submit listener
    const form = document.getElementById("welcome-form");
    const input = document.getElementById("welcome-input") as HTMLInputElement;
    if (form && input) {
      const handleSubmit = (e: Event) => {
        e.preventDefault();
        const inputName = input.value.trim();
        if (inputName) {
          setName(inputName);
          setShowWelcome(true);
          localStorage.setItem("userName", inputName);
          const greetingDiv = document.getElementById("welcome-greeting");
          if (greetingDiv) {
            greetingDiv.innerHTML = `${greeting}, ${inputName}! Welcome to EMI Mitra`;
            form.style.display = "none";
          }
        }
      };
      form.addEventListener("submit", handleSubmit);
      return () => form.removeEventListener("submit", handleSubmit);
    }
  }, [greeting]);

  return null; // Renders nothing; manipulates DOM directly
};

export default WelcomeClient;

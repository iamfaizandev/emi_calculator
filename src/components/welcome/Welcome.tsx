interface WelcomeProps {
  initialGreeting: string;
}

const Welcome: React.FC<WelcomeProps> = ({ initialGreeting }) => {
  return (
    <div
      className="text-center mt-8 py-8 bg-gradient-to-r p-8 bg-white-600 rounded-lg shadow-lg max-w-2xl mx-auto"
      id="welcome-container"
    >
      <h1
        id="welcome-greeting"
        className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-black"
      >
        {initialGreeting}! Welcome to EMI Mitra
      </h1>
      <form id="welcome-form" className="flex flex-col items-center gap-4 mt-4">
        <input
          id="welcome-input"
          type="text"
          name="name"
          placeholder="Enter your name"
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={50}
        />
        <button
          type="submit"
          className="px-6 cursor-pointer
           py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

// Server-side wrapper
export async function WelcomeServer() {
  // Current time-based greeting server-side (IST: 11:54 PM, June 17, 2025)
  const now = new Date();
  now.setTime(now.getTime() + 5.5 * 60 * 60 * 1000); // IST offset (+5:30)
  const hour = now.getHours();
  let initialGreeting = "Good Evening";
  if (hour < 12) initialGreeting = "Good Morning";
  else if (hour < 18) initialGreeting = "Good Afternoon";

  return <Welcome initialGreeting={initialGreeting} />;
}

import { useState, useEffect } from "react";
import apiClient from "../src/utils/api"; // Updated import path
import Dashboard from "./components/Dashboard";

function App() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [requestsRes, knowledgeRes] = await Promise.all([
        apiClient.get("/requests/pending"),
        apiClient.get("/knowledge"),
      ]);

      setPendingRequests(requestsRes.data);
      setKnowledgeBase(knowledgeRes.data);
    } catch (err) {
      setError("⚠️ Failed to fetch data. Is the server running?"); // Updated error message
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    // New polished styling
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="py-8 border-b border-gray-700 shadow-sm">
        <h1 className="text-4xl font-extrabold text-center tracking-wide text-yellow-400">
          AI Oversight Dashboard
        </h1>
        <p className="text-center text-gray-400 mt-2 text-sm">
          Manage & resolve AI help requests in real-time
        </p>
      </header>

      <main className="px-6 py-10">
        {isLoading && (
          <p className="text-center text-gray-300 text-lg animate-pulse">
            Loading data...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 text-lg font-semibold">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <Dashboard
            pendingRequests={pendingRequests}
            knowledgeBase={knowledgeBase}
            onResolve={fetchData}
          />
        )}
      </main>
    </div>
  );
}

export default App;
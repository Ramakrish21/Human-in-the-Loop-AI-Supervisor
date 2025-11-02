import { useState, useEffect } from 'react';
import apiClient from '../src/utils/api';
import Dashboard from './components/Dashboard';

function App() {
  // --- State ---
  // We need state to hold our data
  const [pendingRequests, setPendingRequests] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  // This function will run once when the component loads
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // We use Promise.all to make both API calls at the same time
      const [requestsRes, knowledgeRes] = await Promise.all([
        apiClient.get('/requests/pending'),
        apiClient.get('/knowledge')
      ]);

      setPendingRequests(requestsRes.data);
      setKnowledgeBase(knowledgeRes.data);
      
    } catch (err) {
      setError('Failed to fetch data. Is the server running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect with an empty array [] runs ONCE on mount
  useEffect(() => {
    fetchData();
  }, []);

  // --- UI (View) ---
  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">AI Supervisor Panel</h1>
      </header>

      <main>
        {/* We use conditional rendering to handle loading/error states */}
        {isLoading && <p className="text-center text-lg">Loading data...</p>}
        
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}
        
        {!isLoading && !error && (
          <Dashboard 
            pendingRequests={pendingRequests} 
            knowledgeBase={knowledgeBase}
            onResolve={fetchData} // Pass the fetchData function to refresh the list
          />
        )}
      </main>
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

// Simple TV Shows page as a placeholder
// You'll need to add TV show endpoints to your API service
const TVShowsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">TV Shows</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            We're working on bringing you the best TV shows. This section will
            be available soon!
          </p>
          <div className="inline-flex items-center justify-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Under Development</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVShowsPage;

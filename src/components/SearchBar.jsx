import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../services/api";

const SearchBar = ({ variant = "navbar" }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Search function
  const performSearch = async () => {
    if (query.trim() === "") return;

    setIsSearching(true);
    try {
      const data = await searchMovies(query);
      setResults(data.results.slice(0, 5)); // Show only top 5 results in dropdown
      setShowResults(true);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  // Handle result click
  const handleResultClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setShowResults(false);
    setQuery("");
  };

  // Get styles based on variant
  const getStyles = () => {
    switch (variant) {
      case "navbar":
        return {
          container: "relative hidden md:block w-full max-w-xs",
          input:
            "w-full py-1.5 px-4 pr-10 bg-gray-800/70 rounded-full text-sm text-gray-200 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all",
          button:
            "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors",
        };
      case "mobile":
        return {
          container: "relative w-full",
          input:
            "w-full py-3 px-4 pr-10 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-primary/50 focus:outline-none",
          button: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",
        };
      default:
        return {
          container: "relative w-full max-w-md",
          input:
            "w-full py-2 px-4 pr-10 bg-gray-800/70 rounded-lg text-white focus:ring-2 focus:ring-primary/50 focus:outline-none",
          button:
            "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors",
        };
    }
  };

  const styles = getStyles();

  return (
    <div ref={searchRef} className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
          <ul>
            {results.map((movie) => (
              <li
                key={movie.id}
                className="border-b border-gray-800 last:border-none hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => handleResultClick(movie.id)}
              >
                <div className="flex items-center p-3">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="h-12 w-8 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-8 bg-gray-800 rounded flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {movie.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "Unknown Year"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
            <li className="p-2 text-center">
              <button
                onClick={handleSubmit}
                className="text-xs text-primary hover:text-primary-light transition-colors"
              >
                View all results
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

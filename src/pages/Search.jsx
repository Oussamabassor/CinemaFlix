import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

// Temporary mock data for search results
const mockSearchResults = [
  {
    id: 1,
    title: "Dune: Part Two",
    overview:
      "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    poster_path: "/mBjSJCKnXW6W3IPicJzn1ClRujV.jpg",
    vote_average: 8.4,
    release_date: "2024-02-27",
  },
  {
    id: 2,
    title: "Dune",
    overview:
      "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    vote_average: 7.8,
    release_date: "2021-09-15",
  },
  {
    id: 3,
    title: "Dune",
    overview:
      "Set in the distant future, the film tells the story of Paul Atreides, a young man who becomes the head of his family's business empire after his father's death.",
    poster_path: "/z5uS5J7WbTkWRXR8MYY979izGdF.jpg",
    vote_average: 6.5,
    release_date: "1984-12-14",
  },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("all");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Don't search if query is empty
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    // Set a new timeout for debouncing
    const timeout = setTimeout(() => {
      setLoading(true);

      // In a real app, this would be an API call
      // For now, simulate API request with timeout
      setTimeout(() => {
        // Filter mock results based on query and mediaType
        let filteredResults = mockSearchResults;

        if (mediaType !== "all") {
          // In a real app, this filter would be done by the API
          filteredResults = filteredResults.filter(
            (item) => item.media_type === mediaType
          );
        }

        setResults(filteredResults);
        setLoading(false);
      }, 1000);
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);
  };

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="bg-gray-900 min-h-screen text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Discover Movies & TV Shows
        </h1>

        {/* Search Input */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a movie or TV show..."
              className="w-full py-4 pl-12 pr-4 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
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

            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Media Type Filter */}
        <div className="max-w-3xl mx-auto mb-10 flex justify-center space-x-4">
          <button
            onClick={() => setMediaType("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              mediaType === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMediaType("movie")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              mediaType === "movie"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setMediaType("tv")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              mediaType === "tv"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            TV Shows
          </button>
        </div>

        {/* Search Results */}
        {query && !loading && results.length === 0 ? (
          <div className="text-center text-gray-400 my-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p>
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        )}

        {/* Initial State - Search Suggestions */}
        {!query && (
          <div className="text-center mt-10 mb-16">
            <h3 className="text-xl font-semibold mb-6">Popular Searches</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Action",
                "Comedy",
                "Drama",
                "Science Fiction",
                "Horror",
                "Romance",
                "Animation",
                "Thriller",
                "Fantasy",
                "Adventure",
              ].map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleSearch(genre)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

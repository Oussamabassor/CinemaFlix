import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await searchMovies(query, page);
        setResults(data.results);
        setTotalPages(Math.min(data.total_pages, 10)); // Limit to 10 pages
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    // Reset to top of page when query changes
    window.scrollTo(0, 0);
  }, [query, page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        <div className="max-w-xl">
          <SearchBar variant="large" />
        </div>
        {query && (
          <p className="mt-4 text-gray-400">
            {loading
              ? "Searching..."
              : `Found ${results.length} results for "${query}"`}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-900/20 border border-red-600 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-gray-400">
            Try searching with different keywords or browse our categories
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages).keys()].map((i) => {
                    const pageNum = i + 1;
                    // Only show current page, first, last, and one page before and after current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg ${
                            pageNum === page
                              ? "bg-primary text-white"
                              : "border border-gray-700 bg-gray-800 text-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === page - 2 && page > 3) ||
                      (pageNum === page + 2 && page < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="w-10 h-10 flex items-center justify-center text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  getPopularMovies,
  getMovieGenres,
  getMoviesByGenre,
} from "../services/api";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import GenreSelector from "../components/GenreSelector";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current genre and page from URL parameters
  const currentGenre = searchParams.get("genre") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  // NEW: Add state for view options
  const [viewMode, setViewMode] = useState(searchParams.get("view") || "grid");
  const resultsPerPage = 20; // TMDB API returns 20 results by default

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getMovieGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to load movie categories. Please try again later.");
      }
    };

    fetchGenres();
  }, []);

  // Fetch movies when page or genre changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        if (currentGenre === "all") {
          data = await getPopularMovies(currentPage);
        } else {
          data = await getMoviesByGenre(currentGenre, currentPage);
        }

        console.log(`Received ${data.results?.length} movies from API`); // Debug info
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB API limits to 500 pages
        setTotalResults(data.total_results || 0);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    // Scroll to top when page or genre changes
    window.scrollTo(0, 0);
  }, [currentGenre, currentPage]);

  // Update URL when page or genre changes
  const handleGenreChange = (genreId) => {
    setSearchParams((params) => {
      if (genreId === "all") {
        params.delete("genre");
      } else {
        params.set("genre", genreId);
      }
      params.set("page", "1"); // Reset to page 1 when changing genres
      return params;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setSearchParams((params) => {
      params.set("page", newPage.toString());
      return params;
    });
  };

  // NEW: Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setSearchParams((params) => {
      params.set("view", mode);
      return params;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Movies</h1>

      {/* Genre filter - with horizontal smooth scrolling */}
      <GenreSelector
        genres={genres}
        selectedGenre={currentGenre}
        onGenreChange={handleGenreChange}
        allLabel="All Movies"
      />

      {/* NEW: Results status with view toggle */}
      {!loading && !error && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-400">
            {genres.find((g) => g.id.toString() === currentGenre)?.name ||
              "All"}{" "}
            Movies
            {totalResults > 0 &&
              ` • Showing ${(currentPage - 1) * resultsPerPage + 1}-${Math.min(
                currentPage * resultsPerPage,
                totalResults
              )} of ${totalResults}`}
          </p>

          {/* View toggle */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleViewModeChange("grid")}
              aria-label="Grid view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleViewModeChange("list")}
              aria-label="List view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : movies.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-400">No movies found in this category</p>
        </div>
      ) : (
        <>
          {/* UPDATED: Movie grid to display all returned movies */}
          {viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {/* Movie count indicator */}
              <div className="mt-4 text-gray-400 text-sm">
                Showing {movies.length} movies
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {movies.map((movie) => (
                <MovieListItem key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          {/* Enhanced pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center rounded-lg bg-gray-800/50 p-1">
                {/* First page button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="First page"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Previous page button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                <div className="flex items-center px-2">
                  {generatePageNumbers(currentPage, totalPages).map(
                    (pageNum, idx) =>
                      pageNum === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="mx-1 text-gray-500"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`flex items-center justify-center w-10 h-10 rounded-md text-sm ${
                            currentPage === pageNum
                              ? "bg-primary text-white font-medium"
                              : "hover:bg-gray-700/50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                  )}
                </div>

                {/* Next page button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Last page button */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Last page"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    // If total pages is 7 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always include first page
    pages.push(1);

    // Add ellipsis if current page is > 3
    if (currentPage > 3) {
      pages.push("...");
    }

    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if current page is < totalPages - 2
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always include last page
    pages.push(totalPages);
  }

  return pages;
}

// NEW: Add a list view component for movies
const MovieListItem = ({ movie }) => {
  const imagePath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
    : "/placeholder-poster.jpg";

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="flex items-center bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors p-1"
    >
      <img
        src={imagePath}
        alt={movie.title}
        className="w-16 h-24 object-cover rounded"
        loading="lazy"
      />
      <div className="ml-4 flex-grow">
        <h3 className="text-white font-medium text-base">{movie.title}</h3>
        <div className="flex items-center mt-1">
          {movie.vote_average > 0 && (
            <div className="flex items-center mr-4">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="ml-1 text-sm text-gray-300">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-400">{year}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
          {movie.overview}
        </p>
      </div>
      <div className="ml-auto pr-4">
        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default MoviesPage;

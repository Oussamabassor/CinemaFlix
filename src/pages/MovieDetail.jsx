import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import ImageLoader from "../components/ImageLoader";
import LoadingSpinner from "../components/LoadingSpinner";
import TrailerModal from "../components/TrailerModal";
import MovieCard from "../components/MovieCard";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);

        // Find trailer or teaser
        if (data.videos && data.videos.results.length > 0) {
          const trailer =
            data.videos.results.find(
              (video) => video.type === "Trailer" && video.site === "YouTube"
            ) ||
            data.videos.results.find(
              (video) => video.type === "Teaser" && video.site === "YouTube"
            ) ||
            data.videos.results[0];

          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchMovieData();
  }, [id]);

  const openTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500">{error || "Movie not found"}</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded bg-primary px-4 py-2 text-white"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.jpg";

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* Trailer Modal */}
      <TrailerModal
        videoKey={trailerKey}
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
      />

      <div className="pb-16">
        {/* Hero Section with Backdrop */}
        {backdropUrl && (
          <div className="relative h-[70vh]">
            <ImageLoader
              src={backdropUrl}
              alt={movie.title}
              className="h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

            {trailerKey && (
              <button
                onClick={openTrailer}
                className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/80 text-white transition-transform hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Movie Info */}
        <div className="container mx-auto px-4 relative">
          <div
            className={`flex flex-col md:flex-row gap-8 ${
              backdropUrl ? "-mt-40" : "mt-8"
            }`}
          >
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="sticky top-24 overflow-hidden rounded-xl shadow-2xl transform transition-transform hover:scale-[1.02]">
                <ImageLoader
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full"
                />

                {trailerKey && (
                  <button
                    onClick={openTrailer}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="mt-2 text-white font-medium">Watch Trailer</p>
                  </button>
                )}
              </div>

              {/* Additional movie info for desktop view */}
              <div className="mt-6 hidden rounded-lg bg-gray-800/80 p-4 backdrop-blur-sm md:block">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Movie Info
                </h3>

                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">Release Date:</span>{" "}
                    {movie.release_date}
                  </p>
                  <p>
                    <span className="text-gray-400">Runtime:</span>{" "}
                    {movie.runtime} minutes
                  </p>
                  <p>
                    <span className="text-gray-400">Budget:</span>{" "}
                    {formatCurrency(movie.budget)}
                  </p>
                  <p>
                    <span className="text-gray-400">Revenue:</span>{" "}
                    {formatCurrency(movie.revenue)}
                  </p>
                  {movie.status && (
                    <p>
                      <span className="text-gray-400">Status:</span>{" "}
                      {movie.status}
                    </p>
                  )}
                  {movie.original_language && (
                    <p>
                      <span className="text-gray-400">Language:</span>{" "}
                      {movie.original_language.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-2/3 lg:w-3/4 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4">
                  "{movie.tagline}"
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                <span className="px-3 py-1 bg-primary rounded-full">
                  {movie.release_date?.substring(0, 4)}
                </span>
                <span>{movie.runtime} min</span>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>

              {movie.genres && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Mobile movie info */}
              <div className="mb-6 rounded-lg bg-gray-800/80 p-4 backdrop-blur-sm md:hidden">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Movie Info
                </h3>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">Release:</span>{" "}
                    {movie.release_date}
                  </p>
                  <p>
                    <span className="text-gray-400">Runtime:</span>{" "}
                    {movie.runtime} min
                  </p>
                  <p>
                    <span className="text-gray-400">Budget:</span>{" "}
                    {formatCurrency(movie.budget)}
                  </p>
                  <p>
                    <span className="text-gray-400">Revenue:</span>{" "}
                    {formatCurrency(movie.revenue)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                {trailerKey && (
                  <button
                    onClick={openTrailer}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Watch Trailer
                  </button>
                )}

                <button className="flex items-center gap-2 rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  Add to Favorites
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-700 mb-6">
                <nav className="flex gap-8">
                  {["overview", "cast", "videos", "similar"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? "border-b-2 border-primary text-primary"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "overview" && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {movie.overview}
                      </p>
                    </div>

                    {movie.production_companies &&
                      movie.production_companies.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-xl font-semibold mb-3">
                            Production Companies
                          </h3>
                          <div className="flex flex-wrap items-center gap-6">
                            {movie.production_companies.map((company) => (
                              <div
                                key={company.id}
                                className="flex flex-col items-center"
                              >
                                {company.logo_path ? (
                                  <div className="h-16 w-32 bg-white/10 rounded p-2 flex items-center justify-center">
                                    <img
                                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                      alt={company.name}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-16 w-32 bg-gray-800 rounded flex items-center justify-center">
                                    <span className="text-xs text-center text-gray-400 px-2">
                                      {company.name}
                                    </span>
                                  </div>
                                )}
                                <span className="mt-2 text-sm text-gray-400">
                                  {company.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {activeTab === "cast" && movie.credits?.cast && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {movie.credits.cast.slice(0, 10).map((person) => (
                        <div
                          key={person.id}
                          className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
                        >
                          <div className="aspect-[2/3]">
                            <ImageLoader
                              src={
                                person.profile_path
                                  ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                                  : "/placeholder-person.jpg"
                              }
                              alt={person.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="p-3">
                            <p className="font-semibold truncate">
                              {person.name}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {person.character}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "videos" && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-semibold mb-4">Videos</h2>

                    {movie.videos && movie.videos.results.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {movie.videos.results.slice(0, 6).map((video) => (
                          <div
                            key={video.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                          >
                            <div className="aspect-video relative">
                              <img
                                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                alt={video.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => {
                                  setTrailerKey(video.key);
                                  setShowTrailer(true);
                                }}
                                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                              >
                                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </button>
                            </div>
                            <div className="p-3">
                              <p className="font-medium truncate">
                                {video.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {video.type}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No videos available</p>
                    )}
                  </div>
                )}

                {activeTab === "similar" && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-semibold mb-6">
                      Similar Movies
                    </h2>

                    {movie.similar && movie.similar.results.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {movie.similar.results
                          .slice(0, 10)
                          .map((similarMovie) => (
                            <MovieCard
                              key={similarMovie.id}
                              movie={similarMovie}
                            />
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No similar movies found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;

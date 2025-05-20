import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";

// Generate colors from movie ID for unique backgrounds
const generateMovieColors = (id) => {
  // Create deterministic but different colors based on movie ID
  const hue1 = (id * 123) % 360;
  const hue2 = (id * 77 + 180) % 360;

  return {
    primary: `hsl(${hue1}, 70%, 45%)`,
    secondary: `hsl(${hue2}, 60%, 30%)`,
    accent: `hsl(${hue1 + 30}, 80%, 55%)`,
  };
};

const HeroSlider = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const autoplayTimeoutRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  // Initialize and clean up mounted ref
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Generate and memoize movie background colors
  const movieColors = useMemo(() => {
    return movies.map((movie) => generateMovieColors(movie.id));
  }, [movies]);

  // Handle autoplay with clear separation from transition logic
  useEffect(() => {
    if (!autoplayEnabled || transitioning || movies.length <= 1) return;

    const startAutoplay = () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }

      autoplayTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          const nextIndex = (currentIndex + 1) % movies.length;
          handleSlideChange(nextIndex, "next");
        }
      }, 8000);
    };

    startAutoplay();

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [currentIndex, movies.length, autoplayEnabled, transitioning]);

  // Clean up all timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  // Preload images for smoother transitions
  useEffect(() => {
    movies.forEach((movie) => {
      if (movie.backdrop_path) {
        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
      }
      if (movie.poster_path) {
        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      }
    });
  }, [movies]);

  const handleSlideChange = (index, slideDirection = "next") => {
    if (transitioning || index === currentIndex || movies.length <= 1) return;

    if (transitionTimeoutRef.current)
      clearTimeout(transitionTimeoutRef.current);
    if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);

    setDirection(slideDirection);
    setPreviousIndex(currentIndex);
    setTransitioning(true);

    setCurrentIndex(index);

    const transitionDuration = 600;
    transitionTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      setTransitioning(false);
      setPreviousIndex(null);

      if (autoplayEnabled) {
        if (autoplayTimeoutRef.current)
          clearTimeout(autoplayTimeoutRef.current);
        autoplayTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            const nextIndex = (index + 1) % movies.length;
            handleSlideChange(nextIndex, "next");
          }
        }, 8000);
      }
    }, transitionDuration);
  };

  const handleNextSlide = () => {
    const nextIndex = (currentIndex + 1) % movies.length;
    handleSlideChange(nextIndex, "next");
  };

  const handlePrevSlide = () => {
    const prevIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;
    handleSlideChange(prevIndex, "prev");
  };

  if (!movies.length) return null;

  const currentMovie = movies[currentIndex];
  const previousMovie = previousIndex !== null ? movies[previousIndex] : null;

  const currentColors = movieColors[currentIndex];

  const getInitialTransform = () => {
    return direction === "next"
      ? "translate3d(30px, 0, 0) scale(1.02)"
      : "translate3d(-30px, 0, 0) scale(1.02)";
  };

  const getExitTransform = () => {
    return direction === "next"
      ? "translate3d(-30px, 0, 0) scale(0.98)"
      : "translate3d(30px, 0, 0) scale(0.98)";
  };

  const transitionDuration = 650;
  const transitionStyle = `opacity ${transitionDuration}ms cubic-bezier(0.65, 0, 0.35, 1), transform ${transitionDuration}ms cubic-bezier(0.65, 0, 0.35, 1)`;

  return (
    <div
      className="relative h-[85vh] overflow-hidden bg-gray-900"
      style={{
        background: `linear-gradient(135deg, ${currentColors.primary}10, ${currentColors.secondary}20, #141414 70%)`,
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(circle at 30% 40%, ${currentColors.primary}20, transparent 70%), 
                    radial-gradient(circle at 70% 60%, ${currentColors.secondary}20, transparent 70%)`,
        }}
      ></div>

      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-[0.03]"></div>

      {previousMovie && (
        <div
          className="absolute inset-0 z-10 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${previousMovie.backdrop_path})`,
            opacity: transitioning ? 1 : 0,
            transform: transitioning
              ? getExitTransform()
              : "translate3d(0, 0, 0) scale(1)",
            transition: transitionStyle,
            willChange: "opacity, transform",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
      )}

      <div
        className="absolute inset-0 z-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
          opacity: transitioning ? 0 : 1,
          transform: transitioning
            ? getInitialTransform()
            : "translate3d(0, 0, 0) scale(1)",
          transition: transitionStyle,
          willChange: "opacity, transform",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.5)_100%)]"></div>
      </div>

      <div
        className="absolute top-[10%] right-[20%] w-32 h-32 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${currentColors.accent}, transparent 70%)`,
          filter: "blur(40px)",
        }}
      ></div>
      <div
        className="absolute bottom-[20%] left-[15%] w-64 h-64 rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, ${currentColors.primary}, transparent 70%)`,
          filter: "blur(50px)",
        }}
      ></div>

      <div className="container relative z-30 mx-auto flex h-full items-center px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 xl:col-span-6">
            <div
              style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(15px)" : "translateY(0)",
                transition: `opacity ${
                  transitionDuration * 0.8
                }ms ease-out, transform ${transitionDuration * 0.8}ms ease-out`,
                transitionDelay: "100ms",
                backgroundColor: `${currentColors.primary}20`,
                borderColor: `${currentColors.primary}40`,
              }}
              className="inline-flex items-center gap-2 backdrop-blur-md border rounded-full px-4 py-1.5 mb-6"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: currentColors.primary }}
              ></span>
              <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
                Featured
              </span>
            </div>

            <h1
              style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(20px)" : "translateY(0)",
                transition: `opacity ${
                  transitionDuration * 0.8
                }ms ease-out, transform ${transitionDuration * 0.8}ms ease-out`,
                transitionDelay: "150ms",
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-shadow-3d"
            >
              <span className="inline-block">
                {currentMovie.title}
                <div
                  className="h-1 w-16 mt-2"
                  style={{ background: currentColors.primary }}
                ></div>
              </span>
            </h1>

            <div
              style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(20px)" : "translateY(0)",
                transition: `opacity ${
                  transitionDuration * 0.8
                }ms ease-out, transform ${transitionDuration * 0.8}ms ease-out`,
                transitionDelay: "200ms",
              }}
              className="flex flex-wrap items-center gap-4 mb-6 text-sm"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-400 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">
                  {currentMovie.vote_average?.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-white/60"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white/70">
                  {currentMovie.release_date?.substring(0, 4)}
                </span>
              </div>

              {[...Array(Math.min(3, (currentMovie.id % 5) + 1))].map(
                (_, i) => {
                  const genres = [
                    "Action",
                    "Drama",
                    "Comedy",
                    "Sci-Fi",
                    "Thriller",
                    "Horror",
                    "Romance",
                  ];
                  const genreIndex = (currentMovie.id + i) % genres.length;
                  return (
                    <div
                      key={i}
                      className="px-3 py-1 rounded-full text-xs backdrop-blur-sm"
                      style={{
                        backgroundColor: `${currentColors.primary}20`,
                        borderColor: `${currentColors.primary}30`,
                      }}
                    >
                      {genres[genreIndex]}
                    </div>
                  );
                }
              )}
            </div>

            {/* Enhanced Movie Overview/Description */}
            <div
              style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(20px)" : "translateY(0)",
                transition: `opacity ${
                  transitionDuration * 0.8
                }ms ease-out, transform ${transitionDuration * 0.8}ms ease-out`,
                transitionDelay: "250ms",
              }}
              className="max-w-xl mb-8 relative"
            >
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                <h3 className="text-sm uppercase tracking-wider text-white/70 mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Overview
                </h3>

                <div className="relative">
                  <p className="text-white/90 leading-relaxed font-light">
                    {currentMovie.overview.length > 180 ? (
                      <>
                        {currentMovie.overview.substring(0, 180).trim()}
                        <span className="text-primary">...</span>
                      </>
                    ) : (
                      currentMovie.overview
                    )}
                  </p>

                  {currentMovie.overview.length > 180 && (
                    <div className="mt-2 text-right">
                      <Link
                        to={`/movie/${currentMovie.id}`}
                        className="text-sm text-primary hover:text-primary-light inline-flex items-center"
                      >
                        Read more
                        <svg
                          className="w-3.5 h-3.5 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(20px)" : "translateY(0)",
                transition: `opacity ${
                  transitionDuration * 0.8
                }ms ease-out, transform ${transitionDuration * 0.8}ms ease-out`,
                transitionDelay: "300ms",
              }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to={`/movie/${currentMovie.id}`}
                className="group relative flex items-center gap-2 text-white font-medium py-3 px-6 rounded-lg overflow-hidden transition-all"
                style={{ background: currentColors.primary }}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="absolute -inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></span>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Trailer
              </Link>

              <Link
                to={`/movie/${currentMovie.id}`}
                className="group flex items-center gap-2 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-medium py-3 px-6 rounded-lg transition-all"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                Details
              </Link>

              <button
                className="group relative w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 bg-white/5 backdrop-blur-md transition-all"
                aria-label="Add to watchlist"
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>

                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Add to Watchlist
                </span>
              </button>
            </div>
          </div>

          <div
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning
                ? `translateX(${direction === "next" ? "50px" : "-50px"})`
                : "translateX(0)",
              transition: `opacity ${
                transitionDuration * 0.8
              }ms ease-out, transform ${transitionDuration * 0.8}ms ease-out`,
              transitionDelay: "350ms",
            }}
            className="hidden lg:flex lg:col-span-5 xl:col-span-6 justify-end"
          >
            <div className="relative w-72 xl:w-80">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] group">
                <div
                  className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${currentColors.primary}60`,
                  }}
                ></div>
                <div
                  className="absolute -inset-[1px] rounded-2xl z-0 pointer-events-none opacity-30"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${currentColors.primary}, transparent)`,
                    backgroundSize: "200% 100%",
                    animation: "shimmer 3s infinite linear",
                  }}
                ></div>

                <img
                  src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                  alt={currentMovie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/70">
                      {currentMovie.release_date?.substring(0, 4)}
                    </span>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-white">
                        {currentMovie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="w-full py-2 text-white text-sm font-medium rounded-lg transition-colors"
                      style={{
                        backgroundColor: `${currentColors.primary}90`,
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 -right-3 h-10 rounded-2xl bg-black/50 blur-md -z-10"></div>

              <div
                className="absolute -top-2 -right-2 w-16 h-16 rounded-full blur-xl -z-10"
                style={{ background: currentColors.primary + "40" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Centered at bottom */}
      <div className="absolute left-0 right-0 bottom-8 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            {/* Progress Indicators - Now centered */}
            <div className="flex gap-2.5">
              {movies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    handleSlideChange(idx, idx < currentIndex ? "prev" : "next")
                  }
                  className={`transition-all duration-300 rounded-full relative overflow-hidden
                    ${
                      idx === currentIndex
                        ? "w-12 h-1.5"
                        : "w-6 h-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  style={{
                    background:
                      idx === currentIndex ? currentColors.primary : undefined,
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {idx === currentIndex &&
                    !transitioning &&
                    autoplayEnabled && (
                      <span
                        className="animate-progressBar"
                        style={{ animationDuration: "8s" }}
                      ></span>
                    )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-40">
        <div className="flex items-center gap-2 rounded-full py-1.5 px-3 bg-black/30 backdrop-blur-md text-white">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-xs font-medium">Autoplay</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ImageLoader from "./ImageLoader";

const HeroSlider = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    resetTimeout();

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => resetTimeout();
  }, [currentIndex, movies.length]);

  if (!movies.length) return null;

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Slides */}
      {movies.map((movie, index) => {
        const imageUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

        return (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? "opacity-100 z-10 transform-none"
                : "opacity-0 z-0 scale-110"
            }`}
          >
            <ImageLoader
              src={imageUrl}
              alt={movie.title}
              className="h-full w-full"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

            <div className="absolute bottom-0 left-0 z-20 w-full max-w-4xl p-8 md:p-16 lg:p-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              <p className="text-gray-200 text-lg mb-6 line-clamp-2 md:line-clamp-3">
                {movie.overview}
              </p>
              <div className="flex gap-4">
                <Link
                  to={`/movie/${movie.id}`}
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-transform hover:scale-105"
                >
                  Watch Now
                </Link>
                <button className="px-6 py-3 bg-gray-800/80 text-white font-semibold rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Details
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-10 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

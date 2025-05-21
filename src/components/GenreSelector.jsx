import { useState, useRef, useEffect } from "react";

const GenreSelector = ({
  genres = [],
  selectedGenre = "all",
  onGenreChange,
  showAllOption = true,
  allLabel = "All Movies",
}) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Check if we need scroll arrows
  useEffect(() => {
    const checkScrollArrows = () => {
      if (!scrollRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    };

    checkScrollArrows();
    // Add resize and scroll event listeners
    window.addEventListener("resize", checkScrollArrows);
    scrollRef.current?.addEventListener("scroll", checkScrollArrows);

    return () => {
      window.removeEventListener("resize", checkScrollArrows);
      scrollRef.current?.removeEventListener("scroll", checkScrollArrows);
    };
  }, [genres]);

  // Handle scroll click
  const handleScroll = (direction) => {
    if (!scrollRef.current || isScrolling) return;

    const containerWidth = scrollRef.current.clientWidth;
    const scrollAmount = containerWidth * 0.8; // Scroll 80% of visible width

    setIsScrolling(true);
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => setIsScrolling(false), 500);
  };

  // Select genre handler
  const handleSelectGenre = (genreId) => {
    if (onGenreChange) {
      onGenreChange(genreId);
    }
  };

  return (
    <div className="relative py-3">
      {/* Category heading with icon */}
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-primary"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h2 className="text-lg font-semibold text-white">Categories</h2>
      </div>

      {/* Scroll shadow indicator - left */}
      <div
        className={`absolute top-[50px] bottom-4 left-0 w-12 z-10 pointer-events-none
        bg-gradient-to-r from-gray-900 to-transparent
        transition-opacity duration-300 ${
          showLeftArrow ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-[50px] bottom-4 z-20 px-2 flex items-center justify-center
            bg-gradient-to-r from-gray-900/90 to-gray-900/0
            text-white hover:text-primary transition-colors duration-300"
          aria-label="Scroll categories left"
        >
          <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* Genres scroll container */}
      <div
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto py-2 px-0.5 no-scrollbar scroll-smooth"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        {/* "All" category button */}
        {showAllOption && (
          <button
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
              ${
                selectedGenre === "all"
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700"
              }
            `}
            onClick={() => handleSelectGenre("all")}
          >
            {allLabel}
          </button>
        )}

        {/* Genre category buttons */}
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
              ${
                selectedGenre === genre.id.toString()
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700"
              }
            `}
            onClick={() => handleSelectGenre(genre.id.toString())}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Scroll shadow indicator - right */}
      <div
        className={`absolute top-[50px] bottom-4 right-0 w-12 z-10 pointer-events-none
        bg-gradient-to-l from-gray-900 to-transparent
        transition-opacity duration-300 ${
          showRightArrow ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-[50px] bottom-4 z-20 px-2 flex items-center justify-center
            bg-gradient-to-l from-gray-900/90 to-gray-900/0
            text-white hover:text-primary transition-colors duration-300"
          aria-label="Scroll categories right"
        >
          <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default GenreSelector;

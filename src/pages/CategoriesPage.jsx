import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMovieGenres } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

// Category background images (pre-defined for common genres)
const CATEGORY_BACKGROUNDS = {
  28: "/images/categories/action.jpg", // Action
  12: "/images/categories/adventure.jpg", // Adventure
  16: "/images/categories/animation.jpg", // Animation
  35: "/images/categories/comedy.jpg", // Comedy
  80: "/images/categories/crime.jpg", // Crime
  99: "/images/categories/documentary.jpg", // Documentary
  18: "/images/categories/drama.jpg", // Drama
  10751: "/images/categories/family.jpg", // Family
  14: "/images/categories/fantasy.jpg", // Fantasy
  36: "/images/categories/history.jpg", // History
  27: "/images/categories/horror.jpg", // Horror
  10402: "/images/categories/music.jpg", // Music
  9648: "/images/categories/mystery.jpg", // Mystery
  10749: "/images/categories/romance.jpg", // Romance
  878: "/images/categories/scifi.jpg", // Science Fiction
  10770: "/images/categories/tv.jpg", // TV Movie
  53: "/images/categories/thriller.jpg", // Thriller
  10752: "/images/categories/war.jpg", // War
  37: "/images/categories/western.jpg", // Western
};

// Icons for categories (using simple SVG paths for common genres)
const CATEGORY_ICONS = {
  28: <path d="M13 10V3L4 14h7v7l9-11h-7z" />, // Action - lightning bolt
  12: <path d="M9 3l.9 5H5l7 9.1V12h5l-8-9zm8 11v5h-5v-5h5zm0-3h-5v-5h5v5z" />, // Adventure - mountain
  35: (
    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-5 6a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm2 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" />
  ), // Comedy - smiley face
  27: (
    <path d="M8.6 16l-2.2-4H8V7h8v5h1.6l-2.2 4H8.6zM13 13v-2h-2v2h2zm-3 0v-2H8v2h2zm6 0v-2h-2v2h2z" />
  ), // Horror - ghost
  10749: (
    <path d="M12 21.35l-1.45-1.32C5.4 16.36 2 13.25 2 9.5 2 7.42 3.42 6 5.5 6c1.74 0 3.41.81 4.5 2.09C11.09 6.81 12.76 6 14.5 6 16.58 6 18 7.42 18 9.5c0 3.75-3.4 6.86-8.55 10.54L12 21.35z" />
  ), // Romance - heart
  878: (
    <path d="M17.41 3.59l-1.41-1.42-2 2-2-2L10.59 3.59l2 2-2 2 1.41 1.41 2-2 2 2 1.41-1.41-2-2 2-2zM11 10H5v2h6v2l3.5-3L11 8v2zm-5 6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm9 0a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
  ), // Science Fiction - rocket
};

// Get random gradient colors for genres without defined backgrounds
const getRandomGradient = (id) => {
  const colors = [
    ["#FF416C", "#FF4B2B"], // Red-Orange
    ["#8E2DE2", "#4A00E0"], // Purple
    ["#4776E6", "#8E54E9"], // Blue-Purple
    ["#00B4DB", "#0083B0"], // Blue
    ["#FF8008", "#FFC837"], // Orange-Yellow
    ["#2F80ED", "#56CCF2"], // Blue
    ["#20BDFF", "#5433FF"], // Blue-Purple
    ["#F953C6", "#B91D73"], // Pink
    ["#00F260", "#0575E6"], // Green-Blue
    ["#F857A6", "#FF5858"], // Pink-Red
  ];

  // Use genre ID to deterministically pick a gradient
  const index = id % colors.length;
  return `linear-gradient(to right bottom, ${colors[index][0]}, ${colors[index][1]})`;
};

// Popular categories to highlight
const POPULAR_CATEGORIES = [28, 12, 35, 18, 27, 10749, 878];

const CategoriesPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  // Get category background
  const getCategoryBackground = (genreId) => {
    return CATEGORY_BACKGROUNDS[genreId] || null;
  };

  // Get category icon
  const getCategoryIcon = (genreId) => {
    return (
      CATEGORY_ICONS[genreId] || (
        // Default icon - film strip
        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm2 2h2v2H6V8zm5 0h2v2h-2V8zm5 0h2v2h-2V8zM6 13h2v2H6v-2zm5 0h2v2h-2v-2zm5 0h2v2h-2v-2z" />
      )
    );
  };

  // Check if category is popular
  const isPopular = (genreId) => {
    return POPULAR_CATEGORIES.includes(genreId);
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const data = await getMovieGenres();
        // Sort genres: popular ones first, then alphabetically
        const sortedGenres = data.genres.sort((a, b) => {
          const aPopular = isPopular(a.id);
          const bPopular = isPopular(b.id);
          if (aPopular && !bPopular) return -1;
          if (!aPopular && bPopular) return 1;
          return a.name.localeCompare(b.name);
        });
        setGenres(sortedGenres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4 text-white">Movie Categories</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        Explore movies by genre. From action-packed adventures to heartwarming
        romances, find the perfect category for your movie night.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {genres.map((genre, index) => {
          const hasBackground = getCategoryBackground(genre.id);
          const isHovered = hoverIndex === index;

          return (
            <Link
              key={genre.id}
              to={`/movies?genre=${genre.id}`}
              className="group relative overflow-hidden rounded-xl h-48 transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl"
              style={
                hasBackground ? {} : { background: getRandomGradient(genre.id) }
              }
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Background image or gradient */}
              {hasBackground && (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${hasBackground})` }}
                />
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 z-10">
                <div className="flex items-start justify-between">
                  {/* Category icon */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-primary/80 text-white transform transition-all duration-500 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      {getCategoryIcon(genre.id)}
                    </svg>
                  </div>

                  {/* Popular badge */}
                  {isPopular(genre.id) && (
                    <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-white border border-white/20">
                      Popular
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                    {genre.name}
                  </h3>
                  <p className="text-white/70 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Explore movies
                  </p>

                  {/* Animated arrow on hover */}
                  <div
                    className={`absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transform transition-all duration-500 ${
                      isHovered
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-0"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;

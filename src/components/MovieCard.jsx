import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageLoader from "./ImageLoader";

const MovieCard = ({ movie }) => {
  const { id, title, poster_path, vote_average, release_date } = movie;
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const year = release_date?.substring(0, 4);
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/placeholder.jpg";

  // Tilt effect function
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e) => {
      if (!isHovered) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = -(x - centerX) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    };

    if (isHovered) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovered]);

  return (
    <Link
      to={`/movie/${id}`}
      className="block stagger-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={cardRef}
    >
      <div
        className={`group relative overflow-hidden rounded-lg bg-gray-900 shadow-md transition-all duration-500 ease-out ${
          isHovered ? "shadow-xl shadow-primary/30" : ""
        }`}
      >
        <div className="aspect-[2/3] w-full overflow-hidden">
          <ImageLoader
            src={imageUrl}
            alt={title}
            className={`h-full w-full transform transition-all duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        </div>

        {/* Animated Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : ""
          }`}
        />

        {/* Rating Badge */}
        <div
          className={`absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
            vote_average >= 7
              ? "bg-green-600"
              : vote_average >= 5
              ? "bg-yellow-600"
              : "bg-red-600"
          } ${isHovered ? "scale-110" : ""}`}
        >
          {vote_average?.toFixed(1)}
        </div>

        {/* Bottom Info */}
        <div
          className={`absolute bottom-0 left-0 w-full p-4 transform transition-all duration-500 ease-out ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h3 className="text-white font-medium line-clamp-2 mb-1">{title}</h3>
          {year && <p className="text-gray-300 text-sm">{year}</p>}
          <div className="mt-3 flex items-center gap-2">
            <span className="grow rounded bg-white/20 backdrop-blur-sm px-3 py-1 text-white text-xs font-medium">
              View Details
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/80 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Hover Shine Effect */}
        <div
          className={`absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 ${
            isHovered ? "translate-x-full" : "translate-x-0"
          }`}
        />
      </div>
    </Link>
  );
};

export default MovieCard;

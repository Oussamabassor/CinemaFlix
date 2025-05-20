import { useState } from "react";

const GenreFilter = ({ genres, onFilterChange }) => {
  const [activeGenre, setActiveGenre] = useState("all");

  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    onFilterChange(genreId);
  };

  return (
    <div className="py-4">
      <h2 className="text-xl font-bold text-white mb-3">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleGenreChange("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeGenre === "all"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All
        </button>

        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreChange(genre.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeGenre === genre.id
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;

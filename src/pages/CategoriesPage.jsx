import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMovieGenres } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoriesPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Background colors for different genres
  const backgroundColors = [
    "from-red-500 to-orange-500",
    "from-blue-500 to-purple-500",
    "from-green-500 to-teal-500",
    "from-yellow-500 to-amber-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
    "from-cyan-500 to-sky-500",
    "from-violet-500 to-purple-500",
  ];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getMovieGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {genres.map((genre, index) => (
            <Link
              key={genre.id}
              to={`/movies?genre=${genre.id}`}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${
                backgroundColors[index % backgroundColors.length]
              } h-40 transform transition-transform hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">{genre.name}</h3>
                <div className="mt-2 inline-block">
                  <span className="bg-black/30 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    Explore Movies
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

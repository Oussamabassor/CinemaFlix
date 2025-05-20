import { useState, useEffect } from "react";
import HeroSlider from "../components/HeroSlider";
import MovieList from "../components/MovieList";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getTrendingMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
} from "../services/api";

const HomePage = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        setLoading(true);
        const data = await getTrendingMovies("week");
        // Get only the first 5 movies with backdrop images for the hero slider
        const moviesWithBackdrops = data.results
          .filter((movie) => movie.backdrop_path)
          .slice(0, 5);

        setHeroMovies(moviesWithBackdrops);
      } catch (error) {
        console.error("Error fetching hero movies:", error);
        setError("Failed to load trending movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroMovies();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded bg-primary px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Slider */}
      <HeroSlider movies={heroMovies} />

      <div className="container mx-auto px-4">
        {/* Now Playing Movies */}
        <MovieList
          fetchMovies={getNowPlayingMovies}
          title="Now Playing"
          className="mt-12"
        />

        {/* Popular Movies */}
        <MovieList fetchMovies={getPopularMovies} title="Popular Movies" />

        {/* Upcoming Movies */}
        <MovieList fetchMovies={getUpcomingMovies} title="Upcoming Movies" />

        {/* Top Rated Movies */}
        <MovieList fetchMovies={getTopRatedMovies} title="Top Rated Movies" />
      </div>
    </div>
  );
};

export default HomePage;

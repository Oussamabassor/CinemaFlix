import { useState, useEffect, useRef, useCallback } from "react";
import MovieCard from "./MovieCard";
import LoadingSpinner from "./LoadingSpinner";

const MovieList = ({ fetchMovies, title, className = "" }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Function to handle infinite scroll
  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies(page);

        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies((prevMovies) => [...prevMovies, ...data.results]);
        }

        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [fetchMovies, page]);

  return (
    <div className={`my-8 ${className}`}>
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-white">
          <span className="inline-block border-b-2 border-primary pb-1">
            {title}
          </span>
        </h2>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie, index) => {
          const isLastMovie = index === movies.length - 1;
          return (
            <div
              key={`${movie.id}-${index}`}
              ref={isLastMovie ? lastMovieRef : null}
              className="movie-card-container"
            >
              <MovieCard movie={movie} />
            </div>
          );
        })}
      </div>

      {loading && <LoadingSpinner size="md" className="my-4" />}

      {!hasMore && movies.length > 0 && (
        <p className="mt-6 text-center text-gray-400">No more movies to load</p>
      )}

      {!loading && movies.length === 0 && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-lg text-gray-400">No movies found</p>
        </div>
      )}
    </div>
  );
};

export default MovieList;

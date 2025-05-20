import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Temporary mock data for development without API
const mockMovieDetails = {
  id: 1,
  title: "Dune: Part Two",
  overview:
    "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
  poster_path: "/mBjSJCKnXW6W3IPicJzn1ClRujV.jpg",
  backdrop_path: "/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
  vote_average: 8.4,
  release_date: "2024-02-27",
  genres: [
    { id: 878, name: "Science Fiction" },
    { id: 12, name: "Adventure" },
    { id: 18, name: "Drama" },
  ],
  runtime: 166,
  tagline: "Long live the fighters",
  cast: [
    {
      id: 1,
      name: "Timothée Chalamet",
      character: "Paul Atreides",
      profile_path: "/BE2sdjpgsa1Yne8S9RUTeIkfnhs.jpg",
    },
    {
      id: 2,
      name: "Zendaya",
      character: "Chani",
      profile_path: "/6TE2AlOUqcrs7CyJiWYgodmee1r.jpg",
    },
    {
      id: 3,
      name: "Rebecca Ferguson",
      character: "Lady Jessica",
      profile_path: "/lJloTOheuQSirSLXNA3ZHwyKSAm.jpg",
    },
    {
      id: 4,
      name: "Javier Bardem",
      character: "Stilgar",
      profile_path: "/kKrU0BoEASsEBoaxDUaOUpVJtgZ.jpg",
    },
  ],
  video_key: "Way4_CAJGo8", // YouTube trailer key
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In real app, fetch movie details from API
    // For now, use mock data
    setLoading(true);

    setTimeout(() => {
      setMovie(mockMovieDetails);
      setLoading(false);
    }, 1000);

    // Real API call would be like:
    // const fetchMovieDetails = async () => {
    //   try {
    //     const response = await fetch(
    //       `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
    //     );
    //     if (!response.ok) {
    //       throw new Error('Movie not found');
    //     }
    //     const data = await response.json();
    //     setMovie(data);
    //     setLoading(false);
    //   } catch (error) {
    //     setError(error.message);
    //     setLoading(false);
    //   }
    // };

    // fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://via.placeholder.com/1920x1080?text=No+Image+Available";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image+Available";

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Backdrop */}
      <div
        className="relative h-[60vh] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-72 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img src={posterUrl} alt={movie.title} className="w-full" />
              </div>
            </div>

            {/* Movie Info */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-gray-400 text-lg italic mb-4">
                  {movie.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                {movie.release_date && (
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                )}

                {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}

                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>

              {/* Genres */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 rounded-full text-sm bg-gray-800"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">Overview</h3>
                <p className="text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Cast */}
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4">Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.cast.slice(0, 5).map((person) => {
                    const profileUrl = person.profile_path
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image";

                    return (
                      <div
                        key={person.id}
                        className="bg-gray-800 rounded-lg overflow-hidden"
                      >
                        <img
                          src={profileUrl}
                          alt={person.name}
                          className="w-full aspect-[2/3] object-cover"
                        />
                        <div className="p-2">
                          <h4 className="font-medium truncate">
                            {person.name}
                          </h4>
                          <p className="text-gray-400 text-sm truncate">
                            {person.character}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                  Watch Now
                </button>
                <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>

          {/* Trailer Section */}
          {movie.video_key && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Trailer</h3>
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${movie.video_key}`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

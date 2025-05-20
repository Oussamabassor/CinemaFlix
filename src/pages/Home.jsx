import { useState, useEffect } from "react";
import HeroSlider from "../components/HeroSlider";
import MovieCard from "../components/MovieCard";
import GenreFilter from "../components/GenreFilter";

// Temporary mock data for development without API
const mockTrendingMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    overview:
      "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    poster_path: "/mBjSJCKnXW6W3IPicJzn1ClRujV.jpg",
    backdrop_path: "/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
    vote_average: 8.4,
    release_date: "2024-02-27",
  },
  {
    id: 2,
    title: "Kingdom of the Planet of the Apes",
    overview:
      "Several generations in the future following Caesar's reign, apes are now the dominant species and humans have been reduced to living in the shadows.",
    poster_path: "/bLc1eSL6lOvNBDFnqLSp7cAeUOS.jpg",
    backdrop_path: "/hCGtDdYZ6PIZuhUAJ2VQMtcXFLH.jpg",
    vote_average: 7.1,
    release_date: "2024-05-08",
  },
  {
    id: 3,
    title: "Fall Guy",
    overview:
      "Colt Seavers, a battle-scarred stuntman who, having left the business a year earlier to focus on both his physical and mental health, is drafted back into service when the star of a mega-budget studio movie—being directed by his ex, Jody Moreno—goes missing.",
    poster_path: "/6GCOpT8QNJ8qWBGrDQG87rZe1Ep.jpg",
    backdrop_path: "/4QQ6paApyVJmJ1aFpjxotTFY0yj.jpg",
    vote_average: 7.3,
    release_date: "2024-05-01",
  },
];

const mockGenres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
];

const mockTopRatedMovies = [
  {
    id: 4,
    title: "The Shawshank Redemption",
    overview:
      "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.",
    poster_path: "/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    vote_average: 8.7,
    release_date: "1994-09-23",
  },
  {
    id: 5,
    title: "The Godfather",
    overview:
      "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    vote_average: 8.7,
    release_date: "1972-03-14",
  },
  {
    id: 6,
    title: "Pulp Fiction",
    overview:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    vote_average: 8.5,
    release_date: "1994-09-10",
  },
  {
    id: 7,
    title: "Interstellar",
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjAA2NjfRZ3SbZUrx9.jpg",
    vote_average: 8.4,
    release_date: "2014-11-05",
  },
  {
    id: 8,
    title: "Parasite",
    overview:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    vote_average: 8.5,
    release_date: "2019-05-30",
  },
];

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState(mockTrendingMovies);
  const [genres, setGenres] = useState(mockGenres);
  const [topRatedMovies, setTopRatedMovies] = useState(mockTopRatedMovies);
  const [filteredMovies, setFilteredMovies] = useState(topRatedMovies);

  // This would be replaced with actual API call in real implementation
  useEffect(() => {
    // Fetch trending movies from TMDB API
    // const fetchTrendingMovies = async () => {
    //   try {
    //     const response = await fetch(
    //       `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
    //     );
    //     const data = await response.json();
    //     setTrendingMovies(data.results);
    //   } catch (error) {
    //     console.error("Error fetching trending movies:", error);
    //   }
    // };

    // fetchTrendingMovies();

    // Set data from mocks for now
    setTrendingMovies(mockTrendingMovies);
    setGenres(mockGenres);
    setTopRatedMovies(mockTopRatedMovies);
    setFilteredMovies(mockTopRatedMovies);
  }, []);

  const handleFilterChange = (genreId) => {
    if (genreId === "all") {
      setFilteredMovies(topRatedMovies);
    } else {
      // In a real app, you'd call the API with genre filter
      // For mock data, we'll pretend filtering
      setFilteredMovies(
        topRatedMovies.filter((movie, index) => index % 2 === 0)
      );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen pb-10">
      {/* Hero Section */}
      <HeroSlider movies={trendingMovies} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Genres */}
        <GenreFilter genres={genres} onFilterChange={handleFilterChange} />

        {/* Top Rated Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Top Rated Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

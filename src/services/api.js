// Replace YOUR_API_KEY with your actual TMDB API key
const API_KEY = "c8a8400cbee9648eae09eebb8fad2bcf";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetch data from TMDB API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - Fetched data
 */
const fetchFromAPI = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Get trending movies
export const getTrendingMovies = (timeWindow = "day", page = 1) => {
  return fetchFromAPI(`/trending/movie/${timeWindow}`, { page });
};

// Get popular movies
export const getPopularMovies = (page = 1) => {
  return fetchFromAPI("/movie/popular", { page });
};

// Get top rated movies
export const getTopRatedMovies = (page = 1) => {
  return fetchFromAPI("/movie/top_rated", { page });
};

// Get now playing movies
export const getNowPlayingMovies = (page = 1) => {
  return fetchFromAPI("/movie/now_playing", { page });
};

// Get upcoming movies
export const getUpcomingMovies = (page = 1) => {
  return fetchFromAPI("/movie/upcoming", { page });
};

// Get movie details with all needed information
export const getMovieDetails = (movieId) => {
  return fetchFromAPI(`/movie/${movieId}`, {
    append_to_response: "videos,credits,similar,recommendations",
  });
};

// Search movies
export const searchMovies = (query, page = 1) => {
  return fetchFromAPI("/search/movie", { query, page });
};

// Get movie videos (trailers, teasers, etc.)
export const getMovieVideos = (movieId) => {
  return fetchFromAPI(`/movie/${movieId}/videos`);
};

// Discover movies by genre
export const discoverMoviesByGenre = (genreId, page = 1) => {
  return fetchFromAPI("/discover/movie", {
    with_genres: genreId,
    page,
    sort_by: "popularity.desc",
  });
};

// Get movie genres list
export const getMovieGenres = () => {
  return fetchFromAPI("/genre/movie/list");
};

export default {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieDetails,
  searchMovies,
  getMovieVideos,
  discoverMoviesByGenre,
  getMovieGenres,
};

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
      throw new Error("API request failed");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Get popular movies with pagination
export const getPopularMovies = (page = 1) => {
  return fetchFromAPI("/movie/popular", {
    page: page,
    language: "en-US",
  });
};

// Get movies by genre with pagination
export const getMoviesByGenre = (genreId, page = 1) => {
  return fetchFromAPI("/discover/movie", {
    with_genres: genreId,
    page: page,
    sort_by: "popularity.desc",
    language: "en-US",
  });
};

// Get trending movies
export const getTrendingMovies = (timeWindow = "day") => {
  return fetchFromAPI(`/trending/movie/${timeWindow}`);
};

// Get movie details
export const getMovieDetails = (movieId) => {
  return fetchFromAPI(`/movie/${movieId}`);
};

// Get movie credits
export const getMovieCredits = (movieId) => {
  return fetchFromAPI(`/movie/${movieId}/credits`);
};

// Get movie videos
export const getMovieVideos = (movieId) => {
  return fetchFromAPI(`/movie/${movieId}/videos`);
};

// Get similar movies
export const getSimilarMovies = (movieId) => {
  return fetchFromAPI(`/movie/${movieId}/similar`);
};

// Get movie genres
export const getMovieGenres = () => {
  return fetchFromAPI("/genre/movie/list");
};

// Search movies
export const searchMovies = (query, page = 1) => {
  return fetchFromAPI("/search/movie", { query, page });
};

export default {
  getTrendingMovies,
  getPopularMovies,
  getMoviesByGenre,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getMovieGenres,
  searchMovies,
};

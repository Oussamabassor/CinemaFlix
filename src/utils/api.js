// You would need to get your API key from https://www.themoviedb.org/
// For security reasons, it's best to store this in environment variables
// For local development, you can create a .env file and add VITE_API_KEY=your_api_key

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "your_api_key_here";
const BASE_URL = "https://api.themoviedb.org/3";

// API endpoints
export const API_ENDPOINTS = {
  TRENDING: `${BASE_URL}/trending/movie/day`,
  SEARCH: `${BASE_URL}/search/multi`,
  MOVIE_DETAILS: `${BASE_URL}/movie/`,
  TV_DETAILS: `${BASE_URL}/tv/`,
  GENRES: `${BASE_URL}/genre/movie/list`,
  TOP_RATED: `${BASE_URL}/movie/top_rated`,
  UPCOMING: `${BASE_URL}/movie/upcoming`,
  POPULAR: `${BASE_URL}/movie/popular`,
  POPULAR_TV: `${BASE_URL}/tv/popular`,
};

// Image URLs
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
export const POSTER_SIZE = "w500";
export const BACKDROP_SIZE = "original";
export const PROFILE_SIZE = "w200";

// Fetch data from the API
export const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params,
    }).toString();

    const response = await fetch(`${endpoint}?${queryParams}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Get trending movies
export const getTrendingMovies = async () => {
  return fetchFromAPI(API_ENDPOINTS.TRENDING);
};

// Search movies and TV shows
export const searchMedia = async (query, page = 1) => {
  return fetchFromAPI(API_ENDPOINTS.SEARCH, { query, page });
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  return fetchFromAPI(`${API_ENDPOINTS.MOVIE_DETAILS}${movieId}`, {
    append_to_response: "videos,credits",
  });
};

// Get TV show details
export const getTVDetails = async (tvId) => {
  return fetchFromAPI(`${API_ENDPOINTS.TV_DETAILS}${tvId}`, {
    append_to_response: "videos,credits",
  });
};

// Get movie genres
export const getGenres = async () => {
  return fetchFromAPI(API_ENDPOINTS.GENRES);
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  return fetchFromAPI(API_ENDPOINTS.TOP_RATED, { page });
};

// Get movie poster URL
export const getPosterUrl = (path) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${POSTER_SIZE}${path}`;
};

// Get backdrop URL
export const getBackdropUrl = (path) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${BACKDROP_SIZE}${path}`;
};

// Get profile URL for cast members
export const getProfileUrl = (path) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${PROFILE_SIZE}${path}`;
};

// Format movie data for consistent use across components
export const formatMovieData = (movie) => {
  return {
    id: movie.id,
    title: movie.title || movie.name,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date || movie.first_air_date,
    media_type: movie.media_type || "movie",
  };
};

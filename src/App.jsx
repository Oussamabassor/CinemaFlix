import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Import animation styles
import "./styles/animations.css";

// Pages
import HomePage from "./pages/HomePage";
import MovieDetail from "./pages/MovieDetail";
import NotFound from "./pages/NotFound";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import CategoriesPage from "./pages/CategoriesPage";
import SearchResults from "./pages/SearchResults";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen text-white bg-gray-900">
        <Navbar />
        <main className="flex-grow mt-16 md:mt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TVShowsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

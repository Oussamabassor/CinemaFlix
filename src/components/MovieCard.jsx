import { Link } from "react-router-dom";
import ImageLoader from "./ImageLoader";

const MovieCard = ({ movie }) => {
  const { id, title, poster_path, vote_average } = movie;
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/placeholder.jpg";

  return (
    <Link
      to={`/movie/${id}`}
      className="group relative overflow-hidden rounded-lg bg-gray-900 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/20"
    >
      <div className="aspect-[2/3] w-full">
        <ImageLoader src={imageUrl} alt={title} className="h-full w-full" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      {/* Rating Badge */}
      <div className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
        {vote_average?.toFixed(1)}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="text-white font-semibold line-clamp-2">{title}</h3>
        <button className="mt-2 w-full rounded bg-primary py-1 text-white text-sm font-medium transition-colors hover:bg-primary-dark">
          View Details
        </button>
      </div>
    </Link>
  );
};

export default MovieCard;

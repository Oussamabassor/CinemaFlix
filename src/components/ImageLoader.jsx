import { useState, useEffect } from "react";

const ImageLoader = ({ src, alt, className, blur = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    // Create new image to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };

    // Handle errors
    img.onerror = () => {
      setImgSrc("/placeholder.jpg"); // Fallback image
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className={`image-container relative overflow-hidden ${className}`}>
      {!isLoaded && blur && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default ImageLoader;

import React from "react";

const SkeletonLoader = ({ type = "card", count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "movie-card":
        return (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-[2/3] w-full bg-gray-700 shimmer"></div>
            <div className="p-3">
              <div className="h-5 w-3/4 bg-gray-700 shimmer rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-700 shimmer rounded"></div>
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="h-[70vh] w-full bg-gray-800 relative overflow-hidden shimmer">
            <div className="absolute bottom-0 left-0 w-full p-8 pb-16">
              <div className="h-8 w-24 bg-gray-700 rounded mb-4"></div>
              <div className="h-12 w-3/4 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-1/3 bg-gray-700 rounded mb-6"></div>
              <div className="flex gap-4">
                <div className="h-12 w-36 bg-gray-700 rounded"></div>
                <div className="h-12 w-28 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        );

      case "detail":
        return (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-[2/3] w-full bg-gray-800 shimmer rounded-lg"></div>
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="h-10 w-3/4 bg-gray-800 shimmer rounded mb-4"></div>
              <div className="h-6 w-1/3 bg-gray-800 shimmer rounded mb-6"></div>
              <div className="flex gap-4 mb-6">
                <div className="h-8 w-16 bg-gray-800 shimmer rounded-full"></div>
                <div className="h-8 w-16 bg-gray-800 shimmer rounded-full"></div>
                <div className="h-8 w-16 bg-gray-800 shimmer rounded-full"></div>
              </div>
              <div className="h-4 w-full bg-gray-800 shimmer rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-800 shimmer rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-800 shimmer rounded mb-6"></div>
              <div className="flex gap-4">
                <div className="h-12 w-36 bg-gray-800 shimmer rounded-lg"></div>
                <div className="h-12 w-36 bg-gray-800 shimmer rounded-lg"></div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="h-20 w-full bg-gray-800 shimmer rounded"></div>;
    }
  };

  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-4">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

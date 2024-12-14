import React from "react";

const WorkoutPageSkeleton = () => {
  return (
    <div className="workout-page-skeleton animate-pulse">
      {/* Header Skeleton */}
      <div className="header-skeleton flex items-center justify-between p-4">
        <div className="back-button-skeleton bg-gray-300 w-8 h-8 rounded-full"></div>
        <div className="logo-skeleton bg-gray-300 w-12 h-12 rounded-full"></div>
        <div className="title-skeleton bg-gray-300 h-6 w-1/3 rounded"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="search-bar-skeleton flex items-center mt-4 px-4">
        <div className="input-skeleton bg-gray-300 h-10 w-full rounded-full"></div>
        <div className="icon-skeleton bg-gray-300 w-10 h-10 rounded-full ml-2"></div>
      </div>

      {/* Categories Skeleton */}
      <div className="categories-skeleton flex gap-4 mt-6 px-4">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="category-skeleton bg-gray-300 w-24 h-10 rounded-lg"
          ></div>
        ))}
      </div>

      {/* Workout List Skeleton */}
      <div className="workout-list-skeleton grid grid-cols-1 gap-6 mt-8 px-4">
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className="workout-card-skeleton bg-gray-300 flex items-center gap-4 rounded-lg p-4"
          >
            <div className="image-skeleton bg-gray-300 w-24 h-24 rounded"></div>
            <div className="details-skeleton flex-1">
              <div className="title-skeleton bg-gray-300 h-4 w-1/2 mb-2 rounded"></div>
              <div className="description-skeleton bg-gray-300 h-3 w-3/4 mb-2 rounded"></div>
              <div className="button-skeleton bg-gray-300 h-8 w-1/3 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="footer-skeleton flex justify-between items-center px-4 py-6 mt-6 bg-gray-100">
        <div className="info-skeleton bg-gray-300 h-6 w-1/4 rounded"></div>
        <div className="top-up-button-skeleton bg-gray-300 h-10 w-24 rounded-lg"></div>
      </div>
    </div>
  );
};

export default WorkoutPageSkeleton;

import React from 'react';

const HomepageSkeleton = () => {
  return (
    <div className="homepage-skeleton animate-pulse">
      {/* Header Skeleton */}
      <div className="header-skeleton">
        <div className="header-top-skeleton flex justify-between items-center p-4">
          <div className="logo-skeleton bg-gray-300 rounded-full w-12 h-12"></div>
          <div className="title-skeleton bg-gray-300 h-6 w-1/2 rounded"></div>
          <div className="ai-logo-skeleton bg-gray-300 rounded-full w-12 h-12"></div>
        </div>
        
        {/* Search Bar Skeleton */}
        <div className="search-skeleton flex items-center justify-center mt-4 px-4">
          <div className="search-input-skeleton bg-gray-300 h-10 w-full rounded-full"></div>
          <div className="search-icon-skeleton bg-gray-300 w-10 h-10 rounded-full ml-2"></div>
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="banner-skeleton mt-4 mx-auto w-95% h-64 bg-gray-300 rounded-lg"></div>

      {/* Section Buttons Skeleton */}
      <div className="buttons-skeleton flex justify-center gap-4 mt-8">
        {[1, 2, 3].map((_, index) => (
          <div 
            key={index} 
            className="button-skeleton bg-gray-300 w-24 h-16 rounded-lg"
          ></div>
        ))}
      </div>

      {/* Programs Section Skeleton */}
      <div className="programs-skeleton mt-8 px-4">
        <div className="title-skeleton bg-gray-300 h-8 w-1/3 mx-auto mb-4 rounded"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <div 
              key={index} 
              className="program-card-skeleton bg-gray-300 h-48 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageSkeleton;
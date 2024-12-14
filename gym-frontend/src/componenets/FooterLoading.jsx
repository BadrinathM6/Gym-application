import React from "react";
import "../css/FooterSkeleton.css"; // Add the required CSS for styling

const FooterSkeleton = () => {
  return (
    <div className="footer-skeleton">
      <div className="skeleton footer-item"></div>
      <div className="skeleton footer-item"></div>
      <div className="skeleton footer-item"></div>
      <div className="skeleton footer-item"></div>
    </div>
  );
};

export default FooterSkeleton;

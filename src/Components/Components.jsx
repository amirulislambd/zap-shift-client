import React from "react";
import { FaTruckFast } from "react-icons/fa6";

const Loading = ({
  text = "Loading...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen" : "py-10"
      }`}
    >
      {/* Spinner */}
      <span className="loading loading-spinner loading-lg text-primary"></span>

      {/* Delivery Icon */}
      <FaTruckFast className="text-4xl text-green-500 animate-pulse" />

      {/* Text */}
      <p className="text-sm text-gray-400 tracking-wide">{text}</p>
    </div>
  );
};

export default Loading;

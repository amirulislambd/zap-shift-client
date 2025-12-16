import React from "react";
import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center  ">
      <div className="flex flex-col mt-8 md:flex-row items-center md:mt-12 justify-center max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-12 gap-8">
        
        {/* Text Content */}
        <div className="w-full text-center ">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-red-600 mb-4 md:mb-6 animate-bounce">
            403
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-semibold mb-4 text-red-600">
            Oops! Access Forbidden
          </h2>
          <p className="text-gray-600 mb-6 text-base md:text-xl lg:text-2xl">
            You don’t have permission to view this page. Only authorized users
            can access this section.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <MdHome size={24} />
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;

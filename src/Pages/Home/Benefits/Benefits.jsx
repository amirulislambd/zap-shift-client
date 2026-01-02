import React from "react";
import BenefitsData from './BenefitsData'; // adjust path as needed

const Benefits = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-12 py-12 bg-gray-50">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
        Our Benefits
      </h2>

      {/* Benefits Cards */}
      <div className="flex flex-col gap-6">
        {BenefitsData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          >
            {/* Image */}
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-contain"
              />
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-semibold text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;

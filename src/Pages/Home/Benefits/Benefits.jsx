import React from "react";
import BenefitsData from './BenefitsData'; // adjust path as needed

const Benefits = () => {
  return (
    <section className="  px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Our Benefits</h2>

      <div className="flex flex-col gap-6">
        {BenefitsData.map((item) => (
          <div
            key={item.id}
            className="card bg-white shadow-lg p-5 flex flex-row items-center hover:shadow-2xl transition"
          >
            {/* Left Image */}
            <figure className="w-24 h-24 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-14 h-14 object-contain"
              />
            </figure>

            {/* Vertical Divider */}
            <div className="divider divider-horizontal mx-4"></div>

            {/* Right Content */}
            <div className="card-body p-0">
              <h3 className="card-title text-lg text-primary">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;

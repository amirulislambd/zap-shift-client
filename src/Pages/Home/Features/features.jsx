import React from "react";
import { featuresData } from "./featuresData";

const Features = () => {
  return (
    <section className="my-5 md:my-10 lg:my-20 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        How it Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuresData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white text-primary shadow-lg p-6 rounded-2xl 
                         hover:shadow-2xl transition-transform transform hover:-translate-y-1
                         cursor-pointer flex flex-col items-center text-center"
            >
              <div className="text-primary text-4xl mb-4">
                <Icon />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;

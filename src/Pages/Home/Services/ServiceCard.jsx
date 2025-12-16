import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;

  return (
    <div className="card bg-white items-center text-center shadow-lg p-6 hover:shadow-xl transition rounded-xl hover:bg-yellow-50 ">
      <div className="text-primary text-5xl mb-4">
        <Icon />
      </div>
      <h3 className="text-xl md:text-2xl font-semibold mb-2 text-primary">
        {title}
      </h3>
      <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
  );
};

export default ServiceCard;

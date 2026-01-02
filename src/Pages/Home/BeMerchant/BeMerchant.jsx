import React from "react";
import location from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="bg-[#03373D] bg-no-repeat bg-cover p-8 sm:p-12 md:p-16 lg:p-20 rounded-3xl lg:rounded-4xl"
      style={{ backgroundImage: "url('assets/be-a-merchant-bg.png')" }}
    >
      <div
        data-aos="fade-down"
        data-aos-duration="1500"
        className="hero-content flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8 lg:gap-16"
      >
        {/* Image */}
        <img
          src={location}
          alt="Merchant location"
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-sm rounded-lg shadow-2xl"
        />

        {/* Text */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button className="btn btn-primary rounded-full text-black px-6 py-3">
              Become a Merchant
            </button>
            <button className="btn btn-primary btn-outline rounded-full text-primary hover:text-white px-6 py-3">
              Earn with ZapShift Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;

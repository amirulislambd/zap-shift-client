import React from "react";
import Slider from "react-slick";
import { testimonialsData } from "../CustomersAreSaying/testimonialsData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import customer from "../../../assets/customer-top.png";

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // desktop: 3 cards
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 768, // mobile / small devices
        settings: {
          slidesToShow: 1, // ✅ show only 1 card
          centerMode: false, // single card fully active
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <section className="my-20 px-4 max-w-6xl mx-auto">
      <div className="bg-base-200 py-16">
        <div
          data-aos="fade-up"
          data-aos-duration="3000"
          className="hero-content flex-col  text-center gap-8 max-w-6xl mx-auto"
        >
          {/* Customer image */}
          <img
            src={customer}
            alt="Happy customer"
            className="max-w-sm rounded-lg shadow-2xl mx-auto md:mx-0"
          />

          {/* Heading & text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              What Our Customers Are Saying
            </h1>
            <p className="text-accent text-lg md:text-xl">
              Enhance posture, mobility, and well-being effortlessly with
              Posture Pro. Achieve proper alignment, reduce pain, and strengthen
              your body with ease!
            </p>
          </div>
        </div>
      </div>

      <Slider {...settings}>
        {testimonialsData.map((item, index) => (
          <div key={index} className="px-4">
            <div
              className="bg-white rounded-xl shadow-lg p-6 text-center
                            transition-transform duration-300 transform
                            scale-90 opacity-60
                            pointer-events-none"
            >
              {/* ✅ Quotation icon above the review text */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 mx-auto mb-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9.5 6C7.01472 6 5 8.01472 5 10.5C5 12.9853 7.01472 15 9.5 15C11.9853 15 14 12.9853 14 10.5C14 8.01472 11.9853 6 9.5 6ZM9.5 13C8.11929 13 7 11.8807 7 10.5C7 9.11929 8.11929 8 9.5 8C10.8807 8 12 9.11929 12 10.5C12 11.8807 10.8807 13 9.5 13ZM18.5 6C16.0147 6 14 8.01472 14 10.5C14 12.9853 16.0147 15 18.5 15C20.9853 15 23 12.9853 23 10.5C23 8.01472 20.9853 6 18.5 6ZM18.5 13C17.1193 13 16 11.8807 16 10.5C16 9.11929 17.1193 8 18.5 8C19.8807 8 21 9.11929 21 10.5C21 11.8807 19.8807 13 18.5 13Z" />
              </svg>

              <p className="text-gray-700 mb-6">{item.message}</p>
              <div className="flex flex-col items-center">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 rounded-full mb-2 object-cover"
                />
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* ✅ Center card highlight and responsiveness */}
      <style>
        {`
          /* Center card is fully visible and interactive */
          .slick-center div {
            transform: scale(1.05) !important;
            opacity: 1 !important;
            z-index: 10;
            pointer-events: auto !important; /* only center clickable */
          }

          /* Other cards slightly smaller/faded */
          .slick-slide div {
            transition: transform 0.3s, opacity 0.3s;
          }

          /* Mobile: single card fully active */
          @media (max-width: 768px) {
            .slick-slide div {
              transform: scale(1) !important;
              opacity: 1 !important;
              pointer-events: auto !important; /* all cards clickable */
            }
          }
        `}
      </style>
    </section>
  );
};

export default Testimonials;

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { testimonialsData } from "../CustomersAreSaying/testimonialsData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import customer from "../../../assets/customer-top.png";
import icon from "../../../assets/reviewQuote.png";

const Testimonials = () => {
  const [slidesToShow, setSlidesToShow] = useState(3); // Default desktop

  // Update slides based on screen width
  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setSlidesToShow(1); // Mobile
    } else if (width < 1024) {
      setSlidesToShow(2); // Tablet
    } else {
      setSlidesToShow(3); // Desktop
    }
  };

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    centerMode: false, // Disable centerMode
    centerPadding: "0px",
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <section className="my-20 px-4 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-base-200 py-16">
        <div
          data-aos="fade-up"
          data-aos-duration="3000"
          className="flex flex-col items-center text-center gap-8 max-w-6xl mx-auto"
        >
          <img
            src={customer}
            alt="Happy customer"
            className="max-w-sm rounded-lg shadow-2xl mx-auto"
          />

          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Our Customers Are Saying
            </h1>
            <p className="text-accent text-lg sm:text-xl">
              Enhance posture, mobility, and well-being effortlessly with
              Posture Pro. Achieve proper alignment, reduce pain, and strengthen
              your body with ease!
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Slider */}
      <Slider {...settings}>
        {testimonialsData.map((item, index) => (
          <div key={index} className="sm:px-4 px-0">
            <div
              className="bg-white rounded-xl shadow-lg p-6 text-center
                         transition-transform duration-300 transform
                         flex flex-col justify-between
                         w-full
                         min-h-[360px] md:min-h-[380px] lg:min-h-[400px]"
            >
              <img src={icon} alt="quote" className="mx-auto mb-4 w-10 h-10" />
              <p className="text-gray-700 mb-6 flex-1">{item.message}</p>

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
    </section>
  );
};

export default Testimonials;

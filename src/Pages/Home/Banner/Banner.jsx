import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from '../../../assets/banner/banner1.png'
import bannerImg2 from '../../../assets/banner/banner2.png'
import bannerImg3 from '../../../assets/banner/banner3.png'
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  return (
    <div className="w-full overflow-hidden">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false} // hide status like 1/3
        showIndicators={true} // dots below
        interval={4000}
        swipeable
        emulateTouch
      >
        <div>
          <img
            src={bannerImg1}
            alt="Banner 1"
            className="w-full h-auto object-cover"
          />
        </div>
        <div>
          <img
            src={bannerImg2}
            alt="Banner 2"
            className="w-full h-auto object-cover"
          />
        </div>
        <div>
          <img
            src={bannerImg3}
            alt="Banner 3"
            className="w-full h-auto object-cover"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;

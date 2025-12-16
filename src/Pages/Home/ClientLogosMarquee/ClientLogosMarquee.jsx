import React from "react";
import Marquee from "react-fast-marquee";

// import logos
import Logo1 from "../../../assets/brands/amazon.png";
import Logo2 from "../../../assets/brands/amazon_vector.png";
import Logo3 from "../../../assets/brands/casio.png";
import Logo4 from "../../../assets/brands/moonstar.png";
import Logo5 from "../../../assets/brands/randstad.png";
import Logo6 from "../../../assets/brands/star.png";
import Logo7 from "../../../assets/brands/start_people.png";

const logos = [Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7];

const ClientLogosMarquee = () => {
  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-primary ">We've helped thousands of sales teams</h2>

      <Marquee
        speed={50}
        gradient={false}
        pauseOnHover={true}
      >
        {logos.map((logo, index) => (
          <div key={index} className="mx-10">
            <img
              src={logo}
              alt={`Client Logo ${index}`}
              className="h-6 object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogosMarquee;

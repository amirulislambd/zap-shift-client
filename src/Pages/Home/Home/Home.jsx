import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import ClientLogosMarquee from '../ClientLogosMarquee/ClientLogosMarquee';
import Benefits from '../benefits/Benefits';
import BeMerchant from '../BeMerchant/BeMerchant';
import Features from '../Features/features';
import Testimonials from '../CustomersAreSaying/Testimonials';


const Home = () => {
    return (
        <div>
            <Banner/>
            <Features/>
            <Services/>
            <ClientLogosMarquee/>
            <Benefits/>
            <BeMerchant/>
            <Testimonials/>
        </div>
    );
};

export default Home;
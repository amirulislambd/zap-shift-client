import React from 'react';
import BangladeshMap from './BangladeshMap';
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const serviceCanter = useLoaderData()
    console.log(serviceCanter)
    return (
        <div className='max-w-4xl mx-auto px-4 py-10'>
            <h1 className='text-3xl font-bold text-center mb-6'>We are available in 64 district</h1>
            <BangladeshMap serviceCanter={serviceCanter}/>
        </div>
    );
};

export default Coverage;
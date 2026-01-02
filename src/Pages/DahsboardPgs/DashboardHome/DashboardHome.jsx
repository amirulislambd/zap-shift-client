import React from 'react';
import useUserRole from '../../../Hooks/UseUserRole';
import Loading from '../../../Components/Components';
import UserDashboard from './UserDashboard';
import RiderDashboard from './RiderDashboard';
import AdminDashboard from './AdminDashboard';
import Forbidden from '../../../Pages/Forbidden/Forbidden'

const DashboardHome = () => {
    const {role, isLoading}= useUserRole();
    if(isLoading){
        return <Loading/>
    }
    if(role === 'user'){
        return <UserDashboard/>
    }
    else if(role === 'rider'){
        return <RiderDashboard/>
    }
    else if(role === 'admin'){
        return <AdminDashboard/>
    }
    else {
        return <Forbidden/>
    }
};

export default DashboardHome;
import React from 'react';
import {Outlet, Navigate} from 'react-router-dom';
const ProtectRoute = () => {
    const email = localStorage.getItem("email");
    return email ? <Outlet/> : <Navigate to = "/"/>
}

export default ProtectRoute;
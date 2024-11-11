import React from 'react';
import { Outlet } from 'react-router-dom';

const GuestLayout = () => (
    <div>
        <h1>Welcome to the Application</h1>
        <Outlet />
    </div>
);

export default GuestLayout;
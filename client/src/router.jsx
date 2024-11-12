// src/routes.js

import React from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from './layouts/DefaultLayout.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';
import ProtectedRoutes from "./hooks/ProtectedRoutes.jsx";
import MainContent from "./views/MainContent.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import NotFound from "./views/NotFound.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes element={<DefaultLayout />} />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            },
            {
                path: '/dashboard',
                element: <ProtectedRoutes element={<MainContent />}  /> //role={['Admin', 'Student']}
            },
            {
                path: '/projects',
                element: <ProtectedRoutes element={<MainContent />}  /> //role={['Admin', 'Student']}
            },
            {
                path: '/myproject',
                element: <ProtectedRoutes element={<MainContent />}  /> //role={['Admin', 'Student']}
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path:"/signup",
                element:<Signup/>
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;
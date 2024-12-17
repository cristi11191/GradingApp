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
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes element={<DefaultLayout />} role={['user', 'admin']} />,
        children: [
            // User-specific routes
            {
                path: '/',
                element: <Navigate to="/dashboard" />,
                role: ['user'], // User-specific role
            },
            {
                path: '/dashboard',
                element: <ProtectedRoutes element={<MainContent />} role={['user']} />
            },
            {
                path: '/projects',
                element: <ProtectedRoutes element={<MainContent />} role={['user']} />,
            },
            {
                path: '/myproject',
                element: <ProtectedRoutes element={<MainContent />} role={['user']} />,
            },
            {
                path: '/evaluation',
                element: <ProtectedRoutes element={<MainContent />} role={['user']} />,
            },
            {
                path: '/project/:projectId',
                element: <ProtectedRoutes element={<MainContent />} role={['user']} />,
            },

            // Admin-specific routes
            {
                path: '/admin',
                element: <ProtectedRoutes element={<AdminDashboard />} role={['admin']} />,
            },
            {
                path: '/admin/projects',
                element: <ProtectedRoutes element={<MainContent />} role={['admin']} />,
            },
            {
                path: '/admin/project/:projectId',
                element: <ProtectedRoutes element={<MainContent />} role={['admin']} />,
            },
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
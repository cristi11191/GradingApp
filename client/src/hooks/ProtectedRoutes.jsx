// src/hooks/ProtectedRoutes.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

// Simulează o funcție de autentificare; poți folosi o funcție reală dintr-un context de autentificare
const isAuthenticated = () => !!localStorage.getItem('token');

// Simulează funcția de obținere a rolului utilizatorului
const userRole = localStorage.getItem('role'); // În practică, obține rolul dintr-un context global sau API

// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ element, role = [] }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    if (role.length > 0 && !role.includes(userRole)) {
        return <Navigate to="/not-authorized" />; // Definește o pagină pentru acces interzis, dacă e cazul
    }
    return element;
};

export default ProtectedRoutes;

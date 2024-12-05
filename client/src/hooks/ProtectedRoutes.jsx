// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api, { validateToken } from "../services/api.jsx";

const isAuthenticated = () => !!localStorage.getItem('token');
const userRole = localStorage.getItem('role'); // Fetch role from localStorage

// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ element, role = [] }) => {
    const [isValidToken, setIsValidToken] = useState(null);
    const location = useLocation(); // Hook to detect route changes

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return false;
            }
            try {
                const response = await api.post('/api/auth/validate', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { isValid, tokenVersion: currentVersion } = response.data;

                // Compare tokenVersion if included in backend logic
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.tokenVersion !== currentVersion) {
                    console.warn("Token version mismatch.");
                    setIsValidToken(false);
                    return false;
                }

                return isValid;
            } catch (error) {
                console.error("Validation error:", error);
                setIsValidToken(false);
                return false;
            }
        };


        setIsValidToken(validateToken());
    }, [location]); // Re-run whenever the route changes

    if (isValidToken === null) {
        return <div>Loading...</div>; // Show loading while token validation is in progress
    }

    if (!isAuthenticated() || !isValidToken) {
        return <Navigate to="/login" />;
    }

    if (role.length > 0 && !role.includes(userRole)) {
        return <Navigate to="/not-authorized" />;
    }

    return element;
};

export default ProtectedRoutes;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Setează un token pentru autentificare (în practică, utilizează un serviciu de autentificare)
        localStorage.setItem('token', 'your-jwt-token');
        navigate('/dashboard');
    };

    const handleSignup = () => {
        navigate('/signup'); // Redirecționează utilizatorul la pagina de Signup
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleLogin}>Log In</button>
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Login;

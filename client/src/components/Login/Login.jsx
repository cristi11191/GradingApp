import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {login} from "../../services/authServices.jsx";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            localStorage.setItem('token', response.token); // Store JWT token
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            setError(error.error || "Login failed"); // Display error message
        }
    };

    const handleSignup = () => {
        navigate('/signup'); // Redirect to signup page
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
                       required/>
                <input type="password" name="password" placeholder="Password" value={formData.password}
                       onChange={handleChange} required/>
                <button type="submit">Log In</button>
            </form>
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Login;

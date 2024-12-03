import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Iconițe pentru vizibilitatea parolei
import "./Signup.css";
import { signup } from "../../services/authServices.jsx";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Vizibilitatea parolei
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Vizibilitatea confirmării parolei

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await signup(formData);
            navigate("/login");
        } catch (error) {
            setError(error.error || "Signup failed");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Happy to meet you! 😊</h2>
                <p className="text-center text-gray-600 mb-4">Create your account.</p>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"} // Vizibilitatea parolei
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-transparent text-black rounded-full w-15 h-15 hover:bg-gray-300 transition z-9999"
                        >
                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"} // Vizibilitatea confirmării parolei
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-transparent text-black rounded-full w-15 h-15 hover:bg-gray-300 transition"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition duration-200"
                        >
                            Register Now
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-right">
                    <button
                        className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200"
                        onClick={handleLogin}
                    >
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;

import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";
import {signup} from "../../services/authServices.jsx";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await signup(formData);
            navigate("/login"); // Redirect to dashboard
        } catch (error) {
            setError(error.error || "Signup failed"); // Display error message
        }
    };

    return (
        <div className="min-h-screen py-40 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Happy to meet you! 😊</h2>
                    <p className="text-gray-600 mb-4">Create your account.</p>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form  onSubmit={handleSignup}>
                        <div className="mt-5 ">
                            <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div className="mt-5">
                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div className="mb-4">
                            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div className="mb-4">
                            <input type="password" placeholder="Confirm Password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-200">Register Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;

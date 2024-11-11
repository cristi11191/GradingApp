import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();

    const handleSignup = () => {
        localStorage.setItem('token', 'your-token');
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen py-40 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Happy to meet you! 😊</h2>
                    <p className="text-gray-600 mb-4">Create your account.</p>
                    <form>
                        <div className="grid grid-cols-2 gap-5 ">
                            <input type="text" placeholder="Firstname" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <input type="text" placeholder="Lastname" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div className="mt-5">
                            <input type="email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div className="mb-4">
                            <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div className="mb-4">
                            <input type="password" placeholder="Confirm Password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div className="text-center">
                            <button type="button" className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-200">Register Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;

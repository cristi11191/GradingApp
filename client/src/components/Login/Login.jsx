import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authServices.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem("token", response.token); // Store JWT token
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setError(error.error || "Login failed"); // Display error message
    }
  };

  const handleSignup = () => {
    navigate("/signup"); // Redirect to signup page
  };

  return (
    <div className="min-h-screen py-40 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Log In! 😊</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mt-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-200"
            >
              Log In
            </button>
          </div>
        </form>
        <div className="mt--4 p-8 relative">
          <button
            className="w-32 bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-200 absolute bottom-4 right-0"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

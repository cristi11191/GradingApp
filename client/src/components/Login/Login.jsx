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
      localStorage.setItem("role", response.role); // Store role if needed
      localStorage.setItem('loginTimestamp', performance.now()); // Save login timestamp
      navigate("/dashboard"); // Redirect to dashboard
      window.location.reload(); // Force re-render to apply token

    } catch (error) {
      setError(error.error || "Login failed"); // Display error message
    }
  };


  const handleSignup = () => {
    navigate("/signup"); // Redirect to signup page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Log In! 😊</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition duration-200"
            >
              Log In
            </button>
          </div>
        </form>
        <div className="mt-6 text-right">
          <button
            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200"
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

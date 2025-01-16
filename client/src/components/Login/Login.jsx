import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authServices.jsx";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem("token", response.token); // Store JWT token
      localStorage.setItem("role", response.user.role); // Store role if needed
      localStorage.setItem("name", response.user.name); // Store name if needed
      localStorage.setItem("email", response.user.email); // Store email if needed
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#253E51] py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#253E51] mb-6 text-center">Log In! 😊</h2>
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
                  className="w-full p-3 border border-[#6F9FBC] rounded focus:outline-none focus:ring-2 focus:ring-[#416E8B]"
              />
            </div>
            <div className="relative">
              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[#6F9FBC] rounded focus:outline-none focus:ring-2 focus:ring-[#416E8B]"
              />
              <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-transparent text-black rounded-full w-15 h-15 hover:bg-[#6F9FBC] transition z-9999"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            <div>
              <button
                  type="submit"
                  className="w-full bg-[#253E51] text-white py-3 rounded hover:bg-[#416E8B] transition duration-200"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="mt-6 text-right">
            <button
                className="bg-[#253E51] text-white py-2 px-4 rounded hover:bg-[#416E8B] transition duration-200"
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

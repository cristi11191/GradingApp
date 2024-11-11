import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Signup.css"

const Signup = () => {
    const navigate=useNavigate();

    const handleSignup=()=>{
        localStorage.setItem('token','your-token');
        navigate("/dashboard");
    }
    return (
        <div>
            <h2>Signup</h2>
            {/* Formularul de înregistrare */}
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Signup;

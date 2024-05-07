import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Make sure to import the stylesheet

function Login() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/home'); // Redirect to the Home page after clicking login
    };

    return (
        <div className="loginContainer">
            <div className="loginForm">
                < img src={require("./logo1.png")} alt="logo" className="loginLogo"/>
                <h2>Welcome back</h2>
                <input type="email" placeholder="Email address*" />
                <input type="password" placeholder="Password*" />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default Login;
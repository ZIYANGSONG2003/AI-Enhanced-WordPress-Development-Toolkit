import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Make sure to import the stylesheet

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch('httpgit pull origin main://your-backend-server.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const result = await response.json();
            if (result.success) {
                navigate('/home'); // Redirect to the Home page after successful login
            } else {
                setLoginError('Invalid credentials or server error.');
            }
        } catch (error) {
            setLoginError(error.message);
        }
    };

    return (
        <div className="loginContainer">
            <div className="loginForm">
                <img src={require("./logo1.png")} alt="logo" className="loginLogo"/>
                <h2>Welcome back</h2>
                <input
                    type="email"
                    placeholder="Email address*"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password*"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit</button>
                {loginError && <p className="error">{loginError}</p>}
            </div>
        </div>
    );
}

export default Login;

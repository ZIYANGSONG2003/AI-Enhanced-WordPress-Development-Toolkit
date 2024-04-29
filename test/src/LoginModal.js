// LoginModal.js
import React, { useState } from 'react';
import './LoginModal.css'; // Create and import a corresponding CSS file for styling

const LoginModal = ({ show, handleClose, handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitLogin = (e) => {
        e.preventDefault();
        handleLogin(username, password);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="loginModal">
            <div className="modalContent">
                <span className="closeButton" onClick={handleClose}>&times;</span>
                <form onSubmit={submitLogin}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;

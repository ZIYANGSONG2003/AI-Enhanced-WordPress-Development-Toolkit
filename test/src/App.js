import React from 'react';
import Home from './Home';
import Login from './Login'; // Make sure to import the Login component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />  // Set Login as the root path
                <Route path="/home" element={<Home />} />  // Change the Home component path
            </Routes>
        </Router>
    );
}

export default App;
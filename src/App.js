// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Edit from './pages/Edit';
import Weather from './pages/Marine';
import AboutUs from './pages/AboutUs';
import HeaderNavbar from "./components/Header";

const App = () => {
    return (
        <Router>
            <HeaderNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/edit" element={<Edit />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/about-us" element={<AboutUs />} />
            </Routes>
        </Router>
    );
};

export default App;

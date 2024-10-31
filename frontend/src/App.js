import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import {Login, Home} from './pages'

axios.defaults.withCredentials = true;

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/auth/check-auth')
            .then((response) => {
                setIsAuthenticated(response.data.isAuthenticated);
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/home" /> : <Login setAuth={setIsAuthenticated} />}
                />
                <Route
                    path="/home"
                    element={isAuthenticated ? <Home setAuth={setIsAuthenticated} /> : <Navigate to="/login" />}
                />
                <Route
                    path="*"
                    element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
                />
            </Routes>
        </Router>
    );
};

export default App;

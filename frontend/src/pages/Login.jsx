import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuth }) => {
    const [facultyId, setFacultyId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/login', { faculty_id: facultyId, password });
            setAuth(true); // Set auth to true on success
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} placeholder="Faculty ID" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;

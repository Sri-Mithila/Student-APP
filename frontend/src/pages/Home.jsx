import React from 'react';
import axios from 'axios';

const Home = ({ setAuth }) => {
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout');
            setAuth(false);
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <div>
            <h1>Welcome, User!</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;

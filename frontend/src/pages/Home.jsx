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

    const handleAuthorize = async () => {
        try {
            await axios.get('http://localhost:5000/api/auth/google');
            console.log("Authorization successful");
        } catch (err) {
            console.error('Authorization failed', err);
        }
    };
    return (
        <div className="grid grid-cols-2 gap-6 p-8 bg-gray-100 h-screen items-center justify-center">
            <div className="col-span-2 bg-white shadow-md p-6 rounded-lg text-center text-xl font-bold text-gray-800 transform transition-transform hover:-translate-y-1">
                <h1>Welcome, User!</h1>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg text-center transform transition-transform hover:-translate-y-1 space-y-4">
                <button 
                    onClick={handleAuthorize} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Authorize
                </button>
                <button 
                    onClick={handleLogout} 
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Home;

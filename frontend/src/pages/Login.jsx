import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuth }) => {
    const [facultyId, setFacultyId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { faculty_id: facultyId, password });
            const token = response.data.token;

            if(response.status === 200)
            {
                localStorage.setItem('token', token);
                setAuth(true);
                setError(null);
            }
        } catch (err) {
            setAuth(false); 
            console.error(err)// Set auth to false if login fails
            setError('Invalid credentials');
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">Faculty Login</h2>
                <p className="text-center text-gray-500">Please log in to continue</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">👤</span>
                        <input
                            className="w-full px-10 py-3 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            value={facultyId}
                            onChange={(e) => setFacultyId(e.target.value)}
                            placeholder="Faculty ID"
                            required
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔒</span>
                        <input
                            className="w-full px-10 py-3 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        Login
                    </button>
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                </form>
            </div>
        </section>
    );
};

export default Login;

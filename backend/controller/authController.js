const { getUserByFacultyId } = require('../model/facultyModel');

const bcrypt = require('bcryptjs');


const login = (req, res) => {
    const { faculty_id, password } = req.body;

    getUserByFacultyId(faculty_id, (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error verifying password' });
            if (!result) return res.status(401).json({ error: 'Invalid credentials' });

            req.session.user = { id: user.id, faculty_id: user.faculty_id, name: user.name };
            res.status(200).json({ message: 'Login successful', user: req.session.user });
        });
    });
};


const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Failed to log out' });
        res.status(200).json({ message: 'Logout successful' });
    });
};

const checkAuth = (req, res) => {
    if (req.session.user) {
        res.status(200).json({ isAuthenticated: true, user: req.session.user });
    } else {
        res.status(401).json({ isAuthenticated: false });
    }
};

module.exports = { login, logout, checkAuth };

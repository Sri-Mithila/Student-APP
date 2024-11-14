const { getUserByFacultyId } = require('../model/facultyModel');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { faculty_id, password } = req.body;

    try {
        const user = await getUserByFacultyId(faculty_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = { id: user.id, faculty_id: user.faculty_id, name: user.name };

        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};

const checkAuth = (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ isAuthenticated: true, user: req.session.user });
    } else {
        return res.status(401).json({ isAuthenticated: false });
    }
};

module.exports = { login, logout, checkAuth };

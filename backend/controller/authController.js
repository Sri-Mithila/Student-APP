const { getUserByFacultyId } = require('../model/facultyModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

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
        const token = jwt.sign(
            { id: user.id, faculty_id: user.faculty_id, name: user.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

const checkAuth = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ isAuthenticated: false });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ isAuthenticated: false });
        }

        return res.status(200).json({
            isAuthenticated: true,
            user: { id: decoded.id, faculty_id: decoded.faculty_id, name: decoded.name }
        });
    });
};

const protectRoute = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        req.user = decoded; 
        next();
    });
};

module.exports = { login, logout, checkAuth, protectRoute };

const db = require('../config/db');

const getUserByFacultyId = async (facultyId) => {
    try {
        const [results] = await db.execute('SELECT * FROM Faculty WHERE faculty_id = ?', [facultyId]);
        return results[0];
    } catch (err) {
        console.error("Database query error:", err);
        throw err;
    }
};

module.exports = { getUserByFacultyId };

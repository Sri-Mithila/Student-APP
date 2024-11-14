const db = require('../config/db');

const getUserByFacultyId = (facultyId, callback) => {
    db.query('SELECT * FROM Faculty WHERE faculty_id = ?', [facultyId], (err, results) => {
        if (err) return callback(err);
        return callback(null, results[0]);
    });
};

module.exports = { getUserByFacultyId };

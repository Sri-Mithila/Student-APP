const mysql = require('mysql');
const dotenv = require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, 
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection error:', err);
        throw err;
    }
    if (connection) connection.release();
    console.log("Database Connected");
});

module.exports = db;

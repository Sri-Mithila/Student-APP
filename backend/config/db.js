const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function checkConnection() {
    try {
        const connection = await db.getConnection();
        console.log('Database Connected');
        connection.release();
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
}

checkConnection();

module.exports = db;

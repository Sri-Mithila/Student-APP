const { google } = require('googleapis');
const sheets = google.sheets('v4');
const db = require('../config/db'); 
const { authorize } = require('./oauthController');
const dotenv = require('dotenv').config();

const sheet_name = process.env.PERSONAL_DETAILS;

async function fetchRowsFromSheet(spreadsheetId, sheetName) {
    try {
        const auth = await authorize(); 
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `${sheetName}!A:Z`, 
        });

        const rows = response.data.values || [];
        return rows;
    } catch (error) {
        console.error('Error fetching rows from sheet:', error);
        throw new Error('Failed to fetch rows from sheet');
    }
}


async function getRollRangeForFaculty(faculty_id) {
    try {
        const query = 'SELECT roll_num_start, roll_num_end FROM tutor_details WHERE faculty_id = ?';
        const [result] = await db.execute(query, [faculty_id]);
        if (result.length === 0) {
            throw new Error('No roll number range found for this faculty ID');
        }
        return result[0];
    } catch (error) {
        console.error('Error fetching roll number range:', error);
        throw new Error('Failed to retrieve roll number range for faculty');
    }
}

async function fetchRollNumbers(req, res) {
    try {
        const { faculty_id, spreadsheet_id } = req.query;

        const rows = await fetchRowsFromSheet(spreadsheet_id, sheet_name);

        if (!Array.isArray(rows) || rows.length === 0) {
            throw new TypeError('Expected rows to be a non-empty array');
        }

        const { roll_num_start, roll_num_end } = await getRollRangeForFaculty(faculty_id);

        const filteredRows = rows.filter(row => {
            const rollNum = Number(row[1]);
            return rollNum >= roll_num_start && rollNum <= roll_num_end;
        });

        const rollNumbers = filteredRows.map(row => row[1]); 
        
        res.json({ success: true, rollNumbers });
    } catch (error) {
        console.error('Error fetching roll numbers:', error);
        res.status(500).json({ error: 'Error fetching roll numbers', details: error.message });
    }
}

module.exports = { fetchRollNumbers };

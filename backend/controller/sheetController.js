const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { authorize } = require('./oauthController');

async function insertData(req, res) {
    const { spreadsheetId, sheetName, data } = req.body;

    try {
        const auth = await authorize();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A2`,
            valueInputOption: 'USER_ENTERED',
            resource: { values: [data] }
        });

        res.status(200).json({ success: true, response });
    } catch (error) {
        res.status(500).json({ error: 'Error inserting data', details: error });
    }
}

async function getData(req, res) {
    const { spreadsheetId, sheetName, rollNumber } = req.body;

    try {
        const auth = await authorize();
        const sheets = google.sheets({ version: 'v4', auth });

        const result = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:Z` // Adjust range if columns exceed "Z"
        });

        const rows = result.data.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'No data found in the sheet' });
        }

        // Locate the row with the matching roll number in the second column (index 1)
        const dataRow = rows.find(row => row[1] === rollNumber);

        if (!dataRow) {
            return res.status(404).json({ error: `No data found for roll number: ${rollNumber}` });
        }

        // Get header row for JSON key mapping
        const headers = rows[0];
        const rowData = headers.reduce((obj, header, index) => {
            obj[header] = dataRow[index];
            return obj;
        }, {});

        res.status(200).json({ success: true, data: rowData });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving row data', details: error });
    }
}
module.exports = {insertData, getData};
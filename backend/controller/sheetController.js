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
        console.log(error)
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
            range: `${sheetName}!A:ZZ` 
        });

        const rows = result.data.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'No data found in the sheet' });
        }

        
        const dataRow = rows.find(row => row[1] === rollNumber);

        if (!dataRow) {
            return res.status(404).json({ error: `No data found for roll number: ${rollNumber}` });
        }

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


async function updateData(req, res) {
    const { spreadsheetId, sheetName, rollNumber, newData } = req.body;

    try {
        const auth = await authorize();
        const sheets = google.sheets({ version: 'v4', auth });

        const result = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:ZZ`
        });

        const rows = result.data.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'No data found in the sheet' });
        }

        const rowIndex = rows.findIndex(row => row[1] === rollNumber);
        if (rowIndex === -1) {
            return res.status(404).json({ error: `No data found for roll number: ${rollNumber}` });
        }

        const headers = rows[0];
        const updatedRow = headers.map(header => newData[header] || rows[rowIndex][headers.indexOf(header)]);

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            resource: { values: [updatedRow] }
        });

        res.status(200).json({ success: true, message: `Row updated for roll number: ${rollNumber}` });
    } catch (error) {
        res.status(500).json({ error: 'Error updating row data', details: error });
    }
}

async function deleteData(req, res) {
    const { spreadsheetId, sheetName, rollNumber } = req.body;

    try {
        const auth = await authorize();
        const sheets = google.sheets({ version: 'v4', auth });

        const rowsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:Z`
        });

        const rows = rowsResponse.data.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'No data found in the sheet' });
        }

        const rowIndex = rows.findIndex(row => row[1] === rollNumber);
        if (rowIndex === -1) {
            return res.status(404).json({ error: `No data found for roll number: ${rollNumber}` });
        }

        const sheetInfo = await sheets.spreadsheets.get({
            spreadsheetId,
            ranges: [sheetName],
            includeGridData: false
        });

        const sheet = sheetInfo.data.sheets.find(s => s.properties.title === sheetName);
        if (!sheet) {
            return res.status(404).json({ error: `Sheet not found: ${sheetName}` });
        }

        const sheetId = sheet.properties.sheetId;

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: 'ROWS',
                            startIndex: rowIndex,
                            endIndex: rowIndex + 1
                        }
                    }
                }]
            }
        });

        res.status(200).json({ success: true, message: `Row deleted for roll number: ${rollNumber}` });
    } catch (error) {
        console.error('Error deleting row data:', error);
        res.status(500).json({ error: 'Error deleting row data', details: error });
    }
}


module.exports = {insertData, getData, updateData, deleteData};
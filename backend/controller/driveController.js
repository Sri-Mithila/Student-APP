const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { authorize } = require('./oauthController');
const dotenv = require('dotenv').config();

const createFolderStructure = async (req, res) => {
    const { year, batch, dept } = req.body;
    const auth = await authorize();
    const drive = google.drive({ version: 'v3', auth });

    try {
        const academicYearFolderId = await findOrCreateFolder(drive, year, process.env.STUDENT_FOLDER_ID);
        const batchDeptFolderId = await findOrCreateFolder(drive, `${batch} ${dept}`, academicYearFolderId);

        res.status(200).json({ success: true, academicYearFolderId, batchDeptFolderId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating folder structure', details: error });
    }
};

const createSpreadsheet = async (req, res) => {
    const { batch, dept, folderId } = req.body;
    const auth = await authorize();
    const sheetsApi = google.sheets({ version: 'v4', auth });
    const sheetData = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/header.json')));

    try {
        const spreadsheet = await sheetsApi.spreadsheets.create({
            resource: {
                properties: { title: `${batch} ${dept} Spreadsheet` },
                sheets: sheetData.sheets.map(sheet => ({
                    properties: { title: sheet.name },
                    data: [{ rowData: [{ values: sheet.headers.map(header => ({ userEnteredValue: { stringValue: header } })) }] }],
                })),
            },
            fields: 'spreadsheetId',
        });
        const spreadsheetId = spreadsheet.data.spreadsheetId;

        // Move spreadsheet to the specified folder
        const drive = google.drive({ version: 'v3', auth });
        await drive.files.update({
            fileId: spreadsheetId,
            addParents: folderId,
            removeParents: 'root',
        });

        res.status(200).json({ success: true, spreadsheetId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating spreadsheet', details: err });
    }
};

async function findOrCreateFolder(drive, folderName, parentId) {
    const response = await drive.files.list({
        q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
    });
    if (response.data.files.length > 0) {
        return response.data.files[0].id;
    } else {
        const folder = await drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentId],
            },
            fields: 'id',
        });
        return folder.data.id;
    }
}

module.exports = { createFolderStructure, createSpreadsheet };

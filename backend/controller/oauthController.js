const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
];
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

async function authorize() {
    const { client_secret, client_id, redirect_uris } = JSON.parse(fs.readFileSync(CREDENTIALS_PATH)).web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
        console.log('No token found. Initiate OAuth authorization.');
    }

    return oAuth2Client;
}


async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    const { code } = await promptUserForCode();  // This step may vary depending on your implementation

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(path.join(__dirname, 'token.json'), JSON.stringify(tokens));
        console.log('Token stored successfully');
        return oAuth2Client;
    } catch (err) {
        console.error('Error retrieving access token:', err.message);  // Enhanced logging for debugging
    }
}


const googleAuth = async (req, res) => {
    const authUrl = await getAccessToken(await authorize());
    res.redirect(authUrl); // Redirect to Google login
};

module.exports = { authorize, googleAuth };
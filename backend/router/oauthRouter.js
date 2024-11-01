const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { authorize } = require('../controller/oauthController');  // Assuming this is where authorize function is defined

const router = express.Router();

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
];
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

// Redirects to Google's OAuth 2.0 server
router.get('/google', async (req, res) => {
    const authUrl = await getAuthUrl();
    res.redirect(authUrl);  // Redirect user to Google login
});

// Handles the callback from Google after user consents
router.get('/google/callback', async (req, res) => {
    const code = req.query.code; // Get authorization code from query params
    
    try {
        const { client_secret, client_id, redirect_uris } = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/credentials.json'))).web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        // Exchange authorization code for access token
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Save the token to a file for later use
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('Token stored to', TOKEN_PATH);

        res.status(200).json({ success: true, message: 'OAuth2 authentication successful' });
    } catch (error) {
        console.error('Error during OAuth callback:', error);
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }
});

async function getAuthUrl() {
    const { client_secret, client_id, redirect_uris } = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/credentials.json'))).web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
}

module.exports = router;

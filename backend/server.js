// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./router/authRouter');
const oauthRoutes = require('./router/oauthRouter');
const driveRouter = require('./router/driveRouter');
const sheetRouter = require('./router/sheetRouter');  
const getPDFRouter = require('./router/getPDFRouter');  
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 60 * 1000 },
}));

app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/drive', driveRouter);
app.use('/sheet', sheetRouter); 
app.use('/pdf',getPDFRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

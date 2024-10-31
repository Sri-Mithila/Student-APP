const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./router/authRouter');
// const folderRouter = require('./router/folderRouter')
const dotenv = require('dotenv').config();
const cors = require('cors') 

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true 
}));
app.use(session({
    secret: 'Th15I570pS3cr3t', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 5 * 60 * 60 * 1000 // 5 hours in milliseconds
    }
}));
app.use('/api/auth', authRoutes); 
// app.use('/api/folders', folderRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

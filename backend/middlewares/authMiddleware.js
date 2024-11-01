const fs = require('fs');
const path = require('path');

const isOAuthAuthenticated = (req, res, next) => {
   const tokenPath = path.join(__dirname, '../config/token.json');
   if (fs.existsSync(tokenPath))
   {
       return next();
   }
   res.status(401).json({ error: 'User not authenticated with Google' });
};

module.exports = { isOAuthAuthenticated };

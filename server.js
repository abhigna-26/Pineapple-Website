require('dotenv').config();
const express = require('express');
const path = require('path');
const contactApi = require('./api/contact');

const app = express();
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Use the Vercel serverless function logic for the API endpoint
app.post('/api/contact', contactApi);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Local development server listening on http://localhost:${port}`);
});

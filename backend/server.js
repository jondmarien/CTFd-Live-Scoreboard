const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1337;

// Middleware
app.use(express.json());

// Enable CORS for all requests
app.use(cors());

// Proxy endpoint for scoreboard
app.get('/proxy/scoreboard', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_BASE}/scoreboard`, {
            headers: { Authorization: `Token ${process.env.API_TOKEN}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching scoreboard:', error.message);
        res.status(500).send('Proxy error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});

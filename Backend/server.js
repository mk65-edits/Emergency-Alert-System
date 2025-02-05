require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: 'https://bright-tiramisu-cbcf15.netlify.app/', // Replace with your frontend URL
    methods: ['GET', 'POST'], // Allow only GET and POST requests
}));

// Store last 10 alerts in memory
let alertLogs = [];

// Root route
app.get('/', (req, res) => {
    res.send('Emergency Alert System Backend is running!');
});

// Alert endpoint
app.post('/alert', (req, res) => {
    const { ip, city, region, latitude, longitude } = req.body;

    if (!ip || !city || !region || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const alertData = {
        timestamp: new Date().toISOString(),
        ip,
        city,
        region,
        latitude,
        longitude
    };

    // Log the alert in the terminal
    console.log("\n[Emergency Alert Received]\n", alertData);

    // Store the alert in memory (keep last 10 alerts only)
    alertLogs.unshift(alertData);
    if (alertLogs.length > 10) alertLogs.pop();

    res.json({ message: 'Emergency alert received!' });
});

// Logs endpoint
app.get('/logs', (req, res) => {
    res.json(alertLogs);
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}. Listening for alerts...`));
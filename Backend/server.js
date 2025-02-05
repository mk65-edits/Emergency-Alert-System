require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Store last 10 alerts in memory
let alertLogs = [];

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

// Endpoint to fetch latest alerts
app.get('/logs', (req, res) => {
    res.json(alertLogs);
});

app.listen(3000, () => console.log('Server running on port 3000. Listening for alerts...'));
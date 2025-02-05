function sendAlert() {
    fetch('https://ipinfo.io/json')
        .then(response => response.json())
        .then(ipData => {
            if (!ipData.ip || !ipData.city || !ipData.region) {
                throw new Error('Failed to retrieve IP data');
            }
            
            navigator.geolocation.getCurrentPosition(position => {
                const alertData = {
                    ip: ipData.ip,
                    city: ipData.city,
                    region: ipData.region,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                fetch('https://emergency-alert-system-production.up.railway.app/alert', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(alertData)
                })
                .then(res => res.json())
                .then(data => alert(data.message))
                .catch(error => console.error('Error:', error));
            }, error => {
                console.error('Geolocation error:', error);
            });
        })
        .catch(error => console.error('IP fetch error:', error));
}

// Fetch recent logs every 5 seconds
function fetchLogs() {
    fetch('https://emergency-alert-system-production.up.railway.app/logs')
        .then(response => response.json())
        .then(data => {
            document.getElementById('logs').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error('Error fetching logs:', error));
}
setInterval(fetchLogs, 5000);
fetchLogs();
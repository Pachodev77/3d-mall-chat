const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Set MIME types
const mimeTypes = {
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// Serve static files with proper MIME types
app.use(express.static(__dirname));

// Explicit route for joystick.js to ensure it's served correctly
app.get('/public/joystick.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'joystick.js'), {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
});

// Serve firebase-config.js with correct MIME type
app.get('/firebase-config.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'firebase-config.js'), {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
});

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'), {
        headers: {
            'Content-Type': 'text/html'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Directorio actual: ${__dirname}`);
});

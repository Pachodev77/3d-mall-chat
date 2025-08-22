// Servidor básico con Express para servir archivos estáticos
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Servir el archivo index.html desde la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para manejar la carga de joystick.js
app.get('/public/joystick.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'joystick.js'), {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Ruta de joystick.js: ${path.join(__dirname, 'public', 'joystick.js')}`);
});

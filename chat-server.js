const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Crear servidor HTTP
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Log all requests to help debug 404 errors
    console.log(`Request: ${req.url} -> ${filePath}`);

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                console.log(`404 Not Found: ${filePath}`);
                res.writeHead(404);
                res.end('File not found');
            } else {
                console.log(`500 Server Error: ${filePath} - ${error.code}`);
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            console.log(`200 OK: ${filePath}`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Crear servidor WebSocket
const wss = new WebSocket.Server({ server });

// Almacenar usuarios conectados con sus posiciones
const connectedUsers = new Map(); // ws -> { alias, position, floor }

// Función para enviar posiciones de todos los usuarios a un cliente específico
function sendUserPositions(client) {
    const userPositions = [];
    connectedUsers.forEach((userData, ws) => {
        if (ws !== client && ws.readyState === WebSocket.OPEN) {
            userPositions.push({
                alias: userData.alias,
                position: userData.position,
                floor: userData.floor,
                rotation: userData.rotation || 0
            });
        }
    });
    
    if (userPositions.length > 0) {
        client.send(JSON.stringify({
            type: 'userPositions',
            positions: userPositions
        }));
    }
}

// Función para enviar la posición de un usuario a todos los demás
function broadcastUserPosition(alias, position, floor, rotation = 0, excludeClient = null) {
    const positionMessage = {
        type: 'userPosition',
        alias: alias,
        position: position,
        floor: floor,
        rotation: rotation
    };
    
    wss.clients.forEach((client) => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(positionMessage));
        }
    });
}

wss.on('connection', (ws) => {
    console.log('Nuevo usuario conectado');
    
    // Enviar mensaje de bienvenida
    ws.send(JSON.stringify({
        type: 'system',
        message: '¡Bienvenido al chat! Escribe tu alias para comenzar.'
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'alias':
                    // Usuario establece su alias
                    const alias = data.alias.trim();
                    if (alias.length > 0 && alias.length <= 18) {
                        // Posición inicial aleatoria
                        const initialPosition = {
                            x: 25 + (Math.random() - 0.5) * 20,
                            y: 1.6,
                            z: 25 + (Math.random() - 0.5) * 20
                        };
                        
                        connectedUsers.set(ws, {
                            alias: alias,
                            position: initialPosition,
                            floor: 0
                        });
                        
                        // Notificar a todos los usuarios
                        const userList = Array.from(connectedUsers.values()).map(u => u.alias);
                        const broadcastMessage = {
                            type: 'userJoined',
                            alias: alias,
                            userCount: connectedUsers.size,
                            users: userList
                        };
                        
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(broadcastMessage));
                            }
                        });
                        
                        // Enviar posiciones de usuarios existentes al nuevo usuario
                        sendUserPositions(ws);
                        
                        // Enviar posición del nuevo usuario a todos
                        broadcastUserPosition(alias, initialPosition, 0, 0, ws);
                        
                        console.log(`Usuario ${alias} se unió al chat`);
                    }
                    break;
                    
                case 'message':
                    // Usuario envía un mensaje
                    const userData = connectedUsers.get(ws);
                    if (userData && data.message.trim().length > 0) {
                        const chatMessage = {
                            type: 'message',
                            alias: userData.alias,
                            message: data.message.trim(),
                            timestamp: new Date().toLocaleTimeString()
                        };
                        
                        // Enviar mensaje a todos los usuarios
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(chatMessage));
                            }
                        });
                        
                        console.log(`${userData.alias}: ${data.message}`);
                    }
                    break;
                    
                case 'position':
                    // Usuario actualiza su posición
                    const user = connectedUsers.get(ws);
                    if (user && data.position && data.floor !== undefined) {
                        user.position = data.position;
                        user.floor = data.floor;
                        user.rotation = data.rotation || 0;
                        
                        // Enviar nueva posición a todos los demás usuarios
                        broadcastUserPosition(user.alias, data.position, data.floor, data.rotation || 0, ws);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error procesando mensaje:', error);
        }
    });

    ws.on('close', () => {
        const userData = connectedUsers.get(ws);
        if (userData) {
            const alias = userData.alias;
            connectedUsers.delete(ws);
            
            // Notificar a todos los usuarios
            const userList = Array.from(connectedUsers.values()).map(u => u.alias);
            const broadcastMessage = {
                type: 'userLeft',
                alias: alias,
                userCount: connectedUsers.size,
                users: userList
            };
            
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(broadcastMessage));
                }
            });
            
            console.log(`Usuario ${alias} se desconectó`);
        }
    });
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Servidor HTTP y WebSocket corriendo en http://localhost:${PORT}/`);
    console.log('WebSocket disponible en ws://localhost:8000');
}); 
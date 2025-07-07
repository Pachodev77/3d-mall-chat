// Configuración de Firebase para reemplazar el servidor WebSocket
// Configuración real del proyecto ccapp-b8301

const firebaseConfig = {
  apiKey: "AIzaSyDjPYZJeoLgisI3KZyA6_0OwmH_UESGR14",
  authDomain: "ccapp-b8301.firebaseapp.com",
  projectId: "ccapp-b8301",
  storageBucket: "ccapp-b8301.firebasestorage.app",
  messagingSenderId: "622692105172",
  appId: "1:622692105172:web:dceecda5e2a54630d4b441",
  measurementId: "G-5DW5PB2RB6"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias a la base de datos
const db = firebase.database();
const usersRef = db.ref('users');
const messagesRef = db.ref('messages');
const positionsRef = db.ref('positions');

// Variables globales
let currentUser = null;
let isConnected = false;

// Función para conectar al chat
function connectToChat(alias) {
    if (!alias || alias.trim().length === 0) {
        alert('Por favor ingresa un alias válido');
        return;
    }
    
    currentUser = {
        alias: alias.trim(),
        position: { x: 25, y: 1.6, z: 25 },
        floor: 0,
        rotation: 0,
        timestamp: Date.now()
    };
    
    // Guardar usuario en Firebase
    usersRef.child(currentUser.alias).set(currentUser);
    
    // Escuchar cambios en usuarios
    usersRef.on('value', (snapshot) => {
        const users = snapshot.val() || {};
        updateUsersList(Object.values(users));
    });
    
    // Escuchar mensajes
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        if (message.alias !== currentUser.alias) {
            addMessageToChat(message.alias, message.message, 'user');
        }
    });
    
    // Escuchar posiciones
    positionsRef.on('value', (snapshot) => {
        const positions = snapshot.val() || {};
        Object.keys(positions).forEach(alias => {
            if (alias !== currentUser.alias) {
                const userData = positions[alias];
                updateAvatarPosition(alias, userData.position, userData.floor, userData.rotation);
            }
        });
    });
    
    isConnected = true;
    console.log('Conectado al chat como:', currentUser.alias);
}

// Función para enviar mensaje
function sendMessage(message) {
    if (!isConnected || !currentUser) return;
    
    const messageData = {
        alias: currentUser.alias,
        message: message,
        timestamp: Date.now()
    };
    
    messagesRef.push(messageData);
    addMessageToChat(currentUser.alias, message, 'own');
}

// Función para enviar posición
function sendPosition(position, floor, rotation) {
    if (!isConnected || !currentUser) return;
    
    const positionData = {
        position: position,
        floor: floor,
        rotation: rotation,
        timestamp: Date.now()
    };
    
    positionsRef.child(currentUser.alias).set(positionData);
}

// Función para desconectar
function disconnectFromChat() {
    if (currentUser) {
        usersRef.child(currentUser.alias).remove();
        positionsRef.child(currentUser.alias).remove();
        currentUser = null;
    }
    isConnected = false;
}

// Función para actualizar lista de usuarios
function updateUsersList(users) {
    const usersList = document.getElementById('users-list');
    if (usersList) {
        usersList.innerHTML = '';
        users.forEach(user => {
            if (user.alias !== currentUser?.alias) {
                const userElement = document.createElement('div');
                userElement.className = 'user-item';
                userElement.textContent = user.alias;
                usersList.appendChild(userElement);
            }
        });
    }
}

// Función para limpiar mensajes antiguos (mantener solo los últimos 100)
function cleanupOldMessages() {
    messagesRef.once('value', (snapshot) => {
        const messages = snapshot.val();
        if (messages) {
            const messageKeys = Object.keys(messages);
            if (messageKeys.length > 100) {
                const keysToDelete = messageKeys.slice(0, messageKeys.length - 100);
                keysToDelete.forEach(key => {
                    messagesRef.child(key).remove();
                });
            }
        }
    });
}

// Limpiar mensajes antiguos cada 5 minutos
setInterval(cleanupOldMessages, 5 * 60 * 1000);

// Limpiar usuarios desconectados (más de 30 segundos sin actividad)
function cleanupDisconnectedUsers() {
    const now = Date.now();
    usersRef.once('value', (snapshot) => {
        const users = snapshot.val();
        if (users) {
            Object.keys(users).forEach(alias => {
                const user = users[alias];
                if (now - user.timestamp > 30000) { // 30 segundos
                    usersRef.child(alias).remove();
                    positionsRef.child(alias).remove();
                }
            });
        }
    });
}

// Limpiar usuarios desconectados cada 10 segundos
setInterval(cleanupDisconnectedUsers, 10000); 
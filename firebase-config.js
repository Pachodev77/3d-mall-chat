// Firebase config for ccapp-b8301
const firebaseConfig = {
  apiKey: "AIzaSyDjPYZJeoLgisI3KZyA6_0OwmH_UESGR14",
  authDomain: "ccapp-b8301.firebaseapp.com",
  projectId: "ccapp-b8301",
  storageBucket: "ccapp-b8301.firebasestorage.app",
  messagingSenderId: "622692105172",
  appId: "1:622692105172:web:dceecda5e2a54630d4b441",
  measurementId: "G-5DW5PB2RB6"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const usersRef = db.ref('users');
const messagesRef = db.ref('messages');
const positionsRef = db.ref('positions');

let currentUser = null;
let isConnected = false;
let messagesListenerSet = false;

function connectToChat(alias) {
    if (!alias || alias.trim().length === 0) {
        alert('Please enter a valid alias');
        return;
    }
    currentUser = {
        alias: alias.trim(),
        position: { x: 25, y: 1.6, z: 25 },
        floor: 0,
        rotation: 0,
        timestamp: Date.now()
    };
    usersRef.child(currentUser.alias).set(currentUser);
// Eliminar posición al desconectarse
positionsRef.child(currentUser.alias).onDisconnect().remove();
    usersRef.on('value', (snapshot) => {
        const users = snapshot.val() || {};
        updateUsersList(Object.values(users));
    });
    // Cargar historial de los últimos 10 mensajes al conectar
    messagesRef.limitToLast(10).once('value', (snapshot) => {
        snapshot.forEach((child) => {
            const message = child.val();
            if (typeof window.addMessageToChat === 'function') {
                window.addMessageToChat(
                    message.alias,
                    message.message,
                    message.alias === currentUser.alias ? 'own' : 'user',
                    message.timestamp,
                    false,
                    null
                );
            }
        });
    });
    // SOLO REGISTRAR UNA VEZ EL LISTENER DE MENSAJES
    if (!messagesListenerSet) {
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        if (message.alias !== currentUser.alias) {
            if (typeof window.addMessageToChat === 'function') {
                window.addMessageToChat(message.alias, message.message, 'user', message.timestamp, false, null);
            }
        }
    });
        messagesListenerSet = true;
    }
    // Cargar usuarios existentes al conectar (solo una vez)
    positionsRef.once('value', (snapshot) => {
        const positions = snapshot.val() || {};
        Object.entries(positions).forEach(([alias, userData]) => {
            if (userData && isValidPositionData(userData)) {
                console.log('[Firebase] Cargando usuario existente:', alias);
                updateAvatarPosition(
                    alias, 
                    userData.position, 
                    userData.floor, 
                    userData.rotation,
                    userData.shirtColor,
                    userData.pantsColor,
                    userData.shoesColor,
                    userData.skin
                );
            }
        });
    });
    
    // Listener para nuevos usuarios que se conectan
    positionsRef.on('child_added', (snapshot) => {
        const alias = snapshot.key;
        const userData = snapshot.val();
        
        if (userData && isValidPositionData(userData)) {
            console.log('[Firebase] Nuevo usuario conectado:', alias);
            updateAvatarPosition(
                alias, 
                userData.position, 
                userData.floor, 
                userData.rotation,
                userData.shirtColor,
                userData.pantsColor,
                userData.shoesColor,
                userData.skin
            );
        }
    });
    
    // Listener para actualizaciones de posición
    positionsRef.on('child_changed', (snapshot) => {
        const alias = snapshot.key;
        const userData = snapshot.val();
        
        if (userData && isValidPositionData(userData)) {
            console.log('[Firebase] Posición actualizada:', alias);
            updateAvatarPosition(
                alias, 
                userData.position, 
                userData.floor, 
                userData.rotation,
                userData.shirtColor,
                userData.pantsColor,
                userData.shoesColor,
                userData.skin
            );
        }
    });
    
    // Listener para usuarios que se desconectan
    positionsRef.on('child_removed', (snapshot) => {
        const alias = snapshot.key;
        
        if (alias !== currentUser.alias) {
            console.log('[Firebase] Usuario desconectado:', alias);
            if (typeof window.removeUserAvatar === 'function') {
                window.removeUserAvatar(alias);
            }
        }
    });
    
    // Función auxiliar para validar datos de posición
    function isValidPositionData(data) {
        return data &&
               typeof data === 'object' &&
               data.position && 
               typeof data.position.x === 'number' && 
               typeof data.position.y === 'number' && 
               typeof data.position.z === 'number' &&
               typeof data.floor === 'number';
    }
    isConnected = true;
    console.log('Connected as:', currentUser.alias);
}

function sendMessage(message) {
    if (!isConnected || !currentUser) return;
    const messageData = {
        alias: currentUser.alias,
        message: message,
        timestamp: Date.now()
    };
    messagesRef.push(messageData);
    // Mostrar el mensaje propio inmediatamente
    if (typeof window.addMessageToChat === 'function') {
        window.addMessageToChat(currentUser.alias, message, 'own', messageData.timestamp, false, null);
    }
}

function sendAlias() {
    if (!isConnected || !currentUser) return;
    
    // Actualizar el alias en Firebase
    usersRef.child(currentUser.alias).update({
        alias: currentUser.alias,
        timestamp: Date.now()
    });
    
    console.log('Alias enviado a Firebase:', currentUser.alias);
}

function sendPosition(position, floor, rotation) {
    if (!isConnected || !currentUser) return;
    // Obtener colores actuales del avatar
    let shirtColor = 0x4ECDC4, pantsColor = 0x2C3E50, shoesColor = 0x8B4513;
    let skin = 'humanMaleA';
    if (typeof window.currentCustomization === 'object') {
        shirtColor = window.currentCustomization.shirtColor || shirtColor;
        pantsColor = window.currentCustomization.pantsColor || pantsColor;
        shoesColor = window.currentCustomization.shoesColor || shoesColor;
        skin = window.currentCustomization.skin || skin;
    } else if (typeof window.shirtColor !== 'undefined') {
        shirtColor = window.shirtColor;
        pantsColor = window.pantsColor;
        shoesColor = window.shoesColor;
    }
    const positionData = {
        position: position,
        floor: floor,
        rotation: rotation,
        shirtColor: shirtColor,
        pantsColor: pantsColor,
        shoesColor: shoesColor,
        skin: skin,
        timestamp: Date.now()
    };
    positionsRef.child(currentUser.alias).set(positionData);
}

function disconnectFromChat() {
    if (currentUser) {
        usersRef.child(currentUser.alias).remove();
        positionsRef.child(currentUser.alias).remove();
        currentUser = null;
    }
    isConnected = false;
    
    // Limpiar listeners específicos para evitar memory leaks
    positionsRef.off('child_added');
    positionsRef.off('child_changed');
    positionsRef.off('child_removed');
}

function updateUsersList(users) {
    const usersList = document.getElementById('users-list');
    if (usersList) {
        usersList.innerHTML = '';
        users.forEach(user => {
                const userElement = document.createElement('div');
            userElement.className = 'user-item' + (user.alias === currentUser?.alias ? ' own' : '');
            userElement.textContent = user.alias + (user.alias === currentUser?.alias ? ' (Tú)' : '');
                usersList.appendChild(userElement);
        });
    }
}

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
setInterval(cleanupOldMessages, 5 * 60 * 1000);

function cleanupDisconnectedUsers() {
    const now = Date.now();
    usersRef.once('value', (snapshot) => {
        const users = snapshot.val();
        if (users) {
            Object.keys(users).forEach(alias => {
                const user = users[alias];
                if (now - user.timestamp > 30000) {
                    usersRef.child(alias).remove();
                    positionsRef.child(alias).remove();
                }
            });
        }
    });
}
setInterval(cleanupDisconnectedUsers, 10000); 

function getPrivateChatId(aliasA, aliasB) {
    return [aliasA, aliasB].sort().join('_');
}

function sendPrivateMessage(toAlias, message) {
    if (!isConnected || !currentUser) return;
    const chatId = getPrivateChatId(currentUser.alias, toAlias);
    const privateRef = db.ref('privateMessages').child(chatId);
    const messageData = {
        from: currentUser.alias,
        to: toAlias,
        message: message,
        timestamp: Date.now()
    };
    privateRef.push(messageData);
}

function listenToPrivateMessages() {
    if (!currentUser) return;
    const privateRef = db.ref('privateMessages');
    privateRef.on('child_added', (snapshot) => {
        const chatId = snapshot.key;
        // Escuchar solo los chats donde participa el usuario actual
        if (chatId.includes(currentUser.alias)) {
            privateRef.child(chatId).on('child_added', (msgSnap) => {
                const msg = msgSnap.val();
                // Solo mostrar si el mensaje es para el usuario actual o lo envió el usuario actual
                if (msg.to === currentUser.alias || msg.from === currentUser.alias) {
                    // Llama a la función global si existe
                    if (typeof window.addMessageToChat === 'function') {
                        window.addMessageToChat(msg.from, msg.message, msg.from === currentUser.alias ? 'own' : 'user', msg.timestamp, true, msg.to);
                    }
                }
            });
        }
    });
}

window.connectToChat = connectToChat;
window.sendMessage = sendMessage;
window.sendAlias = sendAlias;
window.sendPosition = sendPosition;
window.disconnectFromChat = disconnectFromChat;
window.updateUsersList = updateUsersList;
window.sendPrivateMessage = sendPrivateMessage;
window.listenToPrivateMessages = listenToPrivateMessages;

// Mantener actualizado el timestamp del usuario conectado
setInterval(() => {
    if (isConnected && currentUser) {
        usersRef.child(currentUser.alias).update({ timestamp: Date.now() });
    }
}, 10000); 
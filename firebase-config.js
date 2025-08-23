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

// Variables para el throttle de posición
if (typeof window.lastPositionUpdate === 'undefined') {
    window.lastPositionUpdate = 0;
}
const POSITION_UPDATE_INTERVAL = 100; // 100ms entre actualizaciones

// Variables para mantener referencias a los listeners
let usersListener = null;
let messagesListener = null;
let positionsListener = null;
let positionsChildAddedListener = null;
let positionsChildChangedListener = null;
let positionsChildRemovedListener = null;

function connectToChat(alias) {
    if (!alias || alias.trim().length === 0) {
        alert('Please enter a valid alias');
        return;
    }
    
    // Limpiar listeners anteriores si existen
    if (usersListener) usersRef.off('value', usersListener);
    if (messagesListener) messagesRef.off('child_added', messagesListener);
    if (positionsChildAddedListener) positionsRef.off('child_added', positionsChildAddedListener);
    if (positionsChildChangedListener) positionsRef.off('child_changed', positionsChildChangedListener);
    if (positionsChildRemovedListener) positionsRef.off('child_removed', positionsChildRemovedListener);
    
    currentUser = {
        alias: alias.trim(),
        position: { x: 25, y: 1.6, z: 25 },
        floor: 0,
        rotation: 0,
        timestamp: Date.now()
    };
    
    // Configurar desconexión
    usersRef.child(currentUser.alias).set(currentUser);
    positionsRef.child(currentUser.alias).onDisconnect().remove();
    
    // Configurar listeners
    usersListener = (snapshot) => {
        const users = snapshot.val() || {};
        updateUsersList(Object.values(users));
    };
    usersRef.on('value', usersListener);
    // Cargar mensajes iniciales
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

    // Configurar listener de mensajes
    messagesListener = (snapshot) => {
        const message = snapshot.val();
        if (!message) return;
        
        const messageId = snapshot.key;
        if (!window.processedMessages) window.processedMessages = new Set();
        
        // Verificar si el mensaje ya fue procesado
        if (window.processedMessages.has(messageId)) return;
        
        // Marcar como procesado antes de mostrarlo
        window.processedMessages.add(messageId);
        
        // Limitar el tamaño del conjunto para evitar consumo excesivo de memoria
        if (window.processedMessages.size > 1000) {
            const first = window.processedMessages.values().next().value;
            if (first) window.processedMessages.delete(first);
        }
        
        // Solo procesar si el mensaje es de otro usuario
        if (message.alias !== currentUser.alias && typeof window.addMessageToChat === 'function') {
            window.addMessageToChat(message.alias, message.message, 'user', message.timestamp, false, null);
        }
    };
    messagesRef.on('child_added', messagesListener);
    messagesListenerSet = true;
    // Cargar posiciones iniciales
    positionsRef.once('value', async (snapshot) => {
        const positions = snapshot.val() || {};
        const updates = [];
        
        for (const [alias, userData] of Object.entries(positions)) {
            if (alias !== currentUser.alias && userData && isValidPositionData(userData)) {
                console.log('[Firebase] Loading existing user:', alias);
                updates.push(
                    updateAvatarPosition(
                        alias,
                        userData.position,
                        userData.floor,
                        userData.rotation,
                        userData.skin
                    )
                );
            }
        }
        
        // Procesar actualizaciones en paralelo
        await Promise.all(updates);
    });

    // Configurar listeners de posición
    positionsChildAddedListener = async (snapshot) => {
        const alias = snapshot.key;
        const userData = snapshot.val();
        
        if (alias !== currentUser.alias && userData && isValidPositionData(userData)) {
            console.log('[Firebase] New user connected:', alias);
            await updateAvatarPosition(
                alias,
                userData.position,
                userData.floor,
                userData.rotation,
                userData.skin
            );
        }
    };

    positionsChildChangedListener = async (snapshot) => {
        const alias = snapshot.key;
        const userData = snapshot.val();
        
        if (alias !== currentUser.alias && userData && isValidPositionData(userData)) {
            console.log('[Firebase] Position updated:', alias);
            await updateAvatarPosition(
                alias,
                userData.position,
                userData.floor,
                userData.rotation,
                userData.skin
            );
        }
    };

    positionsChildRemovedListener = (snapshot) => {
        const alias = snapshot.key;
        if (alias !== currentUser.alias) {
            console.log('[Firebase] User disconnected:', alias);
            if (typeof window.removeUserAvatar === 'function') {
                window.removeUserAvatar(alias);
            }
        }
    };

    // Asignar listeners
    positionsRef.on('child_added', positionsChildAddedListener);
    positionsRef.on('child_changed', positionsChildChangedListener);
    positionsRef.on('child_removed', positionsChildRemovedListener);
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
    if (!isConnected || !currentUser || !message.trim()) return;
    
    // Initialize processed messages set if it doesn't exist
    if (!window.processedMessages) window.processedMessages = new Set();
    
    const messageData = {
        alias: currentUser.alias,
        message: message.trim(),
        timestamp: Date.now()
    };
    
    // Generate a temporary ID for the message
    const tempMsgId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add to processed messages to prevent duplicates
    window.processedMessages.add(tempMsgId);
    
    // First, immediately show the message in the sender's chat
    if (typeof window.addMessageToChat === 'function') {
        window.addMessageToChat(currentUser.alias, messageData.message, 'own', messageData.timestamp, false, null);
    }
    
    // Then push to Firebase
    const newMessageRef = messagesRef.push();
    newMessageRef.set(messageData);
    
    // Add the actual message ID to processed messages when it's available
    newMessageRef.then(() => {
        if (newMessageRef.key) {
            window.processedMessages.add(newMessageRef.key);
            // Remove the temporary ID
            window.processedMessages.delete(tempMsgId);
        }
    });
    
    return newMessageRef.key;
}

function sendPosition(position, floor, rotation) {
    if (!isConnected || !currentUser) return;
    
    // Aplicar throttle
    const now = Date.now();
    if (now - window.lastPositionUpdate < POSITION_UPDATE_INTERVAL) {
        return;
    }
    window.lastPositionUpdate = now;
    
    let skin = 'humanMaleA'; // Default skin
    if (typeof window.currentCustomization === 'object' && window.currentCustomization.skin) {
        skin = window.currentCustomization.skin;
    }

    const positionData = {
        position: position,
        floor: floor,
        rotation: rotation,
        skin: skin,
        timestamp: now
    };
    
    // Usar set con prioridad baja para evitar bloquear la UI
    requestIdleCallback(() => {
        positionsRef.child(currentUser.alias).set(positionData);
    }, { timeout: 100 });
}

function disconnectFromChat() {
    if (currentUser) {
        usersRef.child(currentUser.alias).remove();
        positionsRef.child(currentUser.alias).remove();
        currentUser = null;
    }
    isConnected = false;
    positionsRef.off('child_added');
    positionsRef.off('child_changed');
    positionsRef.off('child_removed');
}

// Cache para mantener el estado actual de los usuarios
const usersCache = new Map();

function updateUsersList(users) {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;

    // Crear un mapa de los usuarios actuales para comparación rápida
    const currentUsers = new Map(users.map(user => [user.alias, user]));
    
    // Eliminar usuarios que ya no están
    Array.from(usersCache.keys()).forEach(cachedAlias => {
        if (!currentUsers.has(cachedAlias)) {
            const element = usersCache.get(cachedAlias);
            if (element && element.parentNode) {
                element.remove();
            }
            usersCache.delete(cachedAlias);
        }
    });

    // Añadir o actualizar usuarios existentes
    users.forEach(user => {
        const isCurrentUser = user.alias === currentUser?.alias;
        const userKey = user.alias;
        
        if (usersCache.has(userKey)) {
            // Actualizar elemento existente si es necesario
            const element = usersCache.get(userKey);
            const displayName = userKey + (isCurrentUser ? ' (Tú)' : '');
            
            if (element.textContent !== displayName) {
                element.textContent = displayName;
            }
            
            // Actualizar clase si es necesario
            const newClass = 'user-item' + (isCurrentUser ? ' own' : '');
            if (element.className !== newClass) {
                element.className = newClass;
            }
        } else {
            // Crear nuevo elemento
            const element = document.createElement('div');
            element.className = 'user-item' + (isCurrentUser ? ' own' : '');
            element.textContent = userKey + (isCurrentUser ? ' (Tú)' : '');
            
            // Añadir al DOM y al caché
            usersList.appendChild(element);
            usersCache.set(userKey, element);
        }
    });
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
                if (now - user.timestamp > 90000) {
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
    
    // Generate a temporary ID for the message
    const tempMsgId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize processed messages set if it doesn't exist
    if (!window.processedPrivateMessages) window.processedPrivateMessages = new Set();
    
    // Add to processed messages to prevent duplicates
    window.processedPrivateMessages.add(tempMsgId);
    
    // First, immediately show the message in the sender's chat
    if (typeof window.addMessageToChat === 'function') {
        window.addMessageToChat(currentUser.alias, message, 'own', messageData.timestamp, true, toAlias);
    }
    
    // Then push to Firebase
    const newMessageRef = privateRef.push();
    newMessageRef.set(messageData);
    
    // Return the message reference in case we need it
    return newMessageRef.key;
}

function listenToPrivateMessages() {
    if (!currentUser) return;
    const privateRef = db.ref('privateMessages');
    
    // Limpiar listeners anteriores para evitar duplicados
    privateRef.off('child_added');
    
    // Set para rastrear mensajes ya procesados
    if (!window.processedPrivateMessages) window.processedPrivateMessages = new Set();
    
    // First, set up a listener for new chat rooms
    privateRef.on('child_added', (chatSnapshot) => {
        const chatId = chatSnapshot.key;
        if (chatId.includes(currentUser.alias)) {
            // For existing messages in this chat
            chatSnapshot.forEach((msgSnapshot) => {
                const msg = msgSnapshot.val();
                const msgKey = msgSnapshot.key;
                // Verificar si el mensaje ya fue procesado
                if (!window.processedPrivateMessages.has(msgKey) && (msg.to === currentUser.alias || msg.from === currentUser.alias)) {
                    window.processedPrivateMessages.add(msgKey);
                    if (typeof window.addMessageToChat === 'function') {
                        window.addMessageToChat(msg.from, msg.message, msg.from === currentUser.alias ? 'own' : 'user', msg.timestamp, true, msg.to);
                    }
                }
            });
            
            // For new messages in this chat
            chatSnapshot.ref.on('child_added', (msgSnapshot) => {
                const msg = msgSnapshot.val();
                const msgKey = msgSnapshot.key;
                
                // Skip if this is our own message (it's already handled by sendPrivateMessage)
                if (msg.from === currentUser.alias) return;
                
                // Verificar si el mensaje ya fue procesado
                if (!window.processedPrivateMessages.has(msgKey) && (msg.to === currentUser.alias || msg.from === currentUser.alias)) {
                    window.processedPrivateMessages.add(msgKey);
                    if (typeof window.addMessageToChat === 'function') {
                        window.addMessageToChat(msg.from, msg.message, 'user', msg.timestamp, true, msg.to);
                    }
                }
            });
        }
    });
}

window.connectToChat = connectToChat;
window.sendMessage = sendMessage;
window.sendPosition = sendPosition;
window.disconnectFromChat = disconnectFromChat;
window.updateUsersList = updateUsersList;
window.sendPrivateMessage = sendPrivateMessage;
window.listenToPrivateMessages = listenToPrivateMessages;

setInterval(() => {
    if (isConnected && currentUser) {
        usersRef.child(currentUser.alias).update({ timestamp: Date.now() });
    }
}, 10000);
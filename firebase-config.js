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
    positionsRef.child(currentUser.alias).onDisconnect().remove();
    usersRef.on('value', (snapshot) => {
        const users = snapshot.val() || {};
        updateUsersList(Object.values(users));
    });
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
    positionsRef.once('value', async (snapshot) => {
        const positions = snapshot.val() || {};
        for (const [alias, userData] of Object.entries(positions)) {
            if (alias !== currentUser.alias && userData && isValidPositionData(userData)) {
                console.log('[Firebase] Loading existing user:', alias);
                await updateAvatarPosition(
                    alias,
                    userData.position,
                    userData.floor,
                    userData.rotation,
                    userData.skin // Pass skin
                );
            }
        }
    });
    positionsRef.on('child_added', async (snapshot) => {
        const alias = snapshot.key;
        const userData = snapshot.val();
        console.log('[Firebase] child_added recibido para:', alias, 'datos:', userData);
        if (alias !== currentUser.alias && userData && isValidPositionData(userData)) {
            console.log('[Firebase] New user connected:', alias);
            await updateAvatarPosition(
                alias,
                userData.position,
                userData.floor,
                userData.rotation,
                userData.skin // Pass skin
            );
        } else {
            console.log('[Firebase] child_added ignorado - alias propio o datos inválidos');
        }
    });
    positionsRef.on('child_changed', async (snapshot) => {
        const alias = snapshot.key;
        const userData = snapshot.val();
        console.log('[Firebase] child_changed recibido para:', alias, 'datos:', userData);
        if (alias !== currentUser.alias && userData && isValidPositionData(userData)) {
            console.log('[Firebase] Position updated:', alias);
            await updateAvatarPosition(
                alias,
                userData.position,
                userData.floor,
                userData.rotation,
                userData.skin // Pass skin
            );
        } else {
            console.log('[Firebase] child_changed ignorado - alias propio o datos inválidos');
        }
    });
    positionsRef.on('child_removed', (snapshot) => {
        const alias = snapshot.key;
        if (alias !== currentUser.alias) {
            console.log('[Firebase] User disconnected:', alias);
            if (typeof window.removeUserAvatar === 'function') {
                window.removeUserAvatar(alias);
            }
        }
    });
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
    if (typeof window.addMessageToChat === 'function') {
        window.addMessageToChat(currentUser.alias, message, 'own', messageData.timestamp, false, null);
    }
}

function sendPosition(position, floor, rotation) {
    if (!isConnected || !currentUser) return;
    
    let skin = 'humanMaleA'; // Default skin
    if (typeof window.currentCustomization === 'object' && window.currentCustomization.skin) {
        skin = window.currentCustomization.skin;
    }

    const positionData = {
        position: position,
        floor: floor,
        rotation: rotation,
        skin: skin, // Send skin instead of colors
        timestamp: Date.now()
    };
    console.log('[sendPosition] Enviando datos:', positionData, 'para usuario:', currentUser.alias);
    positionsRef.child(currentUser.alias).set(positionData);
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
    privateRef.push(messageData);
}

function listenToPrivateMessages() {
    if (!currentUser) return;
    const privateRef = db.ref('privateMessages');
    privateRef.on('child_added', (snapshot) => {
        const chatId = snapshot.key;
        if (chatId.includes(currentUser.alias)) {
            privateRef.child(chatId).on('child_added', (msgSnap) => {
                const msg = msgSnap.val();
                if (msg.to === currentUser.alias || msg.from === currentUser.alias) {
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
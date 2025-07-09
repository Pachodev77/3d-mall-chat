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
    usersRef.on('value', (snapshot) => {
        const users = snapshot.val() || {};
        updateUsersList(Object.values(users));
    });
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        if (message.alias !== currentUser.alias) {
            addMessageToChat(message.alias, message.message, 'user');
        }
    });
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
}

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

function disconnectFromChat() {
    if (currentUser) {
        usersRef.child(currentUser.alias).remove();
        positionsRef.child(currentUser.alias).remove();
        currentUser = null;
    }
    isConnected = false;
}

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

window.connectToChat = connectToChat;
window.sendMessage = sendMessage;
window.sendPosition = sendPosition;
window.disconnectFromChat = disconnectFromChat;
window.updateUsersList = updateUsersList; 
const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}




const socket = io();

// Messagae from server
socket.on('message', message => {
 console.log(message);
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  console.log(users);
});

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

let user = <%-JSON.stringify(user)%>;

socket.emit('login', {user: user});


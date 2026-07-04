// server.js
// Real-time chat application backend
// Express serves the frontend, Socket.IO handles all real-time communication

const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8000;

// Serve static frontend files (index.html, css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store of connected users: { socketId: username }
const users = {};

function getOnlineUsers() {
  return Object.values(users);
}

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // A new user joins the chat
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    console.log(`${name} joined the chat`);

    // Let everyone else know someone joined
    socket.broadcast.emit('user-joined', name);

    // Send the updated online user list to everyone
    io.emit('online-users', getOnlineUsers());
  });

  // A user sends a chat message
  socket.on('send', (message) => {
    const name = users[socket.id];
    if (!name) return;

    io.emit('receive', {
      name,
      message,
      id: socket.id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  // Typing indicator
  socket.on('typing', () => {
    const name = users[socket.id];
    if (!name) return;
    socket.broadcast.emit('typing', name);
  });

  socket.on('stop-typing', () => {
    socket.broadcast.emit('stop-typing');
  });

  // A user disconnects
  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      console.log(`${name} left the chat`);
      socket.broadcast.emit('left', name);
      delete users[socket.id];
      io.emit('online-users', getOnlineUsers());
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

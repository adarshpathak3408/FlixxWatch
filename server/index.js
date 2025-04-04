const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Update with your frontend URL
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Create a new room
  socket.on('createRoom', ({ movieId, userId }) => {
    const roomId = uuidv4();
    rooms.set(roomId, {
      movieId,
      host: userId,
      users: [userId],
      playbackState: {
        isPlaying: false,
        currentTime: 0,
        lastUpdated: Date.now()
      }
    });
    socket.join(roomId);
    socket.emit('roomCreated', { roomId });
    console.log(`Room created: ${roomId} for movie ${movieId}`);
  });

  // Join an existing room
  socket.on('joinRoom', ({ roomId, userId }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    room.users.push(userId);
    socket.join(roomId);
    socket.emit('roomJoined', { 
      roomId, 
      movieId: room.movieId,
      host: room.host,
      playbackState: room.playbackState
    });
    io.to(roomId).emit('userJoined', { userId, users: room.users });
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Handle video state changes
  socket.on('updatePlaybackState', ({ roomId, state }) => {
    const room = rooms.get(roomId);
    if (!room || socket.id !== room.host) return;

    room.playbackState = {
      isPlaying: state.isPlaying,
      currentTime: state.currentTime,
      lastUpdated: Date.now()
    };
    socket.to(roomId).emit('playbackStateUpdated', room.playbackState);
  });

  // Handle chat messages
  socket.on('sendMessage', ({ roomId, userId, message }) => {
    io.to(roomId).emit('messageReceived', { userId, message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Clean up empty rooms
    rooms.forEach((room, roomId) => {
      room.users = room.users.filter(user => user !== socket.id);
      if (room.users.length === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted (empty)`);
      }
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
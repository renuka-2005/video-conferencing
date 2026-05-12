require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.post('/api/summarize', (req, res) => {
  const { transcript } = req.body;
  if (!transcript) return res.status(400).json({ error: 'No transcript provided' });

  // Simple mock AI logic
  const lines = transcript.split('\n');
  const participantCount = new Set(lines.map(l => l.split(']:')[0])).size;
  
  const summary = `
Meeting Summary:
- Total Messages recorded: ${lines.length}
- Participants active: ${participantCount}

Full Transcript:
${lines.map(l => "- " + l).join('\n')}
  `.trim();

  res.json({ summary });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/video_conf_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Store room participants: { roomId: { socketId: { username, ... } } }
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins a room
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    
    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }
    
    // Store user data
    rooms[roomId][socket.id] = { username, id: socket.id };

    console.log(`User ${username} (${socket.id}) joined room ${roomId}`);

    // Notify other users in the room
    const otherUsers = Object.keys(rooms[roomId]).filter(id => id !== socket.id);
    
    // Send list of existing users to the new user
    socket.emit('room-users', otherUsers.map(id => ({ id, username: rooms[roomId][id].username })));

    // Tell everyone else that a new user has joined
    socket.to(roomId).emit('user-joined', { id: socket.id, username });
  });

  // WebRTC Signaling: Offer
  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', {
      caller: socket.id,
      sdp: payload.sdp,
      username: payload.username
    });
  });

  // WebRTC Signaling: Answer
  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', {
      caller: socket.id,
      sdp: payload.sdp
    });
  });

  // WebRTC Signaling: ICE Candidate
  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', {
      caller: socket.id,
      candidate: payload.candidate
    });
  });

  // Chat message
  socket.on('chat-message', ({ roomId, message, username }) => {
    io.to(roomId).emit('chat-message', {
      userId: socket.id,
      username,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Subtitle message
  socket.on('subtitle-message', ({ roomId, text, username }) => {
    socket.to(roomId).emit('subtitle-message', {
      userId: socket.id,
      username,
      text,
    });
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        const username = rooms[roomId][socket.id].username;
        delete rooms[roomId][socket.id];
        
        if (Object.keys(rooms[roomId]).length === 0) {
          delete rooms[roomId]; // Clean up empty room
        } else {
          socket.to(roomId).emit('user-left', { id: socket.id, username });
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

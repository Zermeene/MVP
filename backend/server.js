const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active rooms
const rooms = new Map();

// Generate random room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create room
  socket.on('create-room', ({ playerName, mode }) => {
    const roomCode = generateRoomCode();
    const room = {
      code: roomCode,
      host: socket.id,
      players: [{
        id: socket.id,
        name: playerName,
        finished: false,
        finishTime: null
      }],
      task: '',
      penalty: '',
      duration: 0,
      timerStart: null,
      timerActive: false,
      timerEnd: null,
      mode: mode || 'multiplayer',
      winner: null
    };
    
    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.emit('room-created', { roomCode, room });
    console.log(`Room created: ${roomCode}`);
  });

  // Join room
  socket.on('join-room', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.mode === 'solo') {
      socket.emit('error', { message: 'Cannot join solo room' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      finished: false,
      finishTime: null
    };

    room.players.push(player);
    socket.join(roomCode);
    
    io.to(roomCode).emit('player-joined', { room });
    console.log(`Player ${playerName} joined room ${roomCode}`);
  });

  // Set game config
  socket.on('set-config', ({ roomCode, task, penalty, duration }) => {
    const room = rooms.get(roomCode);
    if (!room || room.host !== socket.id) return;

    room.task = task;
    room.penalty = penalty;
    room.duration = duration;

    io.to(roomCode).emit('config-updated', { room });
  });

  // Start timer
  socket.on('start-timer', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.host !== socket.id) return;

    room.timerStart = Date.now();
    room.timerEnd = room.timerStart + room.duration;
    room.timerActive = true;
    room.players.forEach(p => {
      p.finished = false;
      p.finishTime = null;
    });
    room.winner = null;

    // Send game started event with notification
    io.to(roomCode).emit('game-started', { 
      startTime: room.timerStart,
      duration: room.duration,
      endTime: room.timerEnd
    });

    // Set timeout to auto-end game
    setTimeout(() => {
      const currentRoom = rooms.get(roomCode);
      if (currentRoom && currentRoom.timerActive) {
        currentRoom.timerActive = false;
        io.to(roomCode).emit('game-ended', { 
          reason: 'timeout',
          room: currentRoom
        });
      }
    }, room.duration);
  });

  // Mark task complete
  socket.on('complete-task', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player || player.finished) return;

    const finishTime = Date.now() - room.timerStart;
    player.finished = true;
    player.finishTime = finishTime;

    // Check if this is the winner
    if (!room.winner) {
      room.winner = socket.id;
    }

    // Send completion notification
    io.to(roomCode).emit('player-finished', { 
      playerId: socket.id,
      playerName: player.name,
      finishTime,
      isWinner: room.winner === socket.id,
      room
    });

    // Check if game should end (all players finished)
    const allFinished = room.players.every(p => p.finished);
    if (allFinished) {
      room.timerActive = false;
      io.to(roomCode).emit('game-ended', { 
        reason: 'all-finished',
        room
      });
    }
  });

  // Send meme distraction - now with video support
  socket.on('send-meme', ({ roomCode, memeId }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const sender = room.players.find(p => p.id === socket.id);
    
    // Broadcast to all OTHER players in the room
    socket.to(roomCode).emit('meme-received', { 
      memeId,
      from: sender?.name || 'Unknown'
    });
  });

  // Get room state
  socket.on('get-room', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room) {
      socket.emit('room-state', { room });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from rooms and notify
    rooms.forEach((room, code) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          rooms.delete(code);
          console.log(`Room ${code} deleted (empty)`);
        } else {
          // If host left, assign new host
          if (room.host === socket.id) {
            room.host = room.players[0].id;
          }
          io.to(code).emit('player-left', { room });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 MindMash server running on port ${PORT}`);
});

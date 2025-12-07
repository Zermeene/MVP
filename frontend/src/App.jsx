import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import { initAnalytics, trackPageView, analytics } from './analytics';

// Connect to backend - update this URL when deploying
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [screen, setScreen] = useState('home'); // home, lobby, game, results
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [timerData, setTimerData] = useState(null);
  const [error, setError] = useState('');

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics();
    trackPageView('/');
  }, []);

  // Track screen changes
  useEffect(() => {
    trackPageView(`/${screen}`);
  }, [screen]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('room-created', ({ roomCode, room }) => {
      setRoomCode(roomCode);
      setRoom(room);
      setIsHost(true);
      setScreen('lobby');
      analytics.roomCreated(room.mode); // Track room creation
    });

    socket.on('player-joined', ({ room }) => {
      setRoom(room);
      if (!isHost) {
        analytics.roomJoined(roomCode); // Track room join
      }
    });

    socket.on('player-left', ({ room }) => {
      setRoom(room);
    });

    socket.on('config-updated', ({ room }) => {
      setRoom(room);
    });

    // NEW: Listen for game-started event
    socket.on('game-started', ({ startTime, duration, endTime }) => {
      setTimerData({ startTime, duration, endTime });
      setScreen('game');
      if (room) {
        analytics.gameStarted(room.mode, duration); // Track game start
      }
    });

    // NEW: Listen for game-ended event
    socket.on('game-ended', ({ reason, room }) => {
      setRoom(room);
      // Short delay before showing results
      setTimeout(() => {
        setScreen('results');
      }, 1000);
    });

    socket.on('player-finished', ({ playerId, playerName, finishTime, isWinner, room }) => {
      setRoom(room);
      
      // Track completion
      if (playerId === socket.id) {
        analytics.gameCompleted(isWinner); // Track win/loss
      }
      
      // Show results after a short delay if you finished
      if (playerId === socket.id) {
        setTimeout(() => {
          setScreen('results');
        }, 1000);
      }
    });

    socket.on('meme-received', ({ memeId, from }) => {
      // This is handled in GameScreen component
    });

    socket.on('error', ({ message }) => {
      setError(message);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('room-state', ({ room }) => {
      setRoom(room);
    });

    return () => {
      socket.off('room-created');
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('config-updated');
      socket.off('game-started');
      socket.off('game-ended');
      socket.off('player-finished');
      socket.off('meme-received');
      socket.off('error');
      socket.off('room-state');
    };
  }, [socket]);

  const createRoom = (name, mode) => {
    setPlayerName(name);
    socket.emit('create-room', { playerName: name, mode });
  };

  const joinRoom = (name, code) => {
    setPlayerName(name);
    setRoomCode(code);
    socket.emit('join-room', { roomCode: code, playerName: name });
    setScreen('lobby');
  };

  const setGameConfig = (task, penalty, duration) => {
    socket.emit('set-config', { roomCode, task, penalty, duration });
  };

  const startGame = () => {
    socket.emit('start-timer', { roomCode });
  };

  const completeTask = () => {
    socket.emit('complete-task', { roomCode });
  };

  const sendMeme = (memeId) => {
    socket.emit('send-meme', { roomCode, memeId });
  };

  const resetGame = () => {
    setScreen('lobby');
    setTimerData(null);
    if (room) {
      socket.emit('get-room', { roomCode });
    }
  };

  const leaveRoom = () => {
    setScreen('home');
    setRoomCode('');
    setRoom(null);
    setIsHost(false);
    setTimerData(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce-in z-50">
          {error}
        </div>
      )}

      {/* Render appropriate screen */}
      {screen === 'home' && (
        <HomeScreen onCreateRoom={createRoom} onJoinRoom={joinRoom} />
      )}

      {screen === 'lobby' && (
        <LobbyScreen
          room={room}
          roomCode={roomCode}
          isHost={isHost}
          playerName={playerName}
          onSetConfig={setGameConfig}
          onStartGame={startGame}
          onLeave={leaveRoom}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          room={room}
          timerData={timerData}
          socket={socket}
          playerName={playerName}
          onComplete={completeTask}
          onSendMeme={sendMeme}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          room={room}
          playerName={playerName}
          onReset={resetGame}
          onLeave={leaveRoom}
        />
      )}
    </div>
  );
}

export default App;

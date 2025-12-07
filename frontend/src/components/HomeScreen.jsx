import { useState } from 'react';
import { motion } from 'framer-motion';

function HomeScreen({ onCreateRoom, onJoinRoom }) {
  const [view, setView] = useState('main');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState('multiplayer');

  const handleCreate = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateRoom(playerName.trim(), mode);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (playerName.trim() && roomCode.trim()) {
      onJoinRoom(playerName.trim(), roomCode.trim().toUpperCase());
    }
  };

  if (view === 'main') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.h1
            className="font-display text-7xl md:text-8xl font-black glow-text"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #b829ff 50%, #ff006e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              textShadow: [
                '0 0 20px rgba(0,240,255,0.5)',
                '0 0 40px rgba(184,41,255,0.8)',
                '0 0 20px rgba(255,0,110,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            MINDMASH
          </motion.h1>
          <p className="text-xl text-gray-400 font-body">
            Focus Battle Game • Compete or Grind Solo
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('create')}
            className="btn-primary w-full"
          >
            🎮 Create Room
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('join')}
            className="btn-secondary w-full"
          >
            🚀 Join Room
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          {[
            { emoji: '⚡', text: 'Real-time sync' },
            { emoji: '🎯', text: 'Competitive focus' },
            { emoji: '😂', text: 'Video meme attacks' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-game text-center"
            >
              <div className="text-4xl mb-2">{feature.emoji}</div>
              <div className="text-sm text-gray-400">{feature.text}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (view === 'create') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="card-game space-y-6">
          <h2 className="font-display text-3xl font-bold text-neon-blue">
            Create Room
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input-game"
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Game Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('multiplayer')}
                  className={`py-3 px-4 rounded-lg font-display font-bold border-2 transition-all ${
                    mode === 'multiplayer'
                      ? 'bg-neon-purple border-neon-purple text-white'
                      : 'bg-dark-700 border-dark-600 text-gray-400'
                  }`}
                >
                  👥 2-Player
                </button>
                <button
                  type="button"
                  onClick={() => setMode('solo')}
                  className={`py-3 px-4 rounded-lg font-display font-bold border-2 transition-all ${
                    mode === 'solo'
                      ? 'bg-neon-blue border-neon-blue text-white'
                      : 'bg-dark-700 border-dark-600 text-gray-400'
                  }`}
                >
                  👤 Solo
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setView('main')}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button type="submit" className="btn-primary flex-1">
                Create
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  if (view === 'join') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="card-game space-y-6">
          <h2 className="font-display text-3xl font-bold text-neon-purple">
            Join Room
          </h2>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input-game"
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="input-game uppercase tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setView('main')}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button type="submit" className="btn-primary flex-1">
                Join
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }
}

export default HomeScreen;

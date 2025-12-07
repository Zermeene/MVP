import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function LobbyScreen({ room, roomCode, isHost, playerName, onSetConfig, onStartGame, onLeave }) {
  const [task, setTask] = useState(room?.task || '');
  const [penalty, setPenalty] = useState(room?.penalty || '');
  const [minutes, setMinutes] = useState(Math.floor((room?.duration || 300000) / 60000));

  useEffect(() => {
    if (room) {
      setTask(room.task || '');
      setPenalty(room.penalty || '');
      setMinutes(Math.floor((room.duration || 300000) / 60000));
    }
  }, [room]);

  const handleSetConfig = () => {
    if (task.trim() && penalty.trim() && minutes > 0) {
      onSetConfig(task.trim(), penalty.trim(), minutes * 60000);
    }
  };

  const canStart = room?.task && room?.penalty && room?.duration > 0 && 
                   (room?.mode === 'solo' || room?.players?.length === 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl w-full space-y-6"
    >
      <div className="text-center space-y-2">
        <h1 className="font-display text-5xl font-black text-neon-blue">
          LOBBY
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="status-badge border-neon-purple text-neon-purple bg-neon-purple/10">
            {room?.mode === 'solo' ? '👤 Solo Mode' : '👥 2-Player'}
          </div>
          <div className="status-badge border-neon-blue text-neon-blue bg-neon-blue/10">
            Room: {roomCode}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-game">
          <h3 className="font-display text-xl font-bold text-neon-green mb-4">
            👥 Players
          </h3>
          <div className="space-y-3">
            {room?.players?.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-dark-700 p-4 rounded-lg border-2 border-neon-green/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-neon-blue rounded-full flex items-center justify-center text-xl">
                    {index === 0 ? '👑' : '🎮'}
                  </div>
                  <span className="font-bold">{player.name}</span>
                </div>
                {player.id === room?.host && (
                  <span className="text-xs bg-neon-purple/20 text-neon-purple px-3 py-1 rounded-full border border-neon-purple/50">
                    HOST
                  </span>
                )}
              </motion.div>
            ))}
            
            {room?.mode === 'multiplayer' && room?.players?.length < 2 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                <div className="text-4xl mb-2">⏳</div>
                <div>Waiting for player 2...</div>
              </div>
            )}
          </div>
        </div>

        <div className="card-game">
          <h3 className="font-display text-xl font-bold text-neon-purple mb-4">
            ⚙️ Game Setup
          </h3>
          
          {isHost ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Task/Challenge
                </label>
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onBlur={handleSetConfig}
                  placeholder="e.g., Complete 10 math problems"
                  className="input-game text-sm"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Penalty for Loser
                </label>
                <input
                  type="text"
                  value={penalty}
                  onChange={(e) => setPenalty(e.target.value)}
                  onBlur={handleSetConfig}
                  placeholder="e.g., Make chai, wash dishes"
                  className="input-game text-sm"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Timer (minutes)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newMin = Math.max(1, minutes - 1);
                      setMinutes(newMin);
                      onSetConfig(task, penalty, newMin * 60000);
                    }}
                    className="w-12 h-12 bg-dark-700 border-2 border-neon-blue/30 rounded-lg text-2xl hover:bg-dark-600"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-4xl font-display font-bold text-neon-blue">
                      {minutes}
                    </div>
                    <div className="text-xs text-gray-500">minutes</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newMin = Math.min(60, minutes + 1);
                      setMinutes(newMin);
                      onSetConfig(task, penalty, newMin * 60000);
                    }}
                    className="w-12 h-12 bg-dark-700 border-2 border-neon-blue/30 rounded-lg text-2xl hover:bg-dark-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-gray-400">
              <div className="bg-dark-700 p-4 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Task</div>
                <div className="font-bold text-white">
                  {room?.task || 'Waiting for host to set...'}
                </div>
              </div>
              <div className="bg-dark-700 p-4 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Penalty</div>
                <div className="font-bold text-white">
                  {room?.penalty || 'Waiting for host to set...'}
                </div>
              </div>
              <div className="bg-dark-700 p-4 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Timer</div>
                <div className="font-bold text-white">
                  {room?.duration ? `${Math.floor(room.duration / 60000)} minutes` : 'Not set'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={onLeave} className="btn-secondary flex-1">
          Leave Room
        </button>
        {isHost && (
          <motion.button
            whileHover={{ scale: canStart ? 1.05 : 1 }}
            whileTap={{ scale: canStart ? 0.95 : 1 }}
            onClick={canStart ? onStartGame : null}
            disabled={!canStart}
            className={`btn-primary flex-1 ${
              !canStart ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {canStart ? '🚀 Start Game' : '⏳ Set Config...'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default LobbyScreen;

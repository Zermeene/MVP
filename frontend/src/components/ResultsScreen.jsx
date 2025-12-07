import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function ResultsScreen({ room, playerName, onReset, onLeave }) {
  const [confetti, setConfetti] = useState([]);

  const myPlayer = room?.players?.find(p => p.name === playerName);
  const isWinner = room?.winner === myPlayer?.id;
  const winner = room?.players?.find(p => p.id === room?.winner);
  const loser = room?.players?.find(p => p.id !== room?.winner);

  useEffect(() => {
    if (isWinner) {
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }));
      setConfetti(particles);
    }
  }, [isWinner]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl w-full space-y-8 relative"
    >
      {isWinner && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {confetti.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"
              style={{ left: `${particle.x}%`, top: -20 }}
              animate={{
                y: ['0vh', '100vh'],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center space-y-6 relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-9xl"
        >
          {isWinner ? '🏆' : '😅'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-6xl font-black"
          style={{
            background: isWinner
              ? 'linear-gradient(135deg, #00ff88 0%, #00f0ff 100%)'
              : 'linear-gradient(135deg, #ff006e 0%, #b829ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {isWinner ? 'VICTORY!' : 'YOU LOST!'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-gray-300"
        >
          {isWinner
            ? 'Champion of Focus! 🔥'
            : 'Time to face the penalty... 💀'}
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card-game border-neon-green bg-neon-green/10"
        >
          <div className="text-center space-y-4">
            <div className="text-5xl">🏆</div>
            <h3 className="font-display text-2xl font-bold text-neon-green">
              WINNER
            </h3>
            <div className="text-3xl font-bold">{winner?.name || 'Unknown'}</div>
            {winner?.finishTime && (
              <div className="text-xl text-gray-400">
                Finished in {formatTime(winner.finishTime)}
              </div>
            )}
            <div className="pt-4 text-neon-green font-bold text-lg">
              ✨ Gets to relax! ✨
            </div>
          </div>
        </motion.div>

        {loser && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="card-game border-neon-pink bg-neon-pink/10"
          >
            <div className="text-center space-y-4">
              <div className="text-5xl">😭</div>
              <h3 className="font-display text-2xl font-bold text-neon-pink">
                LOSER
              </h3>
              <div className="text-3xl font-bold">{loser.name}</div>
              {loser.finishTime ? (
                <div className="text-xl text-gray-400">
                  Finished in {formatTime(loser.finishTime)}
                </div>
              ) : (
                <div className="text-xl text-gray-400">Didn't finish!</div>
              )}
              <div className="pt-4 bg-dark-700 p-4 rounded-lg border-2 border-neon-pink/50">
                <div className="text-sm text-gray-400 mb-1">Must do:</div>
                <div className="text-xl font-bold text-neon-pink">
                  {room?.penalty}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {room?.mode === 'solo' && !loser && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="card-game border-neon-yellow bg-neon-yellow/10"
          >
            <div className="text-center space-y-4">
              <div className="text-5xl">💪</div>
              <h3 className="font-display text-2xl font-bold text-neon-yellow">
                YOUR REWARD
              </h3>
              <div className="text-xl text-gray-400">
                Completed in {formatTime(winner?.finishTime || 0)}
              </div>
              <div className="pt-4 text-neon-green font-bold text-lg">
                ✅ Task accomplished!
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-game text-center relative z-10"
      >
        <h3 className="font-display text-xl font-bold text-neon-blue mb-4">
          📊 BATTLE STATS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-display font-bold text-neon-blue">
              {room?.task?.length || 0}
            </div>
            <div className="text-sm text-gray-400">Task Length</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-neon-purple">
              {Math.floor((room?.duration || 0) / 60000)}m
            </div>
            <div className="text-sm text-gray-400">Time Limit</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-neon-pink">
              {winner?.finishTime ? formatTime(winner.finishTime) : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Winning Time</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-4 relative z-10"
      >
        <button onClick={onLeave} className="btn-secondary flex-1">
          Leave Game
        </button>
        <button onClick={onReset} className="btn-primary flex-1">
          Play Again
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-gray-500 text-sm relative z-10"
      >
        {isWinner ? (
          <p>🎉 You earned your break! Now sit back and watch them do the penalty 😎</p>
        ) : (
          <p>😅 Better luck next time! Time to pay up... {room?.penalty} 💪</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ResultsScreen;

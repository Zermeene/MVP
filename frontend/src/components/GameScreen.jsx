import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 🔥 EASY MEME SYSTEM - JUST ADD YOUR FILES HERE!
// Step 1: Add your video to /frontend/public/memes/yourvideo.mp4
// Step 2: Add thumbnail to /frontend/public/memes/yourvideo.jpeg (or .jpg or .png)
// Step 3: Add entry below with id, name, image path, video path
// That's it! The app will handle the rest! 🚀

const MEMES = [
  { id: 1, name: 'aaagh', image: '/memes/aaagh.jpeg', video: '/memes/aaagh.mp4' },
  { id: 2, name: 'kioun_', image: '/memes/kioun_.jpeg', video: '/memes/kioun_.mp4' },
  { id: 3, name: 'ab_tu_dekh', image: '/memes/ab_tu_dekh.jpeg', video: '/memes/ab_tu_dekh.mp4' },
  { id: 4, name: '4', image: '/memes/4.jpeg', video: '/memes/4.mp4' },
  { id: 5, name: '5', image: '/memes/5.jpeg', video: '/memes/5.mp4' },
  { id: 6, name: '6', image: '/memes/6.jpeg', video: '/memes/6.mp4' },
  { id: 7, name: '7', image: '/memes/7.jpeg', video: '/memes/7.mp4' },
  { id: 8, name: '8', image: '/memes/8.jpeg', video: '/memes/8.mp4' },
  { id: 9, name: '9', image: '/memes/9.jpeg', video: '/memes/9.mp4' },
  { id: 10, name: '10', image: '/memes/10.jpeg', video: '/memes/10.mp4' },
  { id: 11, name: '11', image: '/memes/11.jpeg', video: '/memes/11.mp4' },
  { id: 12, name: '12', image: '/memes/12.jpeg', video: '/memes/12.mp4' },
  { id: 13, name: '13', image: '/memes/13.jpeg', video: '/memes/13.mp4' },
  { id: 14, name: '14', image: '/memes/14.jpeg', video: '/memes/14.mp4' },
  { id: 15, name: '15', image: '/memes/15.jpeg', video: '/memes/15.mp4' },
  
  // 💡 TO ADD MORE MEMES:
  // Copy files to /frontend/public/memes/
  // Then add them here like this:
  // { id: 4, name: 'your_meme_name', image: '/memes/your_image.jpeg', video: '/memes/your_video.mp4' },
  // { id: 5, name: 'another_meme', image: '/memes/another.png', video: '/memes/another.mp4' },
  
  // 🗑️ TO REMOVE MEMES:
  // Just delete or comment out the line
  
  // 🔄 TO REPLACE MEMES:
  // Replace the file in /public/memes/ folder OR change the path here
];

function GameScreen({ room, timerData, socket, playerName, onComplete, onSendMeme }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [memeNotification, setMemeNotification] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const videoRef = useRef(null);
  const hasPlayedStartSound = useRef(false);
  const videoDismissTimer = useRef(null);

  // Play notification sound
  const playNotificationSound = (type = 'beep') => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'start') {
      // Game start sound - upward beep pattern
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.4;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
      
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 880;
        gain2.gain.value = 0.4;
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.15);
      }, 100);
    } else if (type === 'end') {
      // Game end sound - three quick beeps
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = 660;
          gain.gain.value = 0.5;
          osc.start();
          osc.stop(audioContext.currentTime + 0.1);
        }, i * 150);
      }
    } else if (type === 'complete') {
      // Task complete sound - victory beep
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.5;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } else {
      // Default beep
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.3;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  // Show browser notification
  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' });
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Play start sound once when game starts
  useEffect(() => {
    if (timerData && !hasPlayedStartSound.current) {
      playNotificationSound('start');
      showNotification('MindMash - Game Started!', 'The battle begins NOW! 🔥');
      hasPlayedStartSound.current = true;
    }
  }, [timerData]);

  // Timer countdown
  useEffect(() => {
    if (!timerData) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - timerData.startTime;
      const remaining = Math.max(0, timerData.duration - elapsed);
      setTimeLeft(remaining);

      // Auto-end game when timer hits 0
      if (remaining === 0 && !gameEnded) {
        setGameEnded(true);
        playNotificationSound('end');
        showNotification('MindMash - Time\'s Up!', 'Game ended! ⏰');
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timerData, gameEnded]);

  // Listen for game-ended event from server
  useEffect(() => {
    if (!socket) return;

    const handleGameEnded = ({ reason, room }) => {
      if (!gameEnded) {
        setGameEnded(true);
        playNotificationSound('end');
        if (reason === 'timeout') {
          showNotification('MindMash - Time\'s Up!', 'Game ended! Check results ⏰');
        }
      }
    };

    socket.on('game-ended', handleGameEnded);
    return () => socket.off('game-ended', handleGameEnded);
  }, [socket, gameEnded]);

  // Listen for meme attacks
  useEffect(() => {
    if (!socket) return;

    const handleMeme = ({ memeId, from }) => {
      const meme = MEMES.find(m => m.id === memeId);
      if (meme) {
        // Show meme video notification
        setMemeNotification({ meme, from });
        
        // Play the video with audio
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Video play error:', e));
          }
        }, 100);
        
        // Clear any existing timer
        if (videoDismissTimer.current) {
          clearTimeout(videoDismissTimer.current);
        }
      }
    };

    socket.on('meme-received', handleMeme);
    return () => {
      socket.off('meme-received', handleMeme);
      if (videoDismissTimer.current) {
        clearTimeout(videoDismissTimer.current);
      }
    };
  }, [socket]);

  // 🔥 NEW: Auto-dismiss video when it ends (plays till completion!)
  const handleVideoEnd = () => {
    // Video finished playing, now dismiss
    videoDismissTimer.current = setTimeout(() => {
      setMemeNotification(null);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }, 500); // Small delay after video ends
  };

  const handleComplete = () => {
    if (!finished && !gameEnded) {
      setFinished(true);
      onComplete();
      playNotificationSound('complete');
      showNotification('MindMash - Task Complete!', 'You finished! Waiting for results... ✅');
    }
  };

  const handleSendMeme = (memeId) => {
    onSendMeme(memeId);
    playNotificationSound('beep');
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = timerData ? (timeLeft / timerData.duration) * 100 : 100;
  const isLowTime = timeLeft < 60000; // Less than 1 minute

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl w-full space-y-8"
    >
      {/* Meme Attack Video Notification */}
      <AnimatePresence>
        {memeNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="meme-overlay"
          >
            <div className="text-center">
              <motion.video
                ref={videoRef}
                src={memeNotification.meme.video}
                className="meme-video animate-zoom-in"
                autoPlay
                playsInline
                onEnded={handleVideoEnd}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-neon-pink/90 text-white px-8 py-4 rounded-full font-display font-bold text-xl"
              >
                {memeNotification.from} sent: {memeNotification.meme.name}! 😂
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Display */}
      <div className="text-center space-y-4">
        <motion.div
          className={`timer-display ${isLowTime ? 'animate-pulse' : ''}`}
          style={{
            color: isLowTime ? '#ff006e' : undefined,
          }}
        >
          {formatTime(timeLeft)}
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-dark-700 rounded-full overflow-hidden border-2 border-neon-blue/30">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
            style={{ width: `${progress}%` }}
            animate={{
              opacity: isLowTime ? [1, 0.5, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
          />
        </div>

        {isLowTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neon-pink font-bold text-xl animate-pulse"
          >
            ⚠️ TIME RUNNING OUT! ⚠️
          </motion.div>
        )}
      </div>

      {/* Task Display */}
      <div className="card-game text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-neon-blue">
          YOUR TASK
        </h2>
        <p className="text-2xl font-bold text-white">
          {room?.task}
        </p>
        <div className="text-sm text-gray-400">
          ⚠️ Loser's Penalty: <span className="text-neon-pink font-bold">{room?.penalty}</span>
        </div>
      </div>

      {/* Players Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {room?.players?.map((player) => (
          <motion.div
            key={player.id}
            className={`card-game ${
              player.finished
                ? 'border-neon-green bg-neon-green/10'
                : 'border-neon-blue/30'
            }`}
            animate={player.finished ? { scale: [1, 1.05, 1] } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-xl">
                  {player.finished ? '✅' : '⏱️'}
                </div>
                <div>
                  <div className="font-bold">{player.name}</div>
                  <div className="text-xs text-gray-400">
                    {player.finished
                      ? `Finished in ${formatTime(player.finishTime)}`
                      : 'In progress...'}
                  </div>
                </div>
              </div>
              {player.finished && room.winner === player.id && (
                <div className="text-4xl">🏆</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Meme Attack Buttons - WITH ACTUAL VIDEO THUMBNAILS - SCROLLABLE! */}
      {room?.mode === 'multiplayer' && !finished && !gameEnded && (
        <div className="card-game">
          <h3 className="font-display text-lg font-bold text-neon-pink mb-4 text-center">
            😂 MEME ATTACKS ({MEMES.length} available)
          </h3>
          <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {MEMES.map((meme) => (
                <motion.button
                  key={meme.id}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSendMeme(meme.id)}
                  className="btn-meme relative group"
                  title={meme.name}
                >
                  <img src={meme.image} alt={meme.name} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{meme.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            Scroll for more! Click to blast opponent with video memes! 🎥
          </p>
        </div>
      )}

      {/* Complete Button */}
      {!finished && !gameEnded && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          className="btn-primary w-full text-2xl py-6"
        >
          ✅ I'M DONE!
        </motion.button>
      )}

      {finished && !gameEnded && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="status-badge border-neon-green text-neon-green bg-neon-green/20 inline-block text-lg"
          >
            ✅ Task Completed! Waiting for results...
          </motion.div>
        </div>
      )}

      {gameEnded && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="status-badge border-neon-yellow text-neon-yellow bg-neon-yellow/20 inline-block text-lg"
          >
            ⏰ Game Ended! Check Results...
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default GameScreen;

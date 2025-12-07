# 🎮 MINDMASH - Focus Battle Game

Turn productivity into a competitive game! MindMash is a real-time focus battle app where players compete to complete tasks faster, with **VIDEO MEME DISTRACTIONS** to make it interesting.

## 🔥 NEW Features (Updated!)

- ✅ **Video Meme Attacks**: Real video memes with audio that blast on opponent's screen
- ✅ **Game Start Notification**: Sound + browser notification when game begins
- ✅ **Auto-End Game**: Timer automatically ends game with sound when time runs out
- ✅ **Completion Sound**: Beep notification when you finish your task
- ✅ **Solo Mode**: Set personal challenges with rewards/penalties
- ✅ **2-Player Battle**: Compete head-to-head in real-time
- ✅ **Real-time Sync**: Perfect timer synchronization across devices
- ✅ **Custom Tasks & Penalties**: Set your own challenges
- ✅ **Game-like UI**: Vibrant neon design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Local Development

1. **Clone and setup:**
```bash
cd mindmash
```

2. **Start Backend:**
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:3001`

3. **Start Frontend (in new terminal):**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:3000`

4. **Open in browser:**
- Visit `http://localhost:3000`
- Create a room or join with a friend!
- **IMPORTANT**: Click anywhere on the page first to enable sounds

## 📱 How to Play

### Solo Mode:
1. Create room → Select "Solo Mode"
2. Enter your name
3. Set task, penalty, and timer
4. Start and focus!
5. Complete before time runs out or face the penalty
6. **NEW**: Hear notification when game starts and ends!

### 2-Player Battle:
1. **Player 1**: Create room → Select "2-Player" → Share room code
2. **Player 2**: Join room with the code
3. **Host sets**: Task, penalty, timer duration
4. **Both players**: Click "I'M DONE!" when finished
5. **First to finish wins**, loser does the penalty!
6. **NEW**: Get notified with sound when game starts/ends

### Video Meme Attacks (2-Player only):
- **NEW**: Click video meme thumbnails to attack opponent
- A **FULL VIDEO with AUDIO** plays on their screen
- Completely distracts them with sound and visuals!
- Use strategically to throw them off! 😂

### Notification System (NEW!):
- 🔔 **Game Start**: Upward beep pattern + browser notification
- ⏰ **Timer End**: Three quick beeps + notification (auto-ends game)
- ✅ **Task Complete**: Victory beep + notification
- 🎥 **Meme Attack**: Video plays with audio on opponent's screen

## 🎨 Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS (custom neon theme)
- Framer Motion (animations)
- Socket.io Client
- Web Audio API (notification sounds)
- HTML5 Video (meme playback)

**Backend:**
- Node.js + Express
- Socket.io (WebSocket)
- In-memory room management
- Auto game-end timers

## 🌐 Deployment

### Deploy Backend (Render/Railway)

**Using Render:**
1. Create account at [render.com](https://render.com)
2. New Web Service → Connect Git repo
3. Settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node
4. Deploy!
5. Copy the deployed URL (e.g., `https://mindmash-api.onrender.com`)

**Using Railway:**
1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Set root directory to `backend`
4. Railway auto-detects Node.js
5. Deploy and copy URL

### Deploy Frontend (Vercel/Netlify)

**Using Vercel:**
1. Create account at [vercel.com](https://vercel.com)
2. Import Git repository
3. Settings:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variable:
   - Name: `VITE_SOCKET_URL`
   - Value: Your backend URL (e.g., `https://mindmash-api.onrender.com`)
5. Deploy!

**Using Netlify:**
1. Create account at [netlify.com](https://netlify.com)
2. New site from Git
3. Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Environment variables:
   - `VITE_SOCKET_URL` = your backend URL
5. Deploy!

### Post-Deployment

1. Update frontend `.env`:
```bash
VITE_SOCKET_URL=https://your-backend-url.com
```

2. Test the app:
   - Visit your deployed frontend URL
   - Create a room
   - Open incognito/another device
   - Join the room and play!

## 🎯 Game Mechanics

### Notification System (NEW):
- **Game Start**: Sound plays when host starts timer, browser notification appears
- **Auto-End**: Game automatically ends when timer hits 0 with sound notification
- **Manual Complete**: Player completes task early, gets sound confirmation
- **Meme Alerts**: Video memes play with full audio on opponent's screen

### Video Meme System (NEW):
- 3 built-in video memes with images
- Click thumbnail to send
- Full video + audio plays on opponent's screen
- Auto-dismisses after 3 seconds
- Located in `/frontend/public/memes/`

### Timer System:
- Host sets duration (1-60 minutes)
- Real-time countdown on all devices
- Synchronized using server timestamps
- **NEW**: Auto-ends with notification when time hits 0

### Winner Detection:
- First player to click "I'M DONE!" wins
- Results show finish times for all players
- Winner celebrates, loser faces penalty
- **NEW**: Completion triggers sound notification

### Room System:
- 6-character room codes
- Auto-generated on creation
- Max 2 players per room (for MVP)
- Host controls game settings

## 🔧 Development Tips

### Testing Multiplayer:
1. Run app locally
2. Open `localhost:3000` in normal browser
3. Open `localhost:3000` in incognito/another browser
4. Create room in one, join in other

### Adding Your Own Memes:
1. Add video file to `/frontend/public/memes/` (e.g., `mymeme.mp4`)
2. Add image thumbnail to `/frontend/public/memes/` (e.g., `mymeme.jpeg`)
3. Edit `frontend/src/components/GameScreen.jsx`:
```javascript
const MEMES = [
  { id: 1, name: 'aaagh', image: '/memes/aaagh.jpeg', video: '/memes/aaagh.mp4' },
  { id: 2, name: 'kioun_', image: '/memes/kioun_.jpeg', video: '/memes/kioun_.mp4' },
  { id: 3, name: 'ab_tu_dekh', image: '/memes/ab_tu_dekh.jpeg', video: '/memes/ab_tu_dekh.mp4' },
  { id: 4, name: 'mymeme', image: '/memes/mymeme.jpeg', video: '/memes/mymeme.mp4' }, // Add here!
];
```

### Customizing Sounds:
Edit notification sounds in `GameScreen.jsx`:
```javascript
const playNotificationSound = (type = 'beep') => {
  // Modify frequencies and patterns here
  oscillator.frequency.value = 440; // Change frequency
  gainNode.gain.value = 0.4; // Change volume
}
```

### Changing Colors:
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  neon: {
    blue: '#00f0ff',
    purple: '#b829ff',
    // Customize colors
  }
}
```

## 🐛 Troubleshooting

**"Room not found" error:**
- Check room code spelling
- Room might have expired (host disconnected)

**Timer not syncing:**
- Check internet connection
- Refresh both browsers
- Backend might be down

**Memes/Sounds not working:**
- **IMPORTANT**: Click anywhere on page first (browser autoplay policy)
- Check browser console for errors
- Try different browser
- Make sure video files are in `/public/memes/` folder

**Notifications not showing:**
- Allow browser notifications when prompted
- Check browser notification settings

**Video memes not playing:**
- Check video file format (MP4 recommended)
- Ensure files are in `/frontend/public/memes/`
- Check browser console for loading errors

## 📝 What's New in This Version

### ✨ Major Updates:
1. **Real Video Memes**: Replace emoji memes with actual video files
2. **Full Audio Support**: Videos play with sound on opponent's screen
3. **Game Start Notification**: Sound + notification when game begins
4. **Auto-End Game**: Timer automatically ends game at 0:00 with sound
5. **Completion Sounds**: Beep when player finishes task
6. **Browser Notifications**: Native notifications for game events

### 🎨 UI Improvements:
- Video meme overlay with blur background
- Smooth zoom animations for meme attacks
- Enhanced timer with low-time warning
- Better mobile responsiveness

### 🔧 Technical Improvements:
- Server-side game-end detection
- Automatic timeout management
- Better WebSocket event handling
- Improved audio playback system

## 🤝 Contributing

Want to make MindMash better?
1. Fork the repo
2. Create feature branch
3. Make your changes
4. Submit PR!

## 📄 License

MIT - do whatever you want with it!

## 🎉 Credits

Built with 🔥 for making productivity fun and competitive!

### Built-in Memes:
- aaagh - Classic reaction meme
- kioun_ - Pakistani meme magic
- ab_tu_dekh - Epic confrontation

---

**Need help?** Open an issue or reach out!

**Found a bug?** Report it - or better yet, fix it and PR! 💪

**Chai and Claude SLAAYYY!** 🔥🚀

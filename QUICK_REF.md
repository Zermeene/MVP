# 🎮 MINDMASH v3.0 - QUICK REFERENCE

## 🚀 QUICK START (2 Minutes)
```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
# Open http://localhost:3000
```

## 🎥 ADD MEMES (1 Minute)
```bash
# 1. Copy files
cp video.mp4 frontend/public/memes/
cp thumb.jpeg frontend/public/memes/

# 2. Edit GameScreen.jsx line ~10
{ id: 4, name: 'meme_name', image: '/memes/thumb.jpeg', video: '/memes/video.mp4' },

# 3. Done!
```

## 🌐 DEPLOY (30 Minutes)
```bash
# Backend: render.com
Root: backend, Command: npm start

# Frontend: vercel.com  
Root: frontend, Output: dist
Env: VITE_SOCKET_URL = backend_url

# Analytics: analytics.google.com
Get ID (G-XXX), add to Vercel as VITE_GA_TRACKING_ID
```

## 🔄 AUTO-DEPLOY
```bash
git add .
git commit -m "changes"
git push
# Wait 3 min → LIVE!
```

## 📊 ANALYTICS
```
analytics.google.com → MindMash → Realtime
See: Active users, games played, memes sent
```

## 🎯 KEY FILES
```
/frontend/public/memes/     ← Add videos here
/frontend/src/components/GameScreen.jsx ← Edit MEMES array (line 10)
/frontend/.env              ← Backend URL & Analytics ID
```

## 🐛 QUICK FIXES
**Sounds not working:** Click page once
**Videos stop at 3sec:** Updated! Now plays full video
**Can't scroll memes:** Added! Max 300px height
**Analytics not working:** Check VITE_GA_TRACKING_ID

## 📚 FULL DOCS
- **START_HERE_v3.md** → Complete overview
- **MEME_GUIDE.md** → Add/remove memes
- **DEPLOY_GUIDE.md** → Full deployment
- **README.md** → All features

## 💡 REMEMBER
✅ Videos play to END now (not 3 seconds)
✅ Unlimited scrollable memes
✅ Auto-deploy when you push
✅ Analytics tracks everything
✅ FREE deployment forever

**Chai and Claude SLAAYYY!** 🔥

import ReactGA from 'react-ga4';

// 🔥 ANALYTICS SETUP - Track app usage!
// Get your tracking ID from: https://analytics.google.com/

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

export const initAnalytics = () => {
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
    console.log('📊 Analytics initialized:', TRACKING_ID);
  } else {
    console.log('📊 Analytics not configured (set VITE_GA_TRACKING_ID in .env)');
  }
};

// Track page views
export const trackPageView = (page) => {
  if (TRACKING_ID) {
    ReactGA.send({ hitType: 'pageview', page });
  }
};

// Track custom events
export const trackEvent = (category, action, label = '') => {
  if (TRACKING_ID) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};

// Track game events
export const analytics = {
  // Room events
  roomCreated: (mode) => trackEvent('Room', 'Created', mode),
  roomJoined: (code) => trackEvent('Room', 'Joined', code),
  
  // Game events
  gameStarted: (mode, duration) => trackEvent('Game', 'Started', `${mode}-${duration}ms`),
  gameCompleted: (isWinner) => trackEvent('Game', 'Completed', isWinner ? 'Winner' : 'Loser'),
  gameAbandoned: () => trackEvent('Game', 'Abandoned'),
  
  // Meme events
  memeSent: (memeName) => trackEvent('Meme', 'Sent', memeName),
  memeReceived: (memeName) => trackEvent('Meme', 'Received', memeName),
  
  // User actions
  taskSet: (taskLength) => trackEvent('Config', 'Task Set', `${taskLength} chars`),
  timerSet: (minutes) => trackEvent('Config', 'Timer Set', `${minutes} min`),
};

export default analytics;

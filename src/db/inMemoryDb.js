// Initial seed data for the hackathon scenario
const initialUsers = [
  {
    id: 'user_ramesh',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    aadhaar: '123456789012',
    homeCity: 'Patna',
    currentCity: 'Patna',
    segment: 'worker',
    preferredLanguage: 'Hindi',
    accountStatus: 'dormant',
    balance: 2450.00
  },
  {
    id: 'user_priya',
    name: 'Priya Sharma',
    phone: '9876543211',
    aadhaar: '234567890123',
    homeCity: 'Ranchi',
    currentCity: 'Ranchi',
    segment: 'student',
    preferredLanguage: 'English',
    accountStatus: 'none',
    balance: 0.00
  },
  {
    id: 'user_anil',
    name: 'Anil Gowda',
    phone: '9876543212',
    aadhaar: '345678901234',
    homeCity: 'Mysuru',
    currentCity: 'Bengaluru',
    segment: 'worker',
    preferredLanguage: 'Kannada',
    accountStatus: 'active',
    balance: 12500.00
  }
];

// In-memory collections
let db = {
  users: JSON.parse(JSON.stringify(initialUsers)),
  signals: [],
  notifications: [],
  remittances: [],
  events: []
};

// Event listeners for SSE streaming
let sseClients = [];

export const inMemoryDb = {
  // Reset database to seed state
  reset: () => {
    db.users = JSON.parse(JSON.stringify(initialUsers));
    db.signals = [];
    db.notifications = [];
    db.remittances = [];
    db.events = [];
    inMemoryDb.logEvent('SYSTEM_RESET', 'Database reset to initial hackathon seed state');
    return true;
  },

  // Users
  getUsers: () => db.users,
  getUserById: (id) => db.users.find(u => u.id === id),
  getUserByPhone: (phone) => db.users.find(u => u.phone === phone),
  updateUser: (id, updates) => {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      db.users[userIndex] = { ...db.users[userIndex], ...updates };
      return db.users[userIndex];
    }
    return null;
  },
  createUser: (userData) => {
    const newUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      ...userData
    };
    db.users.push(newUser);
    return newUser;
  },

  // Signals
  getSignals: () => db.signals,
  addSignal: (signal) => {
    const newSignal = {
      id: 'sig_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...signal
    };
    db.signals.push(newSignal);
    return newSignal;
  },

  // Notifications
  getNotifications: () => db.notifications,
  addNotification: (notification) => {
    const newNotification = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...notification
    };
    db.notifications.push(newNotification);
    return newNotification;
  },

  // Remittances
  getRemittances: () => db.remittances,
  addRemittance: (remittance) => {
    const newRemittance = {
      id: 'rem_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      status: 'active',
      ...remittance
    };
    db.remittances.push(newRemittance);
    return newRemittance;
  },

  // Event Logs (For Real-time UI updates)
  getEvents: () => db.events,
  logEvent: (type, message, details = {}) => {
    const event = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type, // 'SIGNAL_RECEIVED' | 'CITY_CHANGE' | 'NOTIFICATION_SENT' | 'CBS_TRANSACTION' | etc.
      message,
      details
    };
    db.events.push(event);
    
    // Stream event to all active SSE clients
    sseClients.forEach(client => {
      client.res.write(`data: ${JSON.stringify(event)}\n\n`);
    });
    
    return event;
  },

  // SSE client registration
  registerSseClient: (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    sseClients.push(newClient);

    // Send initial connection event and current state
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Connected to NewCityAgent SSE Stream', timestamp: new Date() })}\n\n`);

    req.on('close', () => {
      sseClients = sseClients.filter(c => c.id !== clientId);
    });
  }
};

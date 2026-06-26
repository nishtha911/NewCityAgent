import express from 'express';
import { inMemoryDb } from '../db/inMemoryDb.js';
import { locationProcessor } from '../services/locationProcessor.js';
import { cbsService } from '../services/cbsService.js';

const router = express.Router();

/**
 * Handle errors elegantly
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ==========================================
// 📍 LOCATION SIGNALS ROUTE
// ==========================================

/**
 * Ingests a new location-based signal (UPI, ATM, SIM)
 */
router.post('/signals', asyncHandler(async (req, res) => {
  const { phone, source, city } = req.body;

  if (!phone || !source || !city) {
    return res.status(400).json({ error: 'phone, source, and city are required fields.' });
  }

  const result = await locationProcessor.processSignal(phone, source, city);
  res.status(200).json(result);
}));

// ==========================================
// 🏦 CORE BANKING SYSTEM (CBS) ROUTES
// ==========================================

/**
 * Check account status
 */
router.get('/accounts/:phone', asyncHandler(async (req, res) => {
  const { phone } = req.params;
  const result = cbsService.checkStatus(phone);
  res.status(200).json(result);
}));

/**
 * Initiate Aadhaar-based OTP reactivation
 */
router.post('/accounts/reactivate/initiate', asyncHandler(async (req, res) => {
  const { phone, aadhaar } = req.body;

  if (!phone || !aadhaar) {
    return res.status(400).json({ error: 'phone and aadhaar are required fields.' });
  }

  const result = cbsService.initiateReactivationOtp(phone, aadhaar);
  res.status(200).json(result);
}));

/**
 * Verify Aadhaar OTP and complete reactivation
 */
router.post('/accounts/reactivate/verify', asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'phone and otp are required fields.' });
  }

  const result = cbsService.verifyReactivationOtp(phone, otp);
  res.status(200).json(result);
}));

/**
 * Open a new Insta Savings Account
 */
router.post('/accounts/open', asyncHandler(async (req, res) => {
  const { phone, name, aadhaar, preferredLanguage, initialDeposit, currentCity, segment } = req.body;

  if (!phone || !name || !aadhaar) {
    return res.status(400).json({ error: 'phone, name, and aadhaar are required fields.' });
  }

  const result = cbsService.openAccount(phone, {
    name,
    aadhaar,
    preferredLanguage,
    initialDeposit,
    currentCity,
    segment
  });
  res.status(201).json(result);
}));

/**
 * Establish recurring remittance schedule
 */
router.post('/accounts/remittance', asyncHandler(async (req, res) => {
  const { phone, beneficiaryName, beneficiaryAccount, amount, frequency } = req.body;

  if (!phone || !beneficiaryName || !beneficiaryAccount || !amount) {
    return res.status(400).json({ error: 'phone, beneficiaryName, beneficiaryAccount, and amount are required.' });
  }

  const result = cbsService.createRemittanceSchedule(phone, {
    beneficiaryName,
    beneficiaryAccount,
    amount,
    frequency
  });
  res.status(201).json(result);
}));

// ==========================================
// ⚙️ DEMO & VISUALIZATION ROUTES
// ==========================================

/**
 * Get full in-memory state
 */
router.get('/demo/state', (req, res) => {
  res.status(200).json({
    users: inMemoryDb.getUsers(),
    signals: inMemoryDb.getSignals(),
    notifications: inMemoryDb.getNotifications(),
    remittances: inMemoryDb.getRemittances(),
    events: inMemoryDb.getEvents()
  });
});

/**
 * Reset database state
 */
router.post('/demo/reset', (req, res) => {
  inMemoryDb.reset();
  res.status(200).json({ success: true, message: 'Demo state reset successfully.' });
});

/**
 * Server-Sent Events (SSE) route for streaming live logs to dashboard
 */
router.get('/demo/events', (req, res) => {
  inMemoryDb.registerSseClient(req, res);
});

/**
 * Triggers a pre-packaged hackathon demo scenario
 */
router.post('/demo/trigger-scenario', asyncHandler(async (req, res) => {
  const { scenario } = req.body;

  if (scenario === 'migrant_worker') {
    // Ramesh moves Patna -> Bengaluru, gets triggered by ATM geolocation signal
    inMemoryDb.logEvent('SCENARIO_START', 'Scenario Activated: Migrant Worker Relocation (Ramesh Kumar)');
    
    const phone = '9876543210';
    const source = 'ATM';
    const city = 'Bengaluru';
    
    const result = await locationProcessor.processSignal(phone, source, city);
    
    inMemoryDb.logEvent('SCENARIO_NUDGE', 'Prompting user to click the notification and complete Aadhaar reactivation');
    
    return res.status(200).json({
      scenario: 'migrant_worker',
      user: 'Ramesh Kumar',
      phone,
      source,
      destinationCity: city,
      actionRequired: 'Aadhaar Reactivation',
      signalResult: result
    });
  } 
  
  if (scenario === 'student') {
    // Priya moves Ranchi -> Pune, gets triggered by SIM roaming signal
    inMemoryDb.logEvent('SCENARIO_START', 'Scenario Activated: Student Relocation (Priya Sharma)');
    
    const phone = '9876543211';
    const source = 'SIM';
    const city = 'Pune';
    
    const result = await locationProcessor.processSignal(phone, source, city);
    
    inMemoryDb.logEvent('SCENARIO_NUDGE', 'Prompting student to open a new digital Insta Savings Account');
    
    return res.status(200).json({
      scenario: 'student',
      user: 'Priya Sharma',
      phone,
      source,
      destinationCity: city,
      actionRequired: 'New Digital Account Onboarding',
      signalResult: result
    });
  }

  return res.status(400).json({ error: 'Invalid scenario name. Supported: migrant_worker, student' });
}));

export default router;

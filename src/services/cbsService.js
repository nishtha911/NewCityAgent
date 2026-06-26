import { inMemoryDb } from '../db/inMemoryDb.js';

// Simple cache to store generated Aadhaar OTPs in-memory (simulating a session cache)
const otpCache = new Map();

export const cbsService = {
  /**
   * Checks the core banking account status for a phone number
   * @param {string} phone 
   * @returns {Object} Account status details
   */
  checkStatus: (phone) => {
    const user = inMemoryDb.getUserByPhone(phone);
    if (!user) {
      throw new Error(`Account not found for phone number: ${phone}`);
    }

    inMemoryDb.logEvent('CBS_INQUIRY', `Checked account status for ${user.name}: ${user.accountStatus.toUpperCase()}`, {
      user: user.name,
      status: user.accountStatus
    });

    return {
      userId: user.id,
      name: user.name,
      accountStatus: user.accountStatus,
      balance: user.balance
    };
  },

  /**
   * Initiates Aadhaar OTP verification for reactivating a dormant account
   * @param {string} phone 
   * @param {string} aadhaar 
   * @returns {Object} Status and mock reference
   */
  initiateReactivationOtp: (phone, aadhaar) => {
    const user = inMemoryDb.getUserByPhone(phone);
    if (!user) {
      throw new Error(`Account not found for phone number: ${phone}`);
    }

    if (user.accountStatus !== 'dormant') {
      throw new Error(`Account is not dormant. Current status: ${user.accountStatus}`);
    }

    // Strip spaces and validate Aadhaar matches
    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    const cleanUserAadhaar = user.aadhaar.replace(/\s/g, '');

    if (cleanAadhaar !== cleanUserAadhaar) {
      inMemoryDb.logEvent('CBS_ERROR', `Aadhaar verification failed for ${user.name}. Input did not match.`, {
        user: user.name
      });
      throw new Error('Aadhaar number does not match registered details.');
    }

    // Generate a mock 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in cache for 5 minutes
    otpCache.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 mins
    });

    // In a hackathon demo, we also print the OTP in the event log so the user can copy-paste it!
    inMemoryDb.logEvent('AADHAAR_OTP_SENT', `Aadhaar OTP dispatched to registered mobile of ${user.name}`, {
      user: user.name,
      phone: `******${phone.slice(-4)}`,
      debugOtp: otp // Show the OTP in logs for easy testing
    });

    return {
      success: true,
      message: 'OTP sent successfully to registered mobile number.',
      phoneEnd: phone.slice(-4),
      debugOtp: otp // Included in response for automated testing or UI ease
    };
  },

  /**
   * Verifies the Aadhaar OTP and reactivates the dormant account
   * @param {string} phone 
   * @param {string} otp 
   * @returns {Object} Reactivation result
   */
  verifyReactivationOtp: (phone, otp) => {
    const user = inMemoryDb.getUserByPhone(phone);
    if (!user) {
      throw new Error(`Account not found for phone number: ${phone}`);
    }

    const cached = otpCache.get(phone);
    if (!cached) {
      throw new Error('No OTP request found. Please request a new OTP.');
    }

    if (Date.now() > cached.expiresAt) {
      otpCache.delete(phone);
      throw new Error('OTP has expired. Please request a new OTP.');
    }

    // Match OTP (allow '123456' as a universal testing bypass)
    if (cached.otp !== otp && otp !== '123456') {
      inMemoryDb.logEvent('CBS_ERROR', `Incorrect OTP entered for ${user.name}'s account reactivation`, {
        user: user.name
      });
      throw new Error('Incorrect OTP. Please try again.');
    }

    // Clear OTP from cache
    otpCache.delete(phone);

    // Reactivate account in DB
    inMemoryDb.updateUser(user.id, { accountStatus: 'active' });

    inMemoryDb.logEvent('CBS_TRANSACTION', `Account successfully REACTIVATED for ${user.name}`, {
      user: user.name,
      status: 'active'
    });

    return {
      success: true,
      message: 'Account successfully reactivated.',
      userId: user.id,
      accountStatus: 'active'
    };
  },

  /**
   * Opens a new digital account (Insta Savings Account)
   * @param {string} phone 
   * @param {Object} details - { name, aadhaar, preferredLanguage, initialDeposit }
   * @returns {Object} Newly created account details
   */
  openAccount: (phone, details) => {
    const existingUser = inMemoryDb.getUserByPhone(phone);
    
    let user;
    if (existingUser) {
      if (existingUser.accountStatus !== 'none') {
        throw new Error(`User already has an account with status: ${existingUser.accountStatus}`);
      }
      
      // Update existing user with details
      user = inMemoryDb.updateUser(existingUser.id, {
        name: details.name || existingUser.name,
        aadhaar: details.aadhaar || existingUser.aadhaar,
        preferredLanguage: details.preferredLanguage || existingUser.preferredLanguage,
        accountStatus: 'active',
        balance: parseFloat(details.initialDeposit || 0)
      });
    } else {
      // Create fresh user
      user = inMemoryDb.createUser({
        name: details.name,
        phone,
        aadhaar: details.aadhaar,
        homeCity: details.currentCity || 'Unknown',
        currentCity: details.currentCity || 'Unknown',
        segment: details.segment || 'worker',
        preferredLanguage: details.preferredLanguage || 'English',
        accountStatus: 'active',
        balance: parseFloat(details.initialDeposit || 0)
      });
    }

    inMemoryDb.logEvent('CBS_TRANSACTION', `New SBI Insta Savings Account opened for ${user.name}`, {
      user: user.name,
      accountNumber: `SBI${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      balance: user.balance
    });

    return {
      success: true,
      message: 'SBI Insta Account opened successfully.',
      userId: user.id,
      name: user.name,
      accountStatus: 'active',
      balance: user.balance
    };
  },

  /**
   * Sets up a recurring remittance schedule
   * @param {string} phone 
   * @param {Object} details - { beneficiaryName, beneficiaryAccount, amount, frequency }
   * @returns {Object} Remittance schedule confirmation
   */
  createRemittanceSchedule: (phone, details) => {
    const user = inMemoryDb.getUserByPhone(phone);
    if (!user) {
      throw new Error(`Account not found for phone number: ${phone}`);
    }

    if (user.accountStatus !== 'active') {
      throw new Error(`Cannot set up remittance on an inactive/dormant account. Current status: ${user.accountStatus}`);
    }

    const amount = parseFloat(details.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid remittance amount.');
    }

    // Verify balance is sufficient or log warning
    if (user.balance < amount) {
      inMemoryDb.logEvent('CBS_WARNING', `Insufficient balance for remittance setup. Current: ₹${user.balance}, Scheduled: ₹${amount}`);
    }

    // Register remittance in DB
    const remittance = inMemoryDb.addRemittance({
      userId: user.id,
      beneficiaryName: details.beneficiaryName,
      beneficiaryAccount: details.beneficiaryAccount,
      amount,
      frequency: details.frequency || 'monthly'
    });

    inMemoryDb.logEvent('REMITTANCE_SCHEDULED', `Remittance scheduled by ${user.name}: ₹${amount} to ${details.beneficiaryName} (${remittance.frequency})`, {
      user: user.name,
      beneficiary: details.beneficiaryName,
      amount,
      frequency: remittance.frequency
    });

    return {
      success: true,
      message: 'Recurring remittance schedule successfully established.',
      remittanceId: remittance.id,
      details: remittance
    };
  }
};

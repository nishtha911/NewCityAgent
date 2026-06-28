import { inMemoryDb } from '../db/inMemoryDb.js';
import { llmService } from './llmService.js';

export const locationProcessor = {
  /**
   * Processes a location-based signal (UPI, ATM, SIM) for a user
   * @param {string} phone - User's phone number
   * @param {string} source - 'UPI' | 'ATM' | 'SIM'
   * @param {string} city - The city where the event occurred
   * @returns {Promise<Object>} - Status of signal processing and whether a city change was triggered
   */
  processSignal: async (phone, source, city) => {
    // 1. Fetch user by phone
    const user = inMemoryDb.getUserByPhone(phone);
    if (!user) {
      inMemoryDb.logEvent('SIGNAL_ERROR', `Received location signal for unknown phone: ${phone}`);
      throw new Error(`User not found with phone number: ${phone}`);
    }

    // 2. Log the signal
    const signal = inMemoryDb.addSignal({
      userId: user.id,
      source,
      city
    });

    inMemoryDb.logEvent('SIGNAL_RECEIVED', `Signal [${source}] detected for ${user.name} in ${city}`, {
      user: user.name,
      source,
      city
    });

    const isCityChange = user.currentCity.toLowerCase() !== city.toLowerCase();

    if (isCityChange) {
      const oldCity = user.currentCity;
      
      // 3. Update user's current city
      inMemoryDb.updateUser(user.id, { currentCity: city });
      
      inMemoryDb.logEvent('CITY_CHANGE', `Relocation detected for ${user.name}: ${oldCity} ➡️ ${city}`, {
        user: user.name,
        from: oldCity,
        to: city
      });

      // 4. Trigger LLM Personalization Engine
      // Fetch latest user state
      const updatedUser = inMemoryDb.getUserById(user.id);
      const outreach = await llmService.generateOutreach(updatedUser, city);

      // 5. Store generated notification
      const notification = inMemoryDb.addNotification({
        userId: user.id,
        title: outreach.title,
        message: outreach.message,
        language: outreach.language,
        channel: source === 'SIM' ? 'SMS' : 'Push'
      });

      inMemoryDb.logEvent('NOTIFICATION_SENT', `Welcome notification dispatched to ${user.name} (${outreach.language})`, {
        user: user.name,
        title: outreach.title,
        message: outreach.message,
        channel: notification.channel
      });

      return {
        signalProcessed: true,
        cityChangeDetected: true,
        previousCity: oldCity,
        newCity: city,
        notification: {
          title: notification.title,
          message: notification.message,
          channel: notification.channel,
          language: notification.language
        }
      };
    }

    return {
      signalProcessed: true,
      cityChangeDetected: false,
      currentCity: user.currentCity
    };
  }
};

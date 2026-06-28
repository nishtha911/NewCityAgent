import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config.js';
import { inMemoryDb } from '../db/inMemoryDb.js';

// Pre-configured rich templates to act as high-quality fallbacks
// and to ensure perfect multilingual rendering when API key is not present.
const LOCALIZED_FALLBACKS = {
  Hindi: {
    worker: {
      title: 'बेंगलुरु में आपका स्वागत है! 🌸',
      message: 'नमस्ते {name} जी, बेंगलुरु में आपका स्वागत है! आपका SBI खाता देशव्यापी है। घर पैसे भेजने (Remittance) और स्थानीय UPI भुगतान तुरंत चालू करने के लिए यहाँ क्लिक करें। हम आपकी सुविधा के लिए यहाँ हैं।',
    },
    student: {
      title: 'बेंगलुरु में आपका स्वागत है! 🎓',
      message: 'नमस्ते {name}, नए शहर बेंगलुरु में आपकी पढ़ाई के सफर की शुभ शुरुआत! SBI स्टूडेंट सेविंग्स अकाउंट, तुरंत डिजिटल डेबिट कार्ड और आसान पॉकेट मनी ट्रांसफर का लाभ उठाने के लिए यहाँ टैप करें।',
    }
  },
  Kannada: {
    worker: {
      title: 'ಬೆಂಗಳೂರಿಗೆ ಸುಸ್ವಾಗತ! 🌸',
      message: 'ನಮಸ್ತೆ {name} ಅವರೇ, ಬೆಂಗಳೂರಿಗೆ ಸುಸ್ವಾಗತ! ನಿಮ್ಮ SBI ಖಾತೆಯು ದೇಶಾದ್ಯಂತ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ಮನೆಗೆ ಸುಲಭವಾಗಿ ಹಣ ಕಳುಹಿಸಲು (Remittance) ಮತ್ತು ಸ್ಥಳೀಯ UPI ಪಾವತಿಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ.',
    },
    student: {
      title: 'ಬೆಂಗಳೂರಿಗೆ ಸುಸ್ವಾಗತ! 🎓',
      message: 'ನಮಸ್ತೆ {name}, ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಿಮ್ಮ ವಿದ್ಯಾಭ್ಯಾಸದ ಪಯಣಕ್ಕೆ ಶುಭ ಹಾರೈಕೆಗಳು! ತ್ವರಿತ SBI ವಿದ್ಯಾರ್ಥಿ ಉಳಿತಾಯ ಖಾತೆ, ಡಿಜಿಟಲ್ ಡೆಬಿಟ್ ಕಾರ್ಡ್ ಪಡೆಯಲು ಮತ್ತು ಪೋಷಕರಿಂದ ಸುಲಭವಾಗಿ ಹಣ ಪಡೆಯಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ.',
    }
  },
  English: {
    worker: {
      title: 'Welcome to {city}! 💼',
      message: 'Hello {name}, welcome to {city}! Did you know your SBI account works nationwide? Tap here to instantly reactivate your account, set up hassle-free monthly remittances for your family, and register for local UPI QR payments.',
    },
    student: {
      title: 'Welcome to {city}! 🎓',
      message: 'Hi {name}, welcome to {city} for your studies! SBI is here to support you. Tap here to instantly open your SBI Insta Student Account, get a free virtual debit card, and pre-qualify for customized education loans.',
    }
  },
  Telugu: {
    worker: {
      title: 'బెంగళూరుకు సుస్వాగతం! 🌸',
      message: 'నమస్తే {name} గారు, బెంగళూరుకు సుస్వాగతం! మీ SBI ఖాతా దేశవ్యాప్తంగా పనిచేస్తుంది. మీ ఇంటికి సులభంగా డబ్బు పంపడానికి (Remittance) మరియు స్థానిక UPI చెల్లింపులను ప్రారంభించడానికి ఇక్కడ క్లిక్ చేయండి.',
    },
    student: {
      title: 'బెంగళూరుకు సుస్వాగతం! 🎓',
      message: 'నమస్తే {name}, బెంగళూరులో మీ విద్యా ప్రయాణానికి శుభాకాంక్షలు! SBI స్టూడెంట్ సేవింగ్స్ ఖాతా, ఉచిత డిజిటల్ డెబిట్ కార్డ్ పొందడానికి మరియు సులభంగా పాకెట్ మనీ ట్రాన్స్‌ఫర్ కోసం ఇక్కడ క్లిక్ చేయండి.',
    }
  }
};

export const llmService = {
  /**
   * Generates a highly personalized, localized, and multi-lingual outreach notification
   * @param {Object} user - The user record from the database
   * @param {string} destinationCity - The city they relocated to
   * @returns {Promise<Object>} - Notification object containing title, message, and language
   */
  generateOutreach: async (user, destinationCity) => {
    const { name, segment, preferredLanguage, accountStatus } = user;
    
    inMemoryDb.logEvent('LLM_REQUEST', `Requesting personalized notification for ${name} (${segment}) moving to ${destinationCity} in ${preferredLanguage}`);

    // If Gemini API Key is available, use LLM
    if (config.geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' }
        });

        const prompt = `
          You are a hyper-personalized agentic banking assistant for State Bank of India (SBI).
          Your task is to write a highly localized and empathetic mobile push notification/SMS welcoming a customer to a new city they have relocated to.
          
          Customer details:
          - Name: ${name}
          - Segment: ${segment === 'worker' ? 'Blue-collar internal migrant worker' : 'College student (Ages 18-24)'}
          - Relocating to: ${destinationCity}
          - Home City: ${user.homeCity}
          - Preferred Language: ${preferredLanguage}
          - Core Banking Account Status in SBI: ${accountStatus === 'dormant' ? 'Dormant (needs reactivation via Aadhaar OTP)' : accountStatus === 'none' ? 'No Account (needs new digital account opening)' : 'Active'}
          
          Guidelines:
          1. Empathy: The message must sound extremely warm, welcoming, and helpful. Moving to a new city is stressful; make them feel SBI is a friendly partner.
          2. Personalization: Mention their destination city, name, and speak to their specific situation.
             - For workers: Highlight sending money home safely to their families (remittance) and easy local UPI setup. Use a respectful tone (e.g., in Hindi, use "जी", "आप").
             - For students: Focus on student savings accounts, virtual debit cards, digital transactions, and education loans/pocket money. Keep it energetic and modern.
          3. Language: The output MUST be written in their preferred language (${preferredLanguage}), but using natural, conversational vocabulary. Use local scripts (Devanagari for Hindi, Kannada script for Kannada, etc.).
          4. Actionable: Include a clear call-to-action regarding their account status (reactivation or new account opening).
          
          Return a JSON object in this exact format:
          {
            "title": "A short, engaging, localized title with a friendly emoji",
            "message": "The personalized notification message, under 250 characters.",
            "language": "${preferredLanguage}"
          }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(text);
        
        inMemoryDb.logEvent('LLM_RESPONSE', `Gemini generated localized notification successfully in ${preferredLanguage}`, parsed);
        return parsed;
      } catch (error) {
        inMemoryDb.logEvent('LLM_ERROR', `Gemini API error, falling back to pre-seeded templates. Error: ${error.message}`);
        // Fall back to template if API error occurs
      }
    } else {
      inMemoryDb.logEvent('LLM_FALLBACK', `No Gemini API key found, using high-quality local templates for ${preferredLanguage}`);
    }

    // High-quality localized template fallback
    const langTemplates = LOCALIZED_FALLBACKS[preferredLanguage] || LOCALIZED_FALLBACKS['English'];
    const segmentTemplate = langTemplates[segment] || langTemplates['worker'];
    
    // Interpolate values
    let title = segmentTemplate.title
      .replace('{name}', name)
      .replace('{city}', destinationCity);
    let message = segmentTemplate.message
      .replace('{name}', name)
      .replace('{city}', destinationCity);

    // Dynamic addition depending on account status
    if (accountStatus === 'dormant') {
      if (preferredLanguage === 'Hindi') {
        message += ' अपना निष्क्रिय खाता आधार OTP द्वारा तुरंत चालू करें।';
      } else if (preferredLanguage === 'Kannada') {
        message += ' ನಿಮ್ಮ ನಿಷ್ಕ್ರಿಯ ಖಾತೆಯನ್ನು ಆಧಾರ್ ಒಟಿಪಿ ಮೂಲಕ ತಕ್ಷಣ ಸಕ್ರಿಯಗೊಳಿಸಿ.';
      } else {
        message += ' Reactivate your dormant account instantly via Aadhaar OTP.';
      }
    } else if (accountStatus === 'none') {
      if (preferredLanguage === 'Hindi') {
        message += ' केवल 2 मिनट में अपना नया डिजिटल खाता खोलें।';
      } else if (preferredLanguage === 'Kannada') {
        message += ' ಕೇವಲ 2 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ಹೊಸ ಡಿಜಿಟಲ್ ಖಾತೆಯನ್ನು ತೆರೆಯಿರಿ.';
      } else {
        message += ' Open your new digital savings account in just 2 minutes.';
      }
    }

    const output = {
      title,
      message,
      language: preferredLanguage
    };

    inMemoryDb.logEvent('LLM_RESPONSE_LOCAL', `Successfully rendered localized template in ${preferredLanguage}`, output);
    return output;
  }
};

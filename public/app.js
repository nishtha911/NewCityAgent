// ==========================================================================
// NEWCITYAGENT CLIENT APP (DASHBOARD & PLAYGROUND LOGIC)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const triggerWorkerBtn = document.getElementById('trigger-worker-btn');
  const triggerStudentBtn = document.getElementById('trigger-student-btn');
  const resetBtn = document.getElementById('reset-btn');
  const clearTerminalBtn = document.getElementById('clear-terminal-btn');
  const refreshDbBtn = document.getElementById('refresh-db-btn');
  const terminalOutput = document.getElementById('terminal-output');

  // Phone Views
  const views = {
    lock: document.getElementById('phone-lock-screen'),
    reactivate: document.getElementById('phone-reactivation-screen'),
    remittance: document.getElementById('phone-remittance-screen'),
    student: document.getElementById('phone-student-screen'),
    success: document.getElementById('phone-success-screen')
  };

  // Phone Interactive Controls
  const notificationBanner = document.getElementById('notification-banner');
  const notifAlertTitle = document.getElementById('notif-alert-title');
  const notifAlertMsg = document.getElementById('notif-alert-msg');
  
  // Reactivation Form
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  const otpEntrySection = document.getElementById('otp-entry-section');
  const reactivatePhone = document.getElementById('reactivate-phone');
  const reactivateAadhaar = document.getElementById('reactivate-aadhaar');
  const reactivateOtp = document.getElementById('reactivate-otp');

  // Remittance Form
  const scheduleRemitBtn = document.getElementById('schedule-remit-btn');
  const remitName = document.getElementById('remit-name');
  const remitAccount = document.getElementById('remit-account');
  const remitAmount = document.getElementById('remit-amount');
  const remitFrequency = document.getElementById('remit-frequency');

  // Student Form
  const openStudentBtn = document.getElementById('open-student-btn');
  const studentName = document.getElementById('student-name');
  const studentPhone = document.getElementById('student-phone');
  const studentAadhaar = document.getElementById('student-aadhaar');
  const studentLang = document.getElementById('student-lang');
  const studentDeposit = document.getElementById('student-deposit');

  // Success Screen
  const successDescription = document.getElementById('success-description');
  const featureRemitItem = document.getElementById('feature-remit-item');
  const featureLoanItem = document.getElementById('feature-loan-item');
  const exitSuccessBtn = document.getElementById('exit-success-btn');

  // Database Explorer Tables
  const dbUsersBody = document.getElementById('db-users-body');
  const dbNotificationsBody = document.getElementById('db-notifications-body');
  const dbRemittancesBody = document.getElementById('db-remittances-body');

  // State
  let currentScenario = null; // 'worker' or 'student'
  let currentActivePhone = '';
  let eventSource = null;

  // --- Initialize Application ---
  initSse();
  fetchDatabaseState();
  setupTabs();
  setupBackButtons();

  // --- SSE Event Stream Connection ---
  function initSse() {
    if (eventSource) {
      eventSource.close();
    }

    // Connect to backend SSE endpoint
    eventSource = new EventSource('/api/demo/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      logEventToTerminal(data);
      // Refresh DB state on any relevant transaction/state-changing event
      if (['SIGNAL_RECEIVED', 'CITY_CHANGE', 'NOTIFICATION_SENT', 'REMITTANCE_SCHEDULED', 'CBS_TRANSACTION', 'SYSTEM_RESET'].includes(data.type)) {
        fetchDatabaseState();
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      logTextToTerminal('SYSTEM_ERROR', 'Disconnected from SSE stream. Retrying connection...');
    };
  }

  // --- Helper: Log Events in Terminal Window ---
  function logEventToTerminal(event) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    // Format timestamp
    const timeStr = new Date(event.timestamp).toLocaleTimeString();
    const prefix = `[${timeStr}] [${event.type}] `;

    // Apply color styling based on event type
    if (event.type.includes('ERROR')) {
      line.classList.add('error-msg');
    } else if (event.type.includes('WARNING')) {
      line.classList.add('warning-msg');
    } else if (['CITY_CHANGE', 'NOTIFICATION_SENT', 'REMITTANCE_SCHEDULED', 'CBS_TRANSACTION'].includes(event.type)) {
      line.classList.add('success-msg');
    } else {
      line.classList.add('info-msg');
    }

    line.innerText = prefix + event.message;

    // Append JSON details if present
    if (event.details && Object.keys(event.details).length > 0) {
      const jsonBlock = document.createElement('pre');
      jsonBlock.className = 'json-data';
      jsonBlock.innerText = JSON.stringify(event.details, null, 2);
      line.appendChild(jsonBlock);
    }

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function logTextToTerminal(type, message) {
    logEventToTerminal({
      type,
      message,
      timestamp: new Date(),
      details: {}
    });
  }

  // --- API Calls ---

  // 1. Fetch current database state
  async function fetchDatabaseState() {
    try {
      const res = await fetch('/api/demo/state');
      const data = await res.json();
      
      populateUsersTable(data.users);
      populateNotificationsTable(data.notifications);
      populateRemittancesTable(data.remittances);
    } catch (err) {
      console.error('Error fetching database state:', err);
      logTextToTerminal('SYSTEM_ERROR', 'Failed to fetch database state from backend.');
    }
  }

  // 2. Trigger Scenario
  async function triggerScenario(scenarioName) {
    try {
      // Reset first to ensure clean execution
      await resetDemoState(true);
      
      logTextToTerminal('SCENARIO_START', `Triggering scenario: ${scenarioName.toUpperCase()}`);
      
      const res = await fetch('/api/demo/trigger-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioName })
      });
      const data = await res.json();
      
      currentScenario = scenarioName;
      currentActivePhone = data.phone;

      // Update Phone Lock Screen Notification
      const signalResult = data.signalResult;
      if (signalResult && signalResult.notification) {
        notifAlertTitle.innerText = signalResult.notification.title;
        notifAlertMsg.innerText = signalResult.notification.message;
        
        // Show notification banner on lock screen
        notificationBanner.classList.remove('hidden');
        
        // Make the phone go to Lock Screen view first
        switchPhoneView('lock');
        
        // Update form values based on who is relocating
        if (scenarioName === 'migrant_worker') {
          reactivatePhone.value = data.phone;
        } else if (scenarioName === 'student') {
          studentPhone.value = data.phone;
        }
      }
    } catch (err) {
      console.error('Error triggering scenario:', err);
      logTextToTerminal('SYSTEM_ERROR', `Failed to trigger scenario: ${scenarioName}`);
    }
  }

  // 3. Reset Demo State
  async function resetDemoState(silent = false) {
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      const data = await res.json();
      
      if (!silent) {
        logTextToTerminal('SYSTEM_RESET', 'Database state has been reset successfully.');
      }
      
      // Reset UI states
      notificationBanner.classList.add('hidden');
      otpEntrySection.classList.remove('visible');
      reactivateOtp.value = '';
      currentScenario = null;
      currentActivePhone = '';
      
      // Go back to lock screen
      switchPhoneView('lock');
      fetchDatabaseState();
    } catch (err) {
      console.error('Error resetting demo state:', err);
      logTextToTerminal('SYSTEM_ERROR', 'Failed to reset database state.');
    }
  }

  // --- Render Tables ---

  function populateUsersTable(users) {
    dbUsersBody.innerHTML = '';
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${user.name}</strong></td>
        <td>
          <div class="font-mono text-xs">${user.phone}</div>
          <span class="badge badge-${user.segment}">${user.segment}</span>
        </td>
        <td>${user.preferredLanguage}</td>
        <td>
          <span class="text-secondary">${user.homeCity}</span> 
          <i class="fa-solid fa-arrow-right text-muted text-xs"></i> 
          <span class="text-primary-light font-medium">${user.currentCity}</span>
        </td>
        <td><span class="badge badge-${user.accountStatus}">${user.accountStatus}</span></td>
        <td class="font-mono font-medium">₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      `;
      dbUsersBody.appendChild(tr);
    });
  }

  function populateNotificationsTable(notifications) {
    dbNotificationsBody.innerHTML = '';
    if (notifications.length === 0) {
      dbNotificationsBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No notifications dispatched yet.</td></tr>`;
      return;
    }
    
    notifications.forEach(n => {
      const user = n.userId === 'user_ramesh' ? 'Ramesh Kumar' : n.userId === 'user_priya' ? 'Priya Sharma' : n.userId === 'user_anil' ? 'Anil Gowda' : 'Unknown';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${user}</strong></td>
        <td><span class="badge badge-channel"><i class="fa-solid ${n.channel === 'SMS' ? 'fa-message' : 'fa-bell'}"></i> ${n.channel}</span></td>
        <td>${n.language}</td>
        <td>
          <div class="font-medium text-white">${n.title}</div>
          <div class="text-secondary text-xs mt-1" style="max-width: 250px; white-space: normal;">${n.message}</div>
        </td>
        <td class="font-mono text-xs text-muted">${new Date(n.timestamp).toLocaleTimeString()}</td>
      `;
      dbNotificationsBody.appendChild(tr);
    });
  }

  function populateRemittancesTable(remittances) {
    dbRemittancesBody.innerHTML = '';
    if (remittances.length === 0) {
      dbRemittancesBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No remittance schedules active.</td></tr>`;
      return;
    }

    remittances.forEach(r => {
      const user = r.userId === 'user_ramesh' ? 'Ramesh Kumar' : r.userId === 'user_anil' ? 'Anil Gowda' : 'Unknown';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${user}</strong></td>
        <td>${r.beneficiaryName}</td>
        <td class="font-mono">${r.beneficiaryAccount}</td>
        <td class="font-mono text-success font-medium">₹${r.amount.toLocaleString('en-IN')}</td>
        <td class="capitalize">${r.frequency}</td>
        <td><span class="badge badge-active">${r.status}</span></td>
      `;
      dbRemittancesBody.appendChild(tr);
    });
  }

  // --- Phone View Switcher ---
  function switchPhoneView(viewName) {
    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.add('active');
      } else {
        views[key].classList.remove('active');
      }
    });
  }

  // --- Event Handlers & Click Bindings ---

  // Trigger Scenarios
  triggerWorkerBtn.addEventListener('click', () => {
    triggerWorkerBtn.classList.add('active');
    triggerStudentBtn.classList.remove('active');
    triggerScenario('migrant_worker');
  });

  triggerStudentBtn.addEventListener('click', () => {
    triggerStudentBtn.classList.add('active');
    triggerWorkerBtn.classList.remove('active');
    triggerScenario('student');
  });

  // Reset & Clear
  resetBtn.addEventListener('click', () => {
    triggerWorkerBtn.classList.remove('active');
    triggerStudentBtn.classList.remove('active');
    resetDemoState();
  });

  clearTerminalBtn.addEventListener('click', () => {
    terminalOutput.innerHTML = '<div class="terminal-line system-msg">[SYSTEM] Terminal logs cleared.</div>';
  });

  refreshDbBtn.addEventListener('click', () => {
    fetchDatabaseState();
    logTextToTerminal('SYSTEM_INFO', 'Manually refreshed database state explorer.');
  });

  // Tap Lock Screen Notification
  notificationBanner.addEventListener('click', () => {
    notificationBanner.classList.add('hidden');
    if (currentScenario === 'migrant_worker') {
      switchPhoneView('reactivate');
    } else if (currentScenario === 'student') {
      switchPhoneView('student');
    }
  });

  // Tap Lock screen directly (fallback entry)
  views.lock.addEventListener('click', (e) => {
    // If not clicking the notification banner itself, still let them bypass lock if scenario is active
    if (!notificationBanner.contains(e.target) && currentScenario) {
      notificationBanner.classList.add('hidden');
      if (currentScenario === 'migrant_worker') {
        switchPhoneView('reactivate');
      } else if (currentScenario === 'student') {
        switchPhoneView('student');
      }
    }
  });

  // Reactivation Flow: Send OTP
  sendOtpBtn.addEventListener('click', async () => {
    const phone = reactivatePhone.value;
    const aadhaar = reactivateAadhaar.value.replace(/\s/g, '');

    if (!aadhaar || aadhaar.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    try {
      const res = await fetch('/api/accounts/reactivate/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, aadhaar })
      });
      const data = await res.json();

      if (res.ok) {
        otpEntrySection.classList.add('visible');
        // Pre-fill generated OTP in UI for high-speed demo flow convenience
        reactivateOtp.value = data.debugOtp;
        logTextToTerminal('CBS_OTP_RECEIVED', `Aadhaar OTP is: ${data.debugOtp} (auto-filled for demo convenience)`);
      } else {
        alert(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('OTP send error:', err);
      alert('Error communicating with core banking system.');
    }
  });

  // Reactivation Flow: Verify OTP
  verifyOtpBtn.addEventListener('click', async () => {
    const phone = reactivatePhone.value;
    const otp = reactivateOtp.value;

    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      const res = await fetch('/api/accounts/reactivate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();

      if (res.ok) {
        // Success! Go to step 2: Remittance
        switchPhoneView('remittance');
      } else {
        alert(data.error || 'Incorrect OTP.');
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      alert('Verification error.');
    }
  });

  // Remittance Flow: Schedule
  scheduleRemitBtn.addEventListener('click', async () => {
    const phone = reactivatePhone.value;
    const name = remitName.value;
    const account = remitAccount.value;
    const amount = remitAmount.value;
    const frequency = remitFrequency.value;

    if (!name || !account || !amount || amount <= 0) {
      alert('Please fill out all remittance fields correctly.');
      return;
    }

    try {
      const res = await fetch('/api/accounts/remittance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          beneficiaryName: name,
          beneficiaryAccount: account,
          amount,
          frequency
        })
      });
      const data = await res.json();

      if (res.ok) {
        // Successfully scheduled! Go to success screen
        successDescription.innerText = `Congratulations! Your SBI Savings Account is now fully active, and your recurring monthly remittance of ₹${parseFloat(amount).toLocaleString()} to ${name} has been set up.`;
        
        featureRemitItem.classList.remove('hidden');
        featureLoanItem.classList.add('hidden'); // Hide student specific features
        
        switchPhoneView('success');
      } else {
        alert(data.error || 'Failed to schedule remittance.');
      }
    } catch (err) {
      console.error('Remittance schedule error:', err);
      alert('Failed to establish remittance schedule.');
    }
  });

  // Student Flow: Open Account
  openStudentBtn.addEventListener('click', async () => {
    const phone = studentPhone.value;
    const name = studentName.value;
    const aadhaar = studentAadhaar.value;
    const lang = studentLang.value;
    const deposit = studentDeposit.value;

    if (!name || !aadhaar || aadhaar.length < 12) {
      alert('Please enter your full name and a valid Aadhaar number.');
      return;
    }

    try {
      const res = await fetch('/api/accounts/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name,
          aadhaar,
          preferredLanguage: lang,
          initialDeposit: deposit,
          currentCity: 'Pune', // Locked to scenario
          segment: 'student'
        })
      });
      const data = await res.json();

      if (res.ok) {
        // Success! Show student onboarding completion screen
        successDescription.innerText = `Congratulations Priya! Your SBI Insta Student Savings Account has been opened successfully. Your digital YONO wallet is loaded with ₹${parseFloat(deposit).toLocaleString()}.`;
        
        featureRemitItem.classList.add('hidden'); // Hide worker specific features
        featureLoanItem.classList.remove('hidden'); // Show student pre-approved loan
        
        switchPhoneView('success');
      } else {
        alert(data.error || 'Account opening failed.');
      }
    } catch (err) {
      console.error('Student account opening error:', err);
      alert('Error opening digital account.');
    }
  });

  // Exit Success Screen
  exitSuccessBtn.addEventListener('click', () => {
    resetDemoState(true);
    triggerWorkerBtn.classList.remove('active');
    triggerStudentBtn.classList.remove('active');
  });

  // --- Tabs Navigation in Database Explorer ---
  function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Remove active class from buttons and panels
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked button and target panel
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });
  }

  // --- Back buttons inside app headers ---
  function setupBackButtons() {
    const backButtons = document.querySelectorAll('.phone-back-btn');
    backButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchPhoneView(target);
      });
    });
  }
});

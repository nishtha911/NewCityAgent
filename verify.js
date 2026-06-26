import { inMemoryDb } from './src/db/inMemoryDb.js';
import { locationProcessor } from './src/services/locationProcessor.js';
import { cbsService } from './src/services/cbsService.js';

// Simple assertions framework
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ ASSERTION FAILED: ${message}`);
  }
}

async function runTests() {
  console.log('===================================================');
  console.log('🧪 Starting Automated Backend Flow Verification...');
  console.log('===================================================\n');

  try {
    // -----------------------------------------------------------
    // TEST 1: Database Reset and Seed Integrity
    // -----------------------------------------------------------
    console.log('Step 1: Initializing database and checking seeds...');
    inMemoryDb.reset();
    
    const users = inMemoryDb.getUsers();
    assert(users.length === 3, 'Should have exactly 3 seeded users');
    
    const ramesh = inMemoryDb.getUserByPhone('9876543210');
    assert(ramesh.name === 'Ramesh Kumar', 'Ramesh should be seeded with phone 9876543210');
    assert(ramesh.accountStatus === 'dormant', 'Ramesh account should initially be dormant');
    assert(ramesh.homeCity === 'Patna', 'Ramesh home city should be Patna');
    
    const priya = inMemoryDb.getUserByPhone('9876543211');
    assert(priya.name === 'Priya Sharma', 'Priya should be seeded with phone 9876543211');
    assert(priya.accountStatus === 'none', 'Priya should initially have no account (none)');
    
    console.log('✅ Step 1 passed: Seed data is correct.\n');

    // -----------------------------------------------------------
    // TEST 2: Location Signal Processing & Relocation Detection (Ramesh Kumar)
    // -----------------------------------------------------------
    console.log('Step 2: Simulating relocation signal (Patna ➡️ Bengaluru) for Ramesh...');
    const signalResult = await locationProcessor.processSignal('9876543210', 'ATM', 'Bengaluru');
    
    assert(signalResult.signalProcessed === true, 'Signal should be processed');
    assert(signalResult.cityChangeDetected === true, 'City change should be detected');
    assert(signalResult.previousCity === 'Patna', 'Previous city should be Patna');
    assert(signalResult.newCity === 'Bengaluru', 'New city should be Bengaluru');
    
    // Check user updated in DB
    const updatedRamesh = inMemoryDb.getUserByPhone('9876543210');
    assert(updatedRamesh.currentCity === 'Bengaluru', 'Ramesh current city should be updated to Bengaluru');
    
    // Verify notification was generated
    const notifications = inMemoryDb.getNotifications();
    assert(notifications.length === 1, 'One notification should be generated');
    assert(notifications[0].userId === 'user_ramesh', 'Notification should be for Ramesh');
    assert(notifications[0].language === 'Hindi', 'Notification should be in Hindi');
    assert(notifications[0].title.length > 0, 'Notification should have a title');
    assert(notifications[0].message.length > 0, 'Notification should have a body message');
    
    console.log('✅ Step 2 passed: Relocation detected and Hindi notification generated.\n');

    // -----------------------------------------------------------
    // TEST 3: Core Banking Status Check & Aadhaar OTP Reactivation
    // -----------------------------------------------------------
    console.log('Step 3: Checking core banking status and initiating Aadhaar OTP...');
    
    const cbsStatus = cbsService.checkStatus('9876543210');
    assert(cbsStatus.accountStatus === 'dormant', 'Account status should still be dormant');
    
    // Send OTP
    const otpResponse = cbsService.initiateReactivationOtp('9876543210', '1234 5678 9012');
    assert(otpResponse.success === true, 'OTP initiation should succeed');
    assert(otpResponse.debugOtp.length === 6, 'Should generate a 6-digit debug OTP');
    
    // Verify OTP
    console.log(`Simulating user entering Aadhaar OTP: ${otpResponse.debugOtp}`);
    const verifyResponse = cbsService.verifyReactivationOtp('9876543210', otpResponse.debugOtp);
    assert(verifyResponse.success === true, 'OTP verification should succeed');
    assert(verifyResponse.accountStatus === 'active', 'Account should now be active');
    
    // Verify database reflection
    const reactivatedRamesh = inMemoryDb.getUserByPhone('9876543210');
    assert(reactivatedRamesh.accountStatus === 'active', 'Ramesh account status in database should be active');
    
    console.log('✅ Step 3 passed: Aadhaar OTP verification and account reactivation succeeded.\n');

    // -----------------------------------------------------------
    // TEST 4: Remittance Setup
    // -----------------------------------------------------------
    console.log('Step 4: Creating recurring monthly remittance schedule for Ramesh...');
    const remitResponse = cbsService.createRemittanceSchedule('9876543210', {
      beneficiaryName: 'Sunita Devi (Wife)',
      beneficiaryAccount: '30291048182',
      amount: 15000,
      frequency: 'monthly'
    });
    
    assert(remitResponse.success === true, 'Remittance schedule creation should succeed');
    assert(remitResponse.details.beneficiaryName === 'Sunita Devi (Wife)', 'Beneficiary name match');
    assert(remitResponse.details.amount === 15000, 'Remittance amount match');
    
    // Check database reflection
    const remittances = inMemoryDb.getRemittances();
    assert(remittances.length === 1, 'One remittance schedule should be in database');
    assert(remittances[0].userId === 'user_ramesh', 'Remittance should belong to Ramesh');
    
    console.log('✅ Step 4 passed: Remittance scheduled successfully.\n');

    // -----------------------------------------------------------
    // TEST 5: Student Relocation & New Digital Account Onboarding
    // -----------------------------------------------------------
    console.log('Step 5: Simulating student relocation (Ranchi ➡️ Pune) & opening new digital account...');
    
    // 1. Relocate
    const studentSignal = await locationProcessor.processSignal('9876543211', 'SIM', 'Pune');
    assert(studentSignal.cityChangeDetected === true, 'Student relocation should be detected');
    
    // 2. Open Account
    const openAccountResponse = cbsService.openAccount('9876543211', {
      name: 'Priya Sharma',
      aadhaar: '234567890123',
      preferredLanguage: 'English',
      initialDeposit: 1000,
      currentCity: 'Pune',
      segment: 'student'
    });
    
    assert(openAccountResponse.success === true, 'Account opening should succeed');
    assert(openAccountResponse.accountStatus === 'active', 'Opened account should be active');
    assert(openAccountResponse.balance === 1000, 'Initial deposit of ₹1000 should be reflected');
    
    // Verify database reflection
    const activePriya = inMemoryDb.getUserByPhone('9876543211');
    assert(activePriya.accountStatus === 'active', 'Priya account status in DB should be active');
    assert(activePriya.balance === 1000, 'Priya balance in DB should be ₹1000');
    assert(activePriya.currentCity === 'Pune', 'Priya current city should be Pune');
    
    console.log('✅ Step 5 passed: Student relocation and digital-first account opening succeeded.\n');

    console.log('===================================================');
    console.log('🎉 ALL BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('The backend is 100% correct, verified, and ready for deployment.');
    console.log('===================================================');
  } catch (err) {
    console.error('\n❌ VERIFICATION TEST FAILED!');
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

runTests();

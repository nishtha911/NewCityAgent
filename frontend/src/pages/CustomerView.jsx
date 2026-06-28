import React, { useState, useEffect } from 'react';
import { getState, reactivateAccount, setupRemittance } from '../services/api';
import { Smartphone, CheckCircle, ShieldAlert } from 'lucide-react';

export default function CustomerView() {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [otp, setOtp] = useState('');
  
  // Remittance state
  const [remittanceData, setRemittanceData] = useState({
    beneficiaryName: '',
    beneficiaryAccount: '',
    amount: ''
  });

  const fetchState = async () => {
    const data = await getState();
    if (data.users && data.users.length > 0) {
      // Find the latest notification, if any
      const latestNotif = data.notifications.length > 0 ? data.notifications[data.notifications.length - 1] : null;
      
      let targetUser = null;
      if (latestNotif) {
        // If there's a notification, show the simulator for that specific user
        targetUser = data.users.find(u => u.phone === latestNotif.phone);
        setNotification(latestNotif);
      }
      
      // Only set user if there is an active scenario (a notification was sent)
      // If no notification, we keep user null to show the "Waiting for signals" screen
      setUser(targetUser || null);
    }
  };

  useEffect(() => {
    // Poll for state changes every few seconds to simulate pushing to mobile
    const interval = setInterval(fetchState, 3000);
    fetchState();
    return () => clearInterval(interval);
  }, []);

  const handleReactivate = async () => {
    if (!user) return;
    try {
      await reactivateAccount(user.phone, otp);
      alert('Account Successfully Reactivated!');
      fetchState();
    } catch(e) {
      alert('Error reactivating');
    }
  };

  const handleRemittance = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setupRemittance({ phone: user.phone, ...remittanceData });
      alert('Remittance Schedule Created Successfully!');
      fetchState();
    } catch(e) {
      alert('Error creating remittance');
    }
  };

  return (
    <div style={{ padding: '40px 80px', display: 'flex', justifyContent: 'center' }}>
      
      {/* Simulated Android Device */}
      <div style={{
        width: '360px',
        height: '740px',
        border: '14px solid #1a1a1a',
        borderRadius: '24px', /* Less rounded for Android feel */
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Android Status Bar */}
        <div style={{ 
          background: 'var(--bg-topbar)', 
          color: 'white', 
          padding: '8px 16px', 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          borderBottom: '1px solid #333'
        }}>
          <span>10:00 AM</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Smartphone size={14} />
          </div>
        </div>

        {/* App Header */}
        <div style={{ background: 'var(--primary-purple)', color: 'white', padding: '15px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>NewCityAgent</h2>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {!user ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>
              <div style={{ margin: '0 auto 20px', width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--text-secondary)', borderTopColor: 'var(--primary-purple)', animation: 'spin 1s linear infinite' }} />
              <p>Waiting for agent signals...</p>
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>Trigger a scenario in the Admin Dashboard.</p>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: '5px' }}>Hi, {user.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status: 
                <span style={{ 
                  color: user.status === 'dormant' ? '#e74c3c' : '#2ecc71',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {user.status.toUpperCase()}
                </span>
              </p>

              {/* AI Notification Card */}
              {notification && (
                <div style={{
                  background: 'var(--gradient-banner)',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  <strong>Agent Alert</strong>
                  <p style={{ marginTop: '5px' }}>{notification.message}</p>
                </div>
              )}

              {/* Dormant Reactivation Flow */}
              {user.status === 'dormant' && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', color: '#e74c3c' }}>
                    <ShieldAlert size={20} />
                    <strong>Aadhaar Reactivation Required</strong>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter Aadhaar OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--card-border)',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}
                  />
                  <button 
                    onClick={handleReactivate}
                    style={{
                      width: '100%',
                      background: 'var(--primary-purple)',
                      color: 'white',
                      padding: '10px',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    Verify & Reactivate
                  </button>
                </div>
              )}

              {/* Remittance Setup Flow (Only if Active) */}
              {user.status === 'active' && user.segment === 'migrant_worker' && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', color: 'var(--secondary-magenta)' }}>
                    <CheckCircle size={20} />
                    <strong>Send Money Home</strong>
                  </div>
                  <form onSubmit={handleRemittance}>
                    <input 
                      type="text" placeholder="Beneficiary Name" required
                      value={remittanceData.beneficiaryName}
                      onChange={e => setRemittanceData({...remittanceData, beneficiaryName: e.target.value})}
                      style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid var(--card-border)', borderRadius: '4px' }}
                    />
                    <input 
                      type="text" placeholder="Account Number" required
                      value={remittanceData.beneficiaryAccount}
                      onChange={e => setRemittanceData({...remittanceData, beneficiaryAccount: e.target.value})}
                      style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid var(--card-border)', borderRadius: '4px' }}
                    />
                    <input 
                      type="number" placeholder="Amount (₹)" required
                      value={remittanceData.amount}
                      onChange={e => setRemittanceData({...remittanceData, amount: e.target.value})}
                      style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid var(--card-border)', borderRadius: '4px' }}
                    />
                    <button 
                      type="submit"
                      style={{
                        width: '100%',
                        background: 'var(--secondary-magenta)',
                        color: 'white',
                        padding: '10px',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}
                    >
                      Setup Transfer
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>

        {/* Android Navigation Bar */}
        <div style={{
          height: '48px',
          background: '#000',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: '1px solid #222'
        }}>
          {/* Back button (triangle) */}
          <div style={{ width: '0', height: '0', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid #888' }} />
          {/* Home button (circle) */}
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #888' }} />
          {/* Recent apps button (square) */}
          <div style={{ width: '14px', height: '14px', border: '2px solid #888', borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  );
}

export const triggerScenario = async (scenario) => {
  const res = await fetch('/api/demo/trigger-scenario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario })
  });
  return res.json();
};

export const resetState = async () => {
  const res = await fetch('/api/demo/reset', { method: 'POST' });
  return res.json();
};

export const getState = async () => {
  const res = await fetch('/api/demo/state');
  return res.json();
};

export const reactivateAccount = async (phone, otp) => {
  const res = await fetch('/api/accounts/reactivate/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  return res.json();
};

export const setupRemittance = async (data) => {
  const res = await fetch('/api/accounts/remittance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

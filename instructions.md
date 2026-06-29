# NewCityAgent — Setup & Demo Instructions

Step-by-step instructions for setting up, running, and demoing the NewCityAgent prototype.

---

## 1. Prerequisites

| Requirement          | Version  | Check Command            |
| -------------------- | -------- | ------------------------ |
| Node.js              | ≥ 18     | `node -v`                |
| npm                  | ≥ 9      | `npm -v`                 |
| Gemini API Key       | —        | Optional (see § 2.2)     |

> **Note:** The application works without a Gemini API key — the LLM service falls back to template-based notification messages. With a key, notifications become AI-generated and hyper-personalised.

---

## 2. Installation

### 2.1 Install Dependencies

From the **project root** (`NewCityAgent/`):

```bash
npm run install:all
```

This installs packages for the root, `backend/`, and `frontend/` in one command.

### 2.2 Configure Environment (Optional)

Create a `.env` file inside `backend/`:

```bash
cd backend
```

Create the file with the following content:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

If you do not have a key, skip this step — the system will use pre-written template messages instead.

---

## 3. Running the Application

### Option A — Both Servers (Recommended)

From the **project root**:

```bash
npm run dev
```

This uses `concurrently` to start:
- **Backend** → `http://localhost:3001`
- **Frontend** → `http://localhost:3000`

### Option B — Servers Individually

**Terminal 1 — Backend:**
```bash
cd backend
npm start
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### Verify It's Working

1. Open **http://localhost:3000** in your browser — you should see the NewCityAgent dashboard.
2. The backend health check is at **http://localhost:3001** — it should return:
   ```json
   { "message": "NewCityAgent Backend API is running." }
   ```

> **Troubleshooting:** If you see `ECONNREFUSED` errors in the frontend console, the backend is not running. Start it first, then refresh the frontend.

---

## 4. Running the Demo

The application has **4 tabs** accessible from the top navigation bar. Below is how to use each one.

### 4.1 Admin Dashboard (`/`)

The control panel for triggering demo scenarios.

**Steps:**

1. Click **"Migrant Worker (ATM Signal)"** to simulate Ramesh Kumar using an ATM in Bengaluru (he is from Patna with a dormant account).
2. Click **"Student (SIM Signal)"** to simulate Priya Sharma whose SIM card roams into Pune (she is from Ranchi with no account).
3. After triggering, switch to the **Customer Simulator** tab to see the result.
4. Click **"Reset State"** before each fresh demo run to clear all previous data.

---

### 4.2 Guided Demo (`/demo`)

A 4-step interactive walkthrough — best for presentations.

**Steps:**

1. **Step 1 — Select Scenario:** Click either the Migrant Worker or Student card. The system fires the location signal and runs the LLM agent.
2. **Step 2 — Signal Detection:** View the detected city change (e.g., Patna → Bengaluru) and the AI-generated personalised notification message.
3. **Step 3 — Customer Onboarding:**
   - **Migrant Worker:** Enter the Aadhaar OTP. Use `123456` as the test OTP. Click "Verify OTP & Reactivate Account".
   - **Student:** Click "Complete Video KYC & Open Account" to simulate instant account opening.
4. **Step 4 — Completion:** View the success confirmation. Click "Reset Demo & Run Again" to restart.

> **Important:** If Step 2 shows "No city change detected", click **"Reset & Try Again"** — this means the user was already recorded in that city from a previous run.

---

### 4.3 Customer Simulator (`/customer`)

A simulated Android phone that displays real-time AI notifications.

**Steps:**

1. First, trigger a scenario from the **Admin Dashboard** or **Guided Demo** tab.
2. The simulated phone auto-updates every 3 seconds. Once a notification is fired, it appears on the mock device.
3. **For dormant accounts (Ramesh):**
   - Enter the Aadhaar OTP: `123456`
   - Click **"Verify & Reactivate"**
4. **For active worker accounts (after reactivation):**
   - Fill in beneficiary name, account number, and amount
   - Click **"Setup Transfer"** to create a remittance schedule

> The phone shows a loading spinner until a signal is triggered. No manual action is needed — it reacts automatically.

---

### 4.4 Signal Injection Tool (`/signals`)

A developer tool for manually injecting arbitrary location signals.

**Steps:**

1. Enter a registered phone number:
   - `9876543210` — Ramesh Kumar (migrant worker, dormant account)
   - `9876543211` — Priya Sharma (student, no account)
2. Select a signal source: **ATM**, **UPI**, or **SIM**.
3. Type or select a destination city (e.g., Mumbai, Delhi, Bengaluru, Pune).
4. Click **"Send Signal"**.
5. The response panel shows:
   - Whether a city change was detected
   - The raw JSON response from the backend
   - The AI-generated notification (if a city change occurred)
6. The **Recent Signals** table below logs all injected signals.

---

## 5. Recommended Demo Script (4 Minutes)

Follow this sequence for a clean end-to-end presentation:

| Time    | Action                                                                                   |
| ------- | ---------------------------------------------------------------------------------------- |
| 0:00    | Open the app at `http://localhost:3000`. Show the **Admin Dashboard**.                   |
| 0:15    | Click **"Reset State"** to ensure a clean slate.                                         |
| 0:30    | Switch to the **Guided Demo** tab.                                                       |
| 0:45    | Click the **Migrant Worker** card. Wait for the LLM to generate the notification.        |
| 1:15    | On Step 2, highlight the city change detection and the AI-generated message.              |
| 1:30    | Click **"Proceed to Onboarding Flow"**.                                                  |
| 1:45    | Enter OTP `123456` and click **"Verify OTP & Reactivate Account"**.                      |
| 2:00    | Show the success screen (Step 4). Click **"Reset Demo & Run Again"**.                    |
| 2:15    | Now click the **Student** card to demo the second persona.                               |
| 2:45    | Show the city change and AI notification, then click through to account opening.          |
| 3:15    | Switch to the **Customer Simulator** tab to show the mock Android device with the notification. |
| 3:30    | Switch to **Signal Injection** tab to show manual signal testing capability.              |
| 4:00    | Wrap up — highlight the InfoPanel at the bottom that explains the system logic.           |

---

## 6. API Reference

All API endpoints are prefixed with `/api` and served by the backend on port `3001`. The frontend proxies `/api` requests automatically via Vite.

### Location Signals

| Method | Endpoint             | Body                                     | Description                          |
| ------ | -------------------- | ---------------------------------------- | ------------------------------------ |
| POST   | `/api/signals`       | `{ phone, source, city }`                | Inject a location signal             |

### Core Banking System (CBS)

| Method | Endpoint                           | Body                                              | Description                          |
| ------ | ---------------------------------- | ------------------------------------------------- | ------------------------------------ |
| GET    | `/api/accounts/:phone`             | —                                                 | Check account status                 |
| POST   | `/api/accounts/reactivate/initiate`| `{ phone, aadhaar }`                              | Start Aadhaar OTP reactivation       |
| POST   | `/api/accounts/reactivate/verify`  | `{ phone, otp }`                                  | Verify OTP and reactivate account    |
| POST   | `/api/accounts/open`               | `{ phone, name, aadhaar, ... }`                   | Open new Insta Savings Account       |
| POST   | `/api/accounts/remittance`         | `{ phone, beneficiaryName, beneficiaryAccount, amount }` | Create remittance schedule   |

### Demo & State

| Method | Endpoint                        | Body               | Description                          |
| ------ | ------------------------------- | ------------------- | ------------------------------------ |
| GET    | `/api/demo/state`               | —                   | Get full in-memory state             |
| POST   | `/api/demo/reset`               | —                   | Reset all state to defaults          |
| POST   | `/api/demo/trigger-scenario`    | `{ scenario }`      | Trigger a preset scenario (`migrant_worker` or `student`) |

---

## 7. Test Users

| Phone        | Name           | Segment  | Home City | Account Status | Scenario                                  |
| ------------ | -------------- | -------- | --------- | -------------- | ----------------------------------------- |
| 9876543210   | Ramesh Kumar   | Worker   | Patna     | Dormant        | Relocates to Bengaluru via ATM signal     |
| 9876543211   | Priya Sharma   | Student  | Ranchi    | None           | Relocates to Pune via SIM roaming signal  |

**Default OTP for reactivation:** `123456`

---

## 8. Troubleshooting

| Issue                                         | Solution                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| `ECONNREFUSED` errors in the browser console  | The backend is not running. Start it with `cd backend && npm start`.    |
| "No city change detected" in Guided Demo      | Click **Reset State** on the Dashboard, then re-trigger the scenario.   |
| LLM notifications show generic template text  | Add a valid `GEMINI_API_KEY` in `backend/.env` and restart the backend. |
| Frontend shows blank page                     | Check browser console for errors. Run `cd frontend && npm run dev`.     |
| Port 3000 or 3001 already in use              | Kill the existing process or change ports in `vite.config.js` / `backend/config.js`. |

---

## 9. Running Backend Tests

```bash
cd backend
npm test
```

This runs `verify.js`, which performs integration checks against the backend API endpoints.

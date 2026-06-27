# NewCityAgent — Frontend

Production-quality React + Vite + Tailwind CSS v4 dashboard for the
**NewCityAgent** agentic SBI banking solution (migrant worker & student
onboarding).

## Quick start

```bash
# 1. Install
npm install

# 2. Run dev server (proxies /api -> http://localhost:3000)
npm run dev

# 3. Build for production
npm run build
npm run preview
```

## Stack

- **Vite** + **React 19**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, no PostCSS config)
- **React Router v6**
- **lucide-react** icons
- **axios** for API calls
- Pure CSS / DOM animations (no extra animation libs)

## Layout

```
src/
├── components/
│   ├── layout/       Sidebar, Header, Layout
│   ├── ui/           Badge, Button, KpiCard, EventLog, StepIndicator, ...
│   └── customer/     AccountCard, RemittanceCard, CustomerTimeline
├── pages/            DashboardPage, DemoPage, CustomerPage, SignalsPage
├── services/api.js   axios wrapper around /api/*
├── hooks/            useSSE, useDemoState, useCountUp
├── context/          DemoContext (demo flow state), ToastContext
└── utils/cn.js       tiny className join helper
```

## Routes

| Path             | Page            | Purpose                                         |
| ---------------- | --------------- | ----------------------------------------------- |
| `/`              | DashboardPage   | KPI cards, live event log, user table           |
| `/demo`          | DemoPage        | 4-step guided hackathon walkthrough             |
| `/customer/:phone` | CustomerPage  | Individual customer journey                     |
| `/signals`       | SignalsPage     | Manual signal injection tool                    |

## Backend

The Vite dev server proxies `/api/*` to `http://localhost:3000`. The Express
backend should be running there.

Set `VITE_API_BASE_URL` in `.env` if you need to override.

## Demo flow

1. **Choose scenario** — migrant worker or student.
2. **Signal detected** — animated map transition + push preview.
3. **Onboarding** — branch by scenario:
   - Migrant: aadhaar reactivation → OTP → remittance setup.
   - Student: open new digital account.
4. **Journey complete** — confetti, summary card, reset.

The SSE event log streams live updates from the backend throughout.

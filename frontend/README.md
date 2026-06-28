# NewCityAgent - Frontend

This is the frontend portion of the NewCityAgent project, created with React and Vite. It is designed to match the Yono Business SBI interface, featuring pixel-perfect components and a seamless light/dark mode toggle.

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (via CSS variables for theming)
- **Icons:** Lucide React

## How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup
1. Open a terminal and navigate to this `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server
To start the local development server:
```bash
npm run dev
```
The console will display a local URL (usually `http://localhost:5173`). Open this URL in your browser to view the application.

## Features
- **Dark Mode:** Use the Sun/Moon icon in the top header to toggle between light and dark themes. The colors instantly update using CSS variables.
- **Responsive Grid:** The account cards use CSS grid to adapt to screen sizes.

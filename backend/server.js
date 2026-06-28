import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import apiRouter from './src/routes/api.js';
import { inMemoryDb } from './src/db/inMemoryDb.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
app.use(morgan('dev'));

// Mount API Routes
app.use('/api', apiRouter);

// API routing handles everything; frontend is on port 5173
app.get('/', (req, res) => {
  res.status(200).json({ message: "NewCityAgent Backend API is running." });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  
  // Log server error to our database event stream so it shows in the dashboard terminal!
  inMemoryDb.logEvent('SERVER_ERROR', `Internal server error: ${err.message}`, {
    stack: config.isDev ? err.stack : undefined
  });

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start Express Server
const server = app.listen(config.port, () => {
  console.log(`===================================================`);
  console.log(`🚀 NewCityAgent Backend Server running on port ${config.port}`);
  console.log(`👉 Access Developer Dashboard at http://localhost:${config.port}`);
  console.log(`===================================================`);
});

// Export server instance for testing
export default server;

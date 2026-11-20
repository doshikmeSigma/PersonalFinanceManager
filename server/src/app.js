import express from 'express';
import cors from 'cors';
import { config } from './config.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.clientOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      env: config.env,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
import { Router } from 'express';
import { config } from '../config.js';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    env: config.env,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
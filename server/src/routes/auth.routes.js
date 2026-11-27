import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { registerSchema } from '../validation/auth.schema.js';
import { register } from '../services/auth.service.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const user = await register(req.body);
    res.status(201).json({ data: user });
  })
);
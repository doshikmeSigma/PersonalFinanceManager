import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Некорректный email').max(254),
  password: z.string().min(8, 'Пароль должен быть не короче 8 символов').max(72),
  name: z.string().trim().min(1, 'Укажите имя').max(60),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Некорректный email'),
  password: z.string().min(1, 'Укажите пароль'),
});
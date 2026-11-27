import { ApiError } from '../utils/ApiError.js';
import { usersRepository } from '../repositories/users.repository.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';

export async function register({ email, password, name }) {
  if (usersRepository.findByEmail(email)) {
    throw ApiError.conflict('Пользователь с таким email уже зарегистрирован');
  }

  const passwordHash = await hashPassword(password);

  try {
    return usersRepository.create({ email, passwordHash, name });
  } catch (error) {
    if (String(error.message).includes('UNIQUE constraint failed')) {
      throw ApiError.conflict('Пользователь с таким email уже зарегистрирован');
    }
    throw error;
  }
}

export async function login({ email, password }) {
  const user = usersRepository.findByEmail(email);

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw ApiError.unauthorized('Неверный email или пароль');
  }

  return {
    token: signToken(user),
    user: usersRepository.findById(user.id),
  };
}
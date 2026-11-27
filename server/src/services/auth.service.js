import { ApiError } from '../utils/ApiError.js';
import { usersRepository } from '../repositories/users.repository.js';
import { hashPassword } from '../utils/password.js';

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
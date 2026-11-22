import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(currentDir, '..');

dotenv.config({ path: path.join(serverRoot, '.env') });

const dbFile = process.env.DB_FILE || 'data/app.db';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  serverRoot,
  dbFile: path.isAbsolute(dbFile) ? dbFile : path.join(serverRoot, dbFile),
};
import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`[server] запущен на http://localhost:${config.port} (${config.env})`);
});
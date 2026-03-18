import { loadConfig } from './config.js';
import { createBot } from './bot.js';

process.loadEnvFile('.env');

const config = loadConfig();
const bot = createBot();

bot.once('ready', (client) => {
  console.log(`${client.user.tag} としてログインしました`);
});

await bot.login(config.token);

import * as path from 'node:path';
import { loadConfig } from './config.js';
import { createBot } from './bot.js';
import { WeaponDownloader } from './database/weapon-downloader.js';

process.loadEnvFile('.env');

const config = loadConfig();

const WEAPON_API_URL = 'https://stat.ink/api/v3/weapon?full=1';
const DATABASE_DIR = path.resolve('database');
const WEAPONS3_PATH = path.join(DATABASE_DIR, 'weapons3.json');
const DOWNLOAD_INTERVAL = 24 * 60 * 60 * 1000; // 24時間

const downloader = new WeaponDownloader(WEAPONS3_PATH, WEAPON_API_URL);

try {
  await downloader.ensureAvailable();
} catch (error) {
  console.error('ブキデータの取得に失敗しました:', error);
  process.exit(1);
}

const bot = createBot();

bot.once('ready', (client) => {
  console.log(`${client.user.tag} としてログインしました`);

  // 24時間ごとにブキデータを更新
  setInterval(async () => {
    try {
      await downloader.download();
      console.log('ブキデータを更新しました');
    } catch (error) {
      console.error('ブキデータの定期更新に失敗しました:', error);
    }
  }, DOWNLOAD_INTERVAL);
});

await bot.login(config.token);

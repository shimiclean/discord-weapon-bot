import { REST, Routes } from 'discord.js';
import { loadConfig } from './config.js';
import { weapon3Command } from './commands/weapon3.js';

process.loadEnvFile('.env');

const config = loadConfig();
const rest = new REST().setToken(config.token);

const commands = [weapon3Command.data.toJSON()];

console.log(`${commands.length} 個のコマンドを登録します...`);

await rest.put(
  Routes.applicationCommands(config.clientId),
  { body: commands },
);

console.log('コマンドの登録が完了しました');

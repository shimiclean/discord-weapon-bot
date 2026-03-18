import * as path from 'node:path';
import { REST, Routes, SlashCommandStringOption } from 'discord.js';
import { loadConfig } from './config.js';
import { weapon3Command } from './commands/weapon3.js';
import { WeaponRepository } from './database/weapon-repository.js';

process.loadEnvFile('.env');

const config = loadConfig();
const rest = new REST().setToken(config.token);

const WEAPONS3_PATH = path.resolve('database', 'weapons3.json');
const repo = WeaponRepository.load(WEAPONS3_PATH);

// 選択肢をデータから構築
const addChoices = (name: string, values: string[]) => {
  const option = weapon3Command.data.options.find(
    (opt): opt is SlashCommandStringOption => opt instanceof SlashCommandStringOption && opt.name === name,
  );
  if (option) {
    option.addChoices(...values.map((v) => ({ name: v, value: v })));
  }
};

addChoices('sub', repo.subs);
addChoices('special', repo.specials);

const commands = [weapon3Command.data.toJSON()];

console.log(`${commands.length} 個のコマンドを登録します...`);
console.log(`サブウェポン選択肢: ${repo.subs.length} 個`);
console.log(`スペシャル選択肢: ${repo.specials.length} 個`);

await rest.put(
  Routes.applicationCommands(config.clientId),
  { body: commands },
);

console.log('コマンドの登録が完了しました');

import { createBot } from '../src/bot.js';
import { Client, GatewayIntentBits } from 'discord.js';

describe('createBot', () => {
  it('Discord Client インスタンスを返すこと', () => {
    const bot = createBot();
    expect(bot).toBeInstanceOf(Client);
    bot.destroy();
  });

  it('Guilds インテントが設定されていること', () => {
    const bot = createBot();
    expect(bot.options.intents.has(GatewayIntentBits.Guilds)).toBe(true);
    bot.destroy();
  });
});

import { Client, GatewayIntentBits } from 'discord.js';

export function createBot(): Client {
  return new Client({
    intents: [GatewayIntentBits.Guilds],
  });
}

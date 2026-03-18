import { Client, Events, GatewayIntentBits, ChatInputCommandInteraction } from 'discord.js';
import { weapon3Command } from './commands/weapon3.js';

const commands = new Map([
  [weapon3Command.data.name, weapon3Command],
]);

export function createBot(): Client {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction as ChatInputCommandInteraction);
  });

  return client;
}

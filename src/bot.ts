import { Client, Events, GatewayIntentBits, ChatInputCommandInteraction } from 'discord.js';
import { WeaponStore } from './database/weapon-store.js';
import { weapon3Command } from './commands/weapon3.js';

export interface BotOptions {
  weaponStore?: WeaponStore;
}

export function createBot(options: BotOptions = {}): Client {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === weapon3Command.data.name) {
      await weapon3Command.execute(
        interaction as ChatInputCommandInteraction,
        options.weaponStore?.repository,
      );
    }
  });

  return client;
}

import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const weapon3Command = {
  data: new SlashCommandBuilder()
    .setName('weapon3')
    .setDescription('Splatoon 3 のブキをランダムに選択します'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('スプラシューター');
  },
};

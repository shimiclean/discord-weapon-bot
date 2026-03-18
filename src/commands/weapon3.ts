import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { WeaponRepository } from '../database/weapon-repository.js';

export const weapon3Command = {
  data: new SlashCommandBuilder()
    .setName('weapon3')
    .setDescription('Splatoon 3 のブキをランダムに選択します'),

  async execute(
    interaction: ChatInputCommandInteraction,
    repo?: WeaponRepository,
  ): Promise<void> {
    if (!repo) {
      await interaction.reply('ブキデータが読み込まれていません');
      return;
    }

    const weapon = repo.random();
    await interaction.reply(`${weapon.name} （${weapon.sub}、${weapon.special}）`);
  },
};

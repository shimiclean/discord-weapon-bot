import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { WeaponRepository } from '../database/weapon-repository.js';

export const weapon3Command = {
  data: new SlashCommandBuilder()
    .setName('weapon3')
    .setDescription('Splatoon 3 のブキをランダムに選択します')
    .addStringOption((option) =>
      option
        .setName('sub')
        .setDescription('サブウェポンで絞り込み')
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName('special')
        .setDescription('スペシャルウェポンで絞り込み')
        .setRequired(false),
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    repo?: WeaponRepository,
  ): Promise<void> {
    if (!repo) {
      await interaction.reply('ブキデータが読み込まれていません');
      return;
    }

    const sub = interaction.options.getString('sub');
    const special = interaction.options.getString('special');
    const filter = (sub || special) ? { ...(sub && { sub }), ...(special && { special }) } : undefined;
    const weapon = repo.random(filter);

    if (!weapon) {
      await interaction.reply('条件に一致するブキが見つかりません');
      return;
    }

    await interaction.reply(`${weapon.name} （${weapon.sub}、${weapon.special}）`);
  },
};

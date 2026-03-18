import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, GuildMember } from 'discord.js';
import { WeaponRepository } from '../database/weapon-repository.js';
import { formatWeapon, assignWeapons } from './format.js';

export const weapon3Command = {
  data: new SlashCommandBuilder()
    .setName('weapon3')
    .setDescription('Splatoon 3 のブキをランダムに選択します')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('カテゴリーで絞り込み')
        .setRequired(false),
    )
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
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('ボイスチャンネルの参加者全員にブキを割り当て')
        .addChannelTypes(ChannelType.GuildVoice)
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

    const type = interaction.options.getString('category');
    const sub = interaction.options.getString('sub');
    const special = interaction.options.getString('special');
    const filter = (type || sub || special)
      ? { ...(type && { type }), ...(sub && { sub }), ...(special && { special }) }
      : undefined;

    const channel = interaction.options.getChannel('channel');

    if (channel && 'members' in channel) {
      const members = [...(channel.members as Map<string, GuildMember>).values()];
      const userNames = members
        .filter((m) => !m.user.bot)
        .map((m) => m.displayName);

      if (userNames.length === 0) {
        await interaction.reply('ボイスチャンネルにユーザーがいません');
        return;
      }

      const result = assignWeapons(userNames, repo, filter);
      await interaction.reply(result);
      return;
    }

    const weapon = repo.random(filter);

    if (!weapon) {
      await interaction.reply('条件に一致するブキが見つかりません');
      return;
    }

    await interaction.reply(formatWeapon(weapon));
  },
};

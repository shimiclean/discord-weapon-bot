import { jest } from '@jest/globals';
import { weapon3Command } from '../../src/commands/weapon3.js';
import { WeaponRepository } from '../../src/database/weapon-repository.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const sampleWeapons = [
  {
    key: 'sshooter',
    type: { key: 'shooter', name: { ja_JP: 'シューター' } },
    name: { ja_JP: 'スプラシューター' },
    sub: { key: 'kyubanbomb', name: { ja_JP: 'キューバンボム' } },
    special: { key: 'ultrashot', name: { ja_JP: 'ウルトラショット' } },
  },
  {
    key: '52gal',
    type: { key: 'shooter', name: { ja_JP: 'シューター' } },
    name: { ja_JP: '.52ガロン' },
    sub: { key: 'splashshield', name: { ja_JP: 'スプラッシュシールド' } },
    special: { key: 'megaphone51', name: { ja_JP: 'メガホンレーザー5.1ch' } },
  },
  {
    key: 'hokusai',
    type: { key: 'brush', name: { ja_JP: 'フデ' } },
    name: { ja_JP: 'ホクサイ' },
    sub: { key: 'kyubanbomb', name: { ja_JP: 'キューバンボム' } },
    special: { key: 'shokuwander', name: { ja_JP: 'ショクワンダー' } },
  },
];

const makeInteraction = (options: Record<string, string | null> = {}) => {
  const reply = jest.fn();
  return {
    reply,
    interaction: {
      reply,
      options: {
        getString: (name: string) => options[name] ?? null,
      },
    } as any,
  };
};

describe('weapon3 コマンド', () => {
  let tmpDir: string;
  let repo: WeaponRepository;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'weapon3-cmd-'));
    const filePath = path.join(tmpDir, 'weapons3.json');
    fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
    repo = WeaponRepository.load(filePath);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('コマンド名が "weapon3" であること', () => {
    expect(weapon3Command.data.name).toBe('weapon3');
  });

  it('オプションなしで全ブキから選択して返信すること', async () => {
    const { reply, interaction } = makeInteraction();

    await weapon3Command.execute(interaction, repo);

    expect(reply).toHaveBeenCalledTimes(1);
    const replied = reply.mock.calls[0][0] as string;
    const validReplies = sampleWeapons.map(
      (w) => `${w.name.ja_JP} （${w.sub.name.ja_JP}、${w.special.name.ja_JP}）`,
    );
    expect(validReplies).toContain(replied);
  });

  it('サブウェポンを指定するとそのサブを持つブキから選択すること', async () => {
    const { reply, interaction } = makeInteraction({ sub: 'スプラッシュシールド' });

    await weapon3Command.execute(interaction, repo);

    expect(reply).toHaveBeenCalledWith(
      '.52ガロン （スプラッシュシールド、メガホンレーザー5.1ch）',
    );
  });

  it('スペシャルを指定するとそのスペシャルを持つブキから選択すること', async () => {
    const { reply, interaction } = makeInteraction({ special: 'ショクワンダー' });

    await weapon3Command.execute(interaction, repo);

    expect(reply).toHaveBeenCalledWith(
      'ホクサイ （キューバンボム、ショクワンダー）',
    );
  });

  it('サブとスペシャルの AND 条件で絞り込むこと', async () => {
    const { reply, interaction } = makeInteraction({ sub: 'キューバンボム', special: 'ウルトラショット' });

    await weapon3Command.execute(interaction, repo);

    expect(reply).toHaveBeenCalledWith(
      'スプラシューター （キューバンボム、ウルトラショット）',
    );
  });

  it('該当するブキがない場合、メッセージを返すこと', async () => {
    const { reply, interaction } = makeInteraction({ sub: '存在しないサブ' });

    await weapon3Command.execute(interaction, repo);

    expect(reply).toHaveBeenCalledWith(
      expect.stringContaining('見つかりません'),
    );
  });

  it('リポジトリが未設定の場合、エラーメッセージを返すこと', async () => {
    const { reply, interaction } = makeInteraction();

    await weapon3Command.execute(interaction, undefined);

    expect(reply).toHaveBeenCalledWith(
      expect.stringContaining('ブキデータ'),
    );
  });
});

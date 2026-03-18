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
    key: 'hokusai',
    type: { key: 'brush', name: { ja_JP: 'フデ' } },
    name: { ja_JP: 'ホクサイ' },
    sub: { key: 'kyubanbomb', name: { ja_JP: 'キューバンボム' } },
    special: { key: 'shokuwander', name: { ja_JP: 'ショクワンダー' } },
  },
];

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

  it('「{メイン} （{サブ}、{スペシャル}）」の形式で返信すること', async () => {
    const reply = jest.fn();
    const interaction = { reply } as any;

    await weapon3Command.execute(interaction, repo);

    expect(reply).toHaveBeenCalledTimes(1);
    const replied = reply.mock.calls[0][0] as string;
    const validReplies = sampleWeapons.map(
      (w) => `${w.name.ja_JP} （${w.sub.name.ja_JP}、${w.special.name.ja_JP}）`,
    );
    expect(validReplies).toContain(replied);
  });

  it('リポジトリが未設定の場合、エラーメッセージを返すこと', async () => {
    const reply = jest.fn();
    const interaction = { reply } as any;

    await weapon3Command.execute(interaction, undefined);

    expect(reply).toHaveBeenCalledWith(
      expect.stringContaining('ブキデータ'),
    );
  });
});

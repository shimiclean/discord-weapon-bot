import { formatWeapon, assignWeapons } from '../../src/commands/format.js';
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

describe('formatWeapon', () => {
  it('「{ブキ名} （{サブ}・{スペシャル}）」の形式で返すこと', () => {
    const weapon = { key: 'sshooter', name: 'スプラシューター', type: 'シューター', sub: 'キューバンボム', special: 'ウルトラショット' };
    expect(formatWeapon(weapon)).toBe('スプラシューター （キューバンボム・ウルトラショット）');
  });
});

describe('assignWeapons', () => {
  let tmpDir: string;
  let repo: WeaponRepository;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'format-test-'));
    const filePath = path.join(tmpDir, 'weapons3.json');
    fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
    repo = WeaponRepository.load(filePath);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('各ユーザーにブキを割り当てて「{ユーザー名}: {フォーマット}」形式にすること', () => {
    const users = ['Alice', 'Bob'];
    const result = assignWeapons(users, repo);
    const lines = result.split('\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^Alice: .+ （.+・.+）$/);
    expect(lines[1]).toMatch(/^Bob: .+ （.+・.+）$/);
  });

  it('ユーザーが名前順にソートされていること', () => {
    const users = ['Charlie', 'Alice', 'Bob'];
    const result = assignWeapons(users, repo);
    const lines = result.split('\n');

    expect(lines[0]).toMatch(/^Alice:/);
    expect(lines[1]).toMatch(/^Bob:/);
    expect(lines[2]).toMatch(/^Charlie:/);
  });

  it('フィルタが適用されること', () => {
    const users = ['Alice'];
    const result = assignWeapons(users, repo, { type: 'フデ' });
    expect(result).toBe('Alice: ホクサイ （キューバンボム・ショクワンダー）');
  });

  it('フィルタで該当なしの場合、その旨を表示すること', () => {
    const users = ['Alice'];
    const result = assignWeapons(users, repo, { sub: '存在しないサブ' });
    expect(result).toContain('Alice:');
    expect(result).toContain('見つかりません');
  });

  it('ユーザーが空の場合、空文字を返すこと', () => {
    const result = assignWeapons([], repo);
    expect(result).toBe('');
  });
});

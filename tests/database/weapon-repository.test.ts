import { WeaponRepository } from '../../src/database/weapon-repository.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const sampleWeapons = [
  {
    key: '52gal',
    type: { key: 'shooter', name: { ja_JP: 'シューター' } },
    name: { ja_JP: '.52ガロン', en_US: '.52 Gal' },
    sub: { key: 'splashshield', name: { ja_JP: 'スプラッシュシールド' } },
    special: { key: 'megaphone51', name: { ja_JP: 'メガホンレーザー5.1ch' } },
  },
  {
    key: 'sshooter',
    type: { key: 'shooter', name: { ja_JP: 'シューター' } },
    name: { ja_JP: 'スプラシューター', en_US: 'Splattershot' },
    sub: { key: 'kyubanbomb', name: { ja_JP: 'キューバンボム' } },
    special: { key: 'ultrashot', name: { ja_JP: 'ウルトラショット' } },
  },
  {
    key: 'hokusai',
    type: { key: 'brush', name: { ja_JP: 'フデ' } },
    name: { ja_JP: 'ホクサイ', en_US: 'Octobrush' },
    sub: { key: 'kyubanbomb', name: { ja_JP: 'キューバンボム' } },
    special: { key: 'shokuwander', name: { ja_JP: 'ショクワンダー' } },
  },
];

describe('WeaponRepository', () => {
  let tmpDir: string;
  let filePath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'weapon-repo-'));
    filePath = path.join(tmpDir, 'weapons3.json');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('load', () => {
    it('JSON ファイルからブキ一覧を読み込めること', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      expect(repo.count).toBe(3);
    });

    it('ファイルが存在しない場合、エラーを投げること', () => {
      expect(() => WeaponRepository.load(filePath)).toThrow();
    });
  });

  describe('random', () => {
    it('ブキ一覧から1つを返すこと', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random();
      const names = sampleWeapons.map((w) => w.name.ja_JP);
      expect(names).toContain(weapon.name);
    });

    it('返されるブキが日本語名を持つこと', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random();
      expect(weapon.name).toBeTruthy();
      expect(typeof weapon.name).toBe('string');
    });
  });

  describe('ブキが1つの場合', () => {
    it('その1つを必ず返すこと', () => {
      fs.writeFileSync(filePath, JSON.stringify([sampleWeapons[0]]));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random();
      expect(weapon.name).toBe('.52ガロン');
    });
  });

  describe('空の配列の場合', () => {
    it('エラーを投げること', () => {
      fs.writeFileSync(filePath, JSON.stringify([]));
      expect(() => WeaponRepository.load(filePath)).toThrow();
    });
  });

  describe('subs', () => {
    it('重複なしのサブウェポン一覧を返すこと', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const subs = repo.subs;
      expect(subs).toEqual(
        expect.arrayContaining(['スプラッシュシールド', 'キューバンボム']),
      );
      expect(subs).toHaveLength(2);
    });

    it('ソートされていること', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const subs = repo.subs;
      const sorted = [...subs].sort((a, b) => a.localeCompare(b, 'ja'));
      expect(subs).toEqual(sorted);
    });
  });

  describe('specials', () => {
    it('重複なしのスペシャル一覧をソート済みで返すこと', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const specials = repo.specials;
      expect(specials).toHaveLength(3);
      const sorted = [...specials].sort((a, b) => a.localeCompare(b, 'ja'));
      expect(specials).toEqual(sorted);
    });
  });

  describe('random with filter', () => {
    it('サブウェポンでフィルタできること', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random({ sub: 'スプラッシュシールド' });
      expect(weapon?.name).toBe('.52ガロン');
    });

    it('スペシャルでフィルタできること', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random({ special: 'ショクワンダー' });
      expect(weapon?.name).toBe('ホクサイ');
    });

    it('サブとスペシャルの AND 条件でフィルタできること', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random({ sub: 'キューバンボム', special: 'ウルトラショット' });
      expect(weapon?.name).toBe('スプラシューター');
    });

    it('AND 条件で一致するブキがない場合、null を返すこと', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random({ sub: 'スプラッシュシールド', special: 'ウルトラショット' });
      expect(weapon).toBeNull();
    });

    it('フィルタ条件に一致するブキがない場合、null を返すこと', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random({ sub: '存在しないサブ' });
      expect(weapon).toBeNull();
    });

    it('フィルタなしの場合、全ブキから選択すること', () => {
      fs.writeFileSync(filePath, JSON.stringify(sampleWeapons));
      const repo = WeaponRepository.load(filePath);
      const weapon = repo.random();
      expect(weapon).not.toBeNull();
    });
  });
});

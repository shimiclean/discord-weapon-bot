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
});

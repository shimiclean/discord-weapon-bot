import { jest } from '@jest/globals';
import { WeaponStore } from '../../src/database/weapon-store.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const weaponsA = [
  {
    key: 'sshooter',
    type: { key: 'shooter', name: { ja_JP: 'シューター' } },
    name: { ja_JP: 'スプラシューター' },
    sub: { key: 'kyubanbomb', name: { ja_JP: 'キューバンボム' } },
    special: { key: 'ultrashot', name: { ja_JP: 'ウルトラショット' } },
  },
];

const weaponsB = [
  {
    key: 'hokusai',
    type: { key: 'brush', name: { ja_JP: 'フデ' } },
    name: { ja_JP: 'ホクサイ' },
    sub: { key: 'kyubanbomb', name: { ja_JP: 'キューバンボム' } },
    special: { key: 'shokuwander', name: { ja_JP: 'ショクワンダー' } },
  },
  {
    key: 'sshooter',
    type: { key: 'shooter', name: { ja_JP: 'シューター' } },
    name: { ja_JP: 'スプラシューター' },
    sub: { key: 'kyubanbomb', name: { ja_JP: 'キューバンボム' } },
    special: { key: 'ultrashot', name: { ja_JP: 'ウルトラショット' } },
  },
];

describe('WeaponStore', () => {
  let tmpDir: string;
  let filePath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'weapon-store-'));
    filePath = path.join(tmpDir, 'weapons3.json');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('load', () => {
    it('ファイルからリポジトリを読み込めること', () => {
      fs.writeFileSync(filePath, JSON.stringify(weaponsA));
      const store = WeaponStore.load(filePath);
      expect(store.repository.count).toBe(1);
    });
  });

  describe('reload', () => {
    it('ファイルが更新されたら新しいデータを反映すること', () => {
      fs.writeFileSync(filePath, JSON.stringify(weaponsA));
      const store = WeaponStore.load(filePath);
      expect(store.repository.count).toBe(1);

      fs.writeFileSync(filePath, JSON.stringify(weaponsB));
      store.reload();
      expect(store.repository.count).toBe(2);
    });

    it('ファイル内容が同じならリポジトリを差し替えないこと', () => {
      fs.writeFileSync(filePath, JSON.stringify(weaponsA));
      const store = WeaponStore.load(filePath);
      const repoBefore = store.repository;

      store.reload();
      expect(store.repository).toBe(repoBefore);
    });

    it('ファイルが破損していたらリロードを無視し、既存リポジトリを維持すること', () => {
      fs.writeFileSync(filePath, JSON.stringify(weaponsA));
      const store = WeaponStore.load(filePath);
      const repoBefore = store.repository;

      fs.writeFileSync(filePath, 'broken json{{{');
      store.reload();
      expect(store.repository).toBe(repoBefore);
    });
  });
});

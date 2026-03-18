import * as fs from 'node:fs';
import * as crypto from 'node:crypto';

export interface Weapon {
  key: string;
  name: string;
  type: string;
  sub: string;
  special: string;
}

interface RawWeapon {
  key: string;
  name: { ja_JP: string };
  type: { key: string; name: { ja_JP: string } };
  sub: { key: string; name: { ja_JP: string } };
  special: { key: string; name: { ja_JP: string } };
}

export class WeaponRepository {
  private constructor(private readonly weapons: Weapon[]) {}

  static load(filePath: string): WeaponRepository {
    const data = fs.readFileSync(filePath, 'utf-8');
    return WeaponRepository.loadFromJson(data);
  }

  static loadFromJson(json: string): WeaponRepository {
    const raw: RawWeapon[] = JSON.parse(json);

    if (raw.length === 0) {
      throw new Error('ブキデータが空です');
    }

    const weapons = raw.map((w) => ({
      key: w.key,
      name: w.name.ja_JP,
      type: w.type.name.ja_JP,
      sub: w.sub.name.ja_JP,
      special: w.special.name.ja_JP,
    }));

    return new WeaponRepository(weapons);
  }

  get count(): number {
    return this.weapons.length;
  }

  get subs(): string[] {
    const unique = [...new Set(this.weapons.map((w) => w.sub))];
    return unique.sort((a, b) => a.localeCompare(b, 'ja'));
  }

  get specials(): string[] {
    const unique = [...new Set(this.weapons.map((w) => w.special))];
    return unique.sort((a, b) => a.localeCompare(b, 'ja'));
  }

  random(filter?: { sub?: string; special?: string }): Weapon | null {
    let candidates = this.weapons;

    if (filter?.sub) {
      candidates = candidates.filter((w) => w.sub === filter.sub);
    }

    if (filter?.special) {
      candidates = candidates.filter((w) => w.special === filter.special);
    }

    if (candidates.length === 0) {
      return null;
    }

    const index = crypto.randomInt(candidates.length);
    return candidates[index];
  }
}

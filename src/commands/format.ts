import { Weapon, WeaponRepository } from '../database/weapon-repository.js';

export function formatWeapon(weapon: Weapon): string {
  return `${weapon.name} （${weapon.sub}・${weapon.special}）`;
}

export function assignWeapons(
  userNames: string[],
  repo: WeaponRepository,
  filter?: { type?: string; sub?: string; special?: string },
): string {
  if (userNames.length === 0) {
    return '';
  }

  const sorted = [...userNames].sort((a, b) => a.localeCompare(b, 'ja'));

  return sorted
    .map((name) => {
      const weapon = repo.random(filter);
      if (!weapon) {
        return `${name}: 条件に一致するブキが見つかりません`;
      }
      return `${name}: ${formatWeapon(weapon)}`;
    })
    .join('\n');
}

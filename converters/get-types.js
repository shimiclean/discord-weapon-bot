import unique from '../helpers/unique.js';

export default function (weaponList) {
  return unique(weaponList.map(v => v.type)).sort();
}

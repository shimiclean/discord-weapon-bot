import * as fs from 'node:fs';
import { WeaponRepository } from './weapon-repository.js';

export class WeaponStore {
  private _repository: WeaponRepository;
  private lastContent: string;

  private constructor(
    private readonly filePath: string,
    content: string,
  ) {
    this.lastContent = content;
    this._repository = WeaponRepository.loadFromJson(content);
  }

  static load(filePath: string): WeaponStore {
    const content = fs.readFileSync(filePath, 'utf-8');
    return new WeaponStore(filePath, content);
  }

  get repository(): WeaponRepository {
    return this._repository;
  }

  reload(): void {
    let content: string;
    try {
      content = fs.readFileSync(this.filePath, 'utf-8');
    } catch {
      return;
    }

    if (content === this.lastContent) {
      return;
    }

    try {
      this._repository = WeaponRepository.loadFromJson(content);
      this.lastContent = content;
    } catch {
      // JSON が破損している場合は既存リポジトリを維持
    }
  }
}

import * as fs from 'node:fs';
import * as path from 'node:path';

export interface EnsureAvailableOptions {
  retries?: number;
  retryDelay?: number;
}

export class WeaponDownloader {
  constructor(
    private readonly filePath: string,
    private readonly url: string,
  ) {}

  async download(fetchFn: typeof fetch = fetch): Promise<void> {
    const response = await fetchFn(this.url, {
      headers: {
        'User-Agent': 'discord-weapon-bot/2.0.0',
      },
    });

    if (!response.ok) {
      throw new Error(`ダウンロードに失敗しました: HTTP ${response.status}`);
    }

    const text = await response.text();

    // JSON として正しいか検証
    JSON.parse(text);

    const dir = path.dirname(this.filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.filePath, text, 'utf-8');
  }

  async ensureAvailable(
    fetchFn: typeof fetch = fetch,
    options: EnsureAvailableOptions = {},
  ): Promise<void> {
    if (fs.existsSync(this.filePath)) {
      return;
    }

    const { retries = 5, retryDelay = 1000 } = options;

    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await this.download(fetchFn);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    throw lastError;
  }
}

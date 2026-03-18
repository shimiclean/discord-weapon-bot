import { jest } from '@jest/globals';
import { WeaponDownloader } from '../../src/database/weapon-downloader.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('WeaponDownloader', () => {
  let tmpDir: string;
  let filePath: string;
  let downloader: WeaponDownloader;

  const validJson = JSON.stringify([
    {
      key: '52gal',
      type: { key: 'shooter', name: { ja_JP: 'シューター' } },
      name: { ja_JP: '.52ガロン' },
      sub: { key: 'splashshield', name: { ja_JP: 'スプラッシュシールド' } },
      special: { key: 'megaphone51', name: { ja_JP: 'メガホンレーザー5.1ch' } },
    },
  ]);

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'weapon-dl-'));
    filePath = path.join(tmpDir, 'weapons3.json');
    downloader = new WeaponDownloader(filePath, 'https://example.com/api');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('download', () => {
    it('API からダウンロードしてファイルに保存すること', async () => {
      const mockFetch = jest.fn<typeof global.fetch>().mockResolvedValue(
        new Response(validJson, { status: 200 }),
      );

      await downloader.download(mockFetch);

      expect(fs.existsSync(filePath)).toBe(true);
      const saved = fs.readFileSync(filePath, 'utf-8');
      expect(JSON.parse(saved)).toEqual(JSON.parse(validJson));
    });

    it('レスポンスが JSON として不正な場合、ファイルを保存しないこと', async () => {
      const mockFetch = jest.fn<typeof global.fetch>().mockResolvedValue(
        new Response('invalid json{{{', { status: 200 }),
      );

      await expect(downloader.download(mockFetch)).rejects.toThrow();
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('既存ファイルがある場合、不正な JSON で上書きしないこと', async () => {
      fs.writeFileSync(filePath, validJson);

      const mockFetch = jest.fn<typeof global.fetch>().mockResolvedValue(
        new Response('broken', { status: 200 }),
      );

      await expect(downloader.download(mockFetch)).rejects.toThrow();
      const saved = fs.readFileSync(filePath, 'utf-8');
      expect(JSON.parse(saved)).toEqual(JSON.parse(validJson));
    });

    it('HTTP エラーの場合、例外を投げること', async () => {
      const mockFetch = jest.fn<typeof global.fetch>().mockResolvedValue(
        new Response('Not Found', { status: 404 }),
      );

      await expect(downloader.download(mockFetch)).rejects.toThrow('404');
    });

    it('ネットワークエラーの場合、例外を投げること', async () => {
      const mockFetch = jest.fn<typeof global.fetch>().mockRejectedValue(
        new Error('network error'),
      );

      await expect(downloader.download(mockFetch)).rejects.toThrow('network error');
    });

    it('User-Agent ヘッダを送信すること', async () => {
      const mockFetch = jest.fn<typeof global.fetch>().mockResolvedValue(
        new Response(validJson, { status: 200 }),
      );

      await downloader.download(mockFetch);

      const call = mockFetch.mock.calls[0];
      const options = call[1] as RequestInit;
      const headers = options.headers as Record<string, string>;
      expect(headers['User-Agent']).toMatch(/discord-weapon-bot/);
    });

    it('保存先ディレクトリが存在しない場合、作成すること', async () => {
      const nestedPath = path.join(tmpDir, 'sub', 'dir', 'weapons3.json');
      const nestedDownloader = new WeaponDownloader(nestedPath, 'https://example.com/api');

      const mockFetch = jest.fn<typeof global.fetch>().mockResolvedValue(
        new Response(validJson, { status: 200 }),
      );

      await nestedDownloader.download(mockFetch);

      expect(fs.existsSync(nestedPath)).toBe(true);
    });
  });

  describe('ensureAvailable', () => {
    it('ファイルが存在しない場合、ダウンロードして成功すること', async () => {
      const mockFetch = jest.fn<typeof global.fetch>().mockResolvedValue(
        new Response(validJson, { status: 200 }),
      );

      await downloader.ensureAvailable(mockFetch);

      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('ファイルが存在する場合、ダウンロードしないこと', async () => {
      fs.writeFileSync(filePath, validJson);

      const mockFetch = jest.fn<typeof global.fetch>();

      await downloader.ensureAvailable(mockFetch);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('ダウンロード失敗時、5回リトライすること', async () => {
      const mockFetch = jest.fn<typeof global.fetch>().mockRejectedValue(
        new Error('network error'),
      );

      await expect(
        downloader.ensureAvailable(mockFetch, { retries: 5, retryDelay: 0 }),
      ).rejects.toThrow();

      // 初回 + 5回リトライ = 6回
      expect(mockFetch).toHaveBeenCalledTimes(6);
    });

    it('リトライ中に成功すれば、そこで完了すること', async () => {
      const mockFetch = jest.fn<typeof global.fetch>()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValueOnce(new Response(validJson, { status: 200 }));

      await downloader.ensureAvailable(mockFetch, { retries: 5, retryDelay: 0 });

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

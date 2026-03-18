import { loadConfig } from '../src/config.js';

describe('loadConfig', () => {
  const validEnv = {
    DISCORD_TOKEN: 'test-token-123',
    CLIENT_ID: '984393354068496395',
  };

  it('必要な環境変数がすべて揃っている場合、設定を返すこと', () => {
    const config = loadConfig(validEnv);
    expect(config).toEqual({
      token: 'test-token-123',
      clientId: '984393354068496395',
    });
  });

  it.each(['DISCORD_TOKEN', 'CLIENT_ID'])(
    '%s が未設定の場合、エラーを投げること',
    (key) => {
      const env = { ...validEnv };
      delete env[key as keyof typeof env];
      expect(() => loadConfig(env)).toThrow(key);
    },
  );

  it.each(['DISCORD_TOKEN', 'CLIENT_ID'])(
    '%s が空文字の場合、エラーを投げること',
    (key) => {
      const env = { ...validEnv, [key]: '' };
      expect(() => loadConfig(env)).toThrow(key);
    },
  );
});

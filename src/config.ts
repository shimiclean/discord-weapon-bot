export interface Config {
  token: string;
  clientId: string;
}

const requiredKeys = [
  ['DISCORD_TOKEN', 'token'],
  ['CLIENT_ID', 'clientId'],
] as const;

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const config: Record<string, string> = {};

  for (const [envKey, configKey] of requiredKeys) {
    const value = env[envKey];
    if (!value) {
      throw new Error(`環境変数 ${envKey} が設定されていません`);
    }
    config[configKey] = value;
  }

  return config as unknown as Config;
}

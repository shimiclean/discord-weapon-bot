# discord-weapon-bot

Splatoon シリーズのブキをランダムに選択する Discord Bot です。

## 概要

スラッシュコマンドでブキのランダム選択を実行し、ユーザーに提示します。
友達との対戦でランダムなブキを使って遊ぶことを目的としています。

## 機能

- `/weapon` - ブキをランダムに選択して表示
- フィルタ機能（カテゴリ、サブウェポン、スペシャルウェポン）を予定

## 技術スタック

- TypeScript (ESM)
- Node.js 24
- discord.js v14
- Jest (テスト)

## 開発

### 前提条件

- Podman がインストールされていること

### 開発環境の起動

```bash
podman run --rm -it -v .:/app -w /app node:24-slim bash
```

### セットアップ

```bash
npm install
```

### テスト

```bash
npm test
```

### ビルド

```bash
npm run build
```

## 設定

以下の環境変数を設定してください:

| 変数名 | 説明 |
|---------|------|
| `DISCORD_TOKEN` | Discord Bot トークン |
| `CLIENT_ID` | Discord アプリケーション ID |
| `GUILD_ID` | Discord サーバー ID |

## ライセンス

MIT License - Copyright (C) 2022-2026 AIZAWA Hina

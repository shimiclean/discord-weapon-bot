# discord-weapon-bot

Splatoon シリーズのブキをランダムに選択する Discord Bot です。

## 概要

スラッシュコマンドでブキのランダム選択を実行し、ユーザーに提示します。
友達との対戦でランダムなブキを使って遊ぶことを目的としています。

## 機能

### `/weapon3` - Splatoon 3 のブキをランダム選択

ブキ一覧からランダムに1つ選び、「{ブキ名} （{サブ}・{スペシャル}）」の形式で表示します。

**オプション:**

| オプション | 説明 |
|------------|------|
| `category` | カテゴリー（シューター、ローラー等）で絞り込み |
| `sub` | サブウェポンで絞り込み |
| `special` | スペシャルウェポンで絞り込み |
| `channel` | ボイスチャンネルを指定し、参加者全員にブキを割り当て |

複数のフィルタオプションを指定した場合は AND 条件で絞り込みます。

**ボイスチャンネル連携:**

`channel` オプションにボイスチャンネルを指定すると、そのチャンネルに参加中のユーザー（Bot を除く）全員にランダムなブキを割り当てます。
フィルタオプションとの併用も可能です。

出力例:
```
Alice: スプラシューター （キューバンボム・ウルトラショット）
Bob: ホクサイ （キューバンボム・ショクワンダー）
Charlie: .52ガロン （スプラッシュシールド・メガホンレーザー5.1ch）
```

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

### スラッシュコマンドの登録

```bash
npm run deploy-commands
```

## 設定

`.env.example` をコピーして `.env` を作成し、以下の値を設定してください:

| 変数名 | 説明 |
|---------|------|
| `DISCORD_TOKEN` | Discord Bot トークン |
| `CLIENT_ID` | Discord アプリケーション ID |

## デプロイ

`discord-weapon-bot.service.example` を参考に systemd ユニットファイルを作成できます。
ビルドは docker コンテナ上で行い、実行はネイティブの node を使用します。

## ブキデータ

ブキデータは [stat.ink](https://stat.ink/) API から自動的にダウンロードされます。

- 初回起動時に `database/weapons3.json` としてダウンロード
- 24時間ごとに自動更新

## ライセンス

MIT License - Copyright (C) 2022-2026 AIZAWA Hina

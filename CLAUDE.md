# CLAUDE.md

## プロジェクト概要

discord-weapon-bot は、Splatoon シリーズのブキをランダムに選択して Discord ユーザーに提示する Bot です。
ユーザーはスラッシュコマンドでブキのランダム選択を実行し、友達との対戦で使用するブキをランダムに決めて遊ぶことができます。

## 技術スタック

- **言語**: TypeScript (ESM)
- **ランタイム**: Node.js 24 (node:24-slim コンテナ上で開発)
- **Discord ライブラリ**: discord.js v14
- **テストフレームワーク**: Jest (ts-jest ESM プリセット)
- **パッケージマネージャー**: npm
- **コンテナ**: Podman (node:24-slim)

## 言語ルール

- 思考・推論は英語で行う
- コード中のコメント、ドキュメント、コミットメッセージ、ユーザーへの応答はすべて日本語で記述する

## 開発方針

### TDD (テスト駆動開発) の厳守

開発は Red-Green-Refactor サイクルで行う:

1. **Red**: 失敗するテストを先に書く
2. **Green**: テストを通す最小限のコードを書く
3. **Refactor**: コードを整理する（テストは通ったまま）

### テストの原則

- 本質的な振る舞いと境界値に対してテストを書く
- 無意味なテストは作成しない
- テストの削除は本質でない場合のみ行わない（本質でないテストは削除してもよい）

## 開発環境

開発は Podman コンテナ上で行い、環境差異をなくす:

```bash
podman run --rm -it -v .:/app -w /app node:24-slim bash
```

## コマンド

```bash
# 依存関係のインストール
npm install

# テスト実行
npm test

# ビルド
npm run build

# スラッシュコマンドを Discord に登録
npm run deploy-commands

# リント
npm run lint
```

## ディレクトリ構成

```
discord-weapon-bot/
├── src/
│   ├── index.ts              # エントリーポイント（.env 読み込み、Bot 起動）
│   ├── config.ts             # 環境変数の読み込み・検証
│   ├── bot.ts                # Discord Client 生成、インタラクションハンドラ
│   ├── commands/
│   │   └── weapon3.ts        # /weapon3 スラッシュコマンド
│   ├── database/
│   │   ├── weapon-downloader.ts  # stat.ink API からブキデータをダウンロード
│   │   ├── weapon-repository.ts  # ブキデータの読み込み・フィルタ・ランダム選択
│   │   └── weapon-store.ts       # リポジトリの管理・自動リロード
│   └── deploy-commands.ts    # スラッシュコマンドの Discord 登録スクリプト
├── tests/                    # テストファイル（src/ と同じ構造）
├── database/                 # ブキデータ JSON（gitignore、実行時にダウンロード）
├── dist/                     # ビルド出力（gitignore）
├── .env                      # 環境変数（gitignore）
├── .env.example              # 環境変数のサンプル
├── Containerfile             # Podman/Docker コンテナ定義
├── CLAUDE.md                 # このファイル
└── README.md                 # プロジェクト説明
```

## 設定

Bot の動作に必要な設定値（DISCORD_TOKEN, CLIENT_ID）は `.env` ファイルで管理する。
`.env.example` をコピーして `.env` を作成し、値を設定する。
Bot は招待されたギルドに自動的に接続するため、ギルド ID の設定は不要。
機密情報は `.gitignore` に含め、リポジトリにコミットしない。

## ブキデータ

- ソース: `https://stat.ink/api/v3/weapon?full=1`
- 起動時にファイルがなければダウンロード（失敗時は5回リトライ後 exit 1）
- 24時間ごとに定期更新、JSON 破損時は既存データを維持
- `database/weapons3.json` に保存（gitignore）

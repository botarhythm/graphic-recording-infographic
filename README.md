# Discord Gemini Bot

Gemini APIを使用したDiscordボット。会話履歴を保持し、自然な対話が可能です。

## 機能

- Gemini APIを使用した自然な会話
- 会話履歴の保持
- DMとサーバーチャンネルの両方に対応
- ウェブ検索機能（開発中）

## セットアップ

1. 必要な環境変数を設定
```env
DISCORD_TOKEN=あなたのDiscordボットトークン
GEMINI_API_KEY=あなたのGemini APIキー
PREFIX=!
CLIENT_ID=あなたのボットのクライアントID
GUILD_ID=あなたのサーバーID
CHANNEL_ID=あなたのチャンネルID
BRAVE_API_KEY=あなたのBrave Search APIキー
```

2. 依存関係のインストール
```bash
npm install
```

3. ボットの起動
```bash
npm start
```

## 使用方法

- 通常の会話: メンションまたはDMで話しかける
- 検索機能: "BraveSearchで検索して [検索キーワード]" と入力

## 技術スタック

- Node.js
- Discord.js
- Google Gemini API
- Brave Search API（開発中）

## Glitchへのデプロイ

1. このリポジトリをGitHubにプッシュ
2. Glitchで新しいプロジェクトを作成
3. GitHubからインポート
4. 環境変数をGlitchの`.env`ファイルに設定
5. プロジェクトを起動

## 注意事項

- Discord Bot TokenとGemini API Keyは必ず環境変数として管理してください
- APIの利用制限に注意してください 
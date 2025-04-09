# グラフィックレコーディング風インフォグラフィック自動生成・管理システム

このリポジトリは、さまざまなコンテンツ（NotionやGoogleドキュメントなど）からグラフィックレコーディング風のインフォグラフィックを自動生成し、管理・公開するためのシステムです。

## 🌟 特徴

- **自動変換**: NotionやGoogleドキュメントからグラフィックレコーディング風HTMLへ自動変換
- **自動分類**: カテゴリとタグによる自動整理・分類
- **視覚的魅力**: 手書き風フォントや視覚要素による親しみやすいデザイン
- **検索・フィルタリング**: タイトル、タグ、説明による簡単な検索とフィルタリング
- **レスポンシブデザイン**: 様々なデバイスでの閲覧に対応
- **簡単埋め込み**: GoogleサイトへのiFrame埋め込みに対応

## 📋 コンテンツサンプル

このリポジトリには以下のサンプルコンテンツが含まれています：

- [GraphAI Discord Bot プロジェクト概要](https://botarhythm.github.io/graphic-recording-infographic/index.html)

## 🔍 カタログページ

すべてのグラフィックレコーディングを閲覧できるカタログページ:

- [カタログページを表示](https://botarhythm.github.io/graphic-recording-infographic/catalog.html)

## 🚀 始め方

自分のコンテンツをグラフィックレコーディングとして追加するには、以下の手順に従います：

1. [WORKFLOW.md](WORKFLOW.md) に記載されているプロンプトテンプレートをコピー
2. Claudeに提供し、Notionコンテンツを指定
3. 生成されたHTMLコードを保存
4. このリポジトリに追加（または独自のリポジトリをフォーク）
5. カタログページに新しいエントリを追加

詳細な手順は [WORKFLOW.md](WORKFLOW.md) を参照してください。

## 📱 Googleサイトへの埋め込み方法

グラフィックレコーディングをGoogleサイトに埋め込むには、以下の手順に従います：

1. Googleサイトを開き、目的のページを編集モードにします
2. 「挿入」→「埋め込み」→「埋め込みコード」を選択
3. 以下のiframeコードを貼り付けます：

```html
<!-- 単一ページの埋め込み -->
<iframe src="https://botarhythm.github.io/graphic-recording-infographic/index.html" width="100%" height="800px" frameborder="0"></iframe>

<!-- または、カタログページの埋め込み -->
<iframe src="https://botarhythm.github.io/graphic-recording-infographic/catalog.html" width="100%" height="800px" frameborder="0"></iframe>
```

4. 「挿入」をクリックして埋め込みを確定
5. 必要に応じてサイズを調整します

## 🛠️ 技術スタック

- HTML/CSS/JavaScript
- Google Fonts（日本語手書き風フォント）
- GitHub Pages（ホスティング）
- Claude（コンテンツ変換用AI）

## 🤝 コントリビューション

このプロジェクトへの貢献を歓迎します！以下の方法で参加できます：

1. 新しいグラフィックレコーディングの追加
2. カタログシステムの改善
3. デザインテンプレートの追加
4. 自動化スクリプトの開発

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📬 連絡先

質問やフィードバックがある場合は、GitHubのIssueを作成するか、リポジトリ所有者に直接連絡してください。
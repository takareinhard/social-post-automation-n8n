# Social Post Automation with n8n

n8nを基盤に、Google Sheets・Gemini・Claude・Threads API を連携させて構築した、AI活用型のSNS投稿自動化ワークフローの公開用リポジトリです。

定期実行、投稿生成、分岐によるパターン出し、投稿履歴の参照、API投稿、カウンター更新までをひとつのフローとして設計しています。公開にあたっては、認証情報や各種IDをサニタイズし、安全に構成や設計意図を確認できる形に整えています。

## このリポジトリで伝わること

- AIを組み込んだ業務自動化フローの設計力
- 複数SaaS・APIをつないだワークフロー構築力
- 生成結果のばらつきを制御するプロンプト設計力
- 公開時のセキュリティとサニタイズを含めた運用視点

## 主な特徴

### 1. エンドツーエンドのワークフロー設計
スケジュール実行、データ取得、投稿文生成、分岐処理、API投稿、カウンター更新までを `n8n` 上で一連の処理として構成しています。

### 2. 分岐による投稿パターン最適化
毎回同じテイストの投稿にならないよう、複数の分岐を使って投稿の切り口や読後感を変えられる設計になっています。

例:

- コメントが付きやすい投稿
- 共感されやすい投稿
- シェアされやすい投稿
- 保存されやすい投稿

### 3. 複数AIノードの組み合わせ
下書き生成と仕上げを分けることで、単発生成よりも投稿の安定感やバリエーションが出るようにしています。

### 4. 公開を前提にしたサニタイズ対応
公開用エクスポートでは、トークン、credential ID、スプレッドシートID、URL、インスタンス識別子などをプレースホルダーに置き換えています。

## リポジトリ構成

```text
workflows/
  threads-x-autopost-sanitized.json
  wordpress-ai-rewrite-stable.json
  README.md
scripts/
  sanitize-n8n-workflow.mjs
```

## メインワークフロー

対象ファイル:
[`workflows/threads-x-autopost-sanitized.json`](workflows/threads-x-autopost-sanitized.json)

含まれている内容:

- 1日複数回のスケジュール実行
- Google Sheets を使った投稿元データ・履歴・カウンター管理
- 分岐による複数の投稿戦略
- LLMを使った原案生成と仕上げ
- Threads API への投稿処理
- 投稿後の状態更新


## 追加ワークフロー

### WordPress AIリライト自動化

対象ファイル:
[`workflows/wordpress-ai-rewrite-stable.json`](workflows/wordpress-ai-rewrite-stable.json)

WordPress の公開済み記事を古い順に 1 件取得し、Brave Search で最新情報を補強したうえで Claude で自然な日本語にリライトし、REST API で即時更新する `n8n` ワークフローです。

含まれている内容:

- 毎日定刻に動くスケジュール実行
- `Static Data` による処理済み件数の管理
- Brave Search API を使った最新情報の取得
- Claude による既存 HTML を保った記事リライト
- WordPress REST API を使った公開記事の更新
- 記事未取得 / リライト失敗 / 更新失敗時の分岐終了

## サニタイズスクリプト

対象ファイル:
[`scripts/sanitize-n8n-workflow.mjs`](scripts/sanitize-n8n-workflow.mjs)

このスクリプトでは、privateな `n8n` エクスポートを GitHub 公開向けに変換できます。

主な置換対象:

- アクセストークン
- credential の ID / name
- Google Sheets の documentId / gid / URL
- インスタンス識別子
- アカウント固有の名称

### 実行例

```bash
node scripts/sanitize-n8n-workflow.mjs <private-workflow.json> <public-output.json>
```

## 技術要素

- `n8n`
- `JavaScript / Node.js`
- `Google Sheets`
- `Anthropic Claude`
- `Google Gemini`
- `Threads API`

## 公開時の注意

このリポジトリにはサニタイズ済みエクスポートのみを含めています。
以下を含む raw export は公開しない前提です。

- 実際の API トークン
- 実際の credential 接続情報
- 実際のスプレッドシートID
- 内部メタデータ

## 今後の改善案

- 投稿目的ごとにプロンプトをさらに分離する
- プロンプトを個別ファイル化して管理しやすくする
- サニタイズ漏れを検知するチェックを追加する
- スクリプトのテストを追加する

## License

This repository is shared for portfolio and educational purposes.


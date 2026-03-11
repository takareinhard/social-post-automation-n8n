# WordPress AI Rewrite Workflow

WordPress の既存記事を古い順に 1 件ずつ取得し、Brave Search と Claude を使って最新情報を反映したうえで即時公開更新する `n8n` ワークフローです。

## What It Shows

- `n8n` での定期バッチ設計
- WordPress REST API の取得 / 更新連携
- Brave Search を使った外部情報補強
- Claude を使った HTML を保った記事リライト
- `Static Data` を使った逐次処理管理
- `IF` / `No Op` による失敗時の安全な分岐

## Workflow File

- `workflows/wordpress-ai-rewrite-stable.json`

## Notes

- 公開用ファイルのため、API キーは `env` 参照のままにしています
- 実運用では `ConoHa WING` の海外アクセス制限で `REST-API` を許可する必要がありました
- 公開記事取得は認証不要、更新時のみ WordPress の Basic 認証を使う構成です

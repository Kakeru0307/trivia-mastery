# TriviaMastery

複数ゲームタイトル向けクイズサイトを目指すプロジェクトです。現状は **Valorant** 向けクイズのプロトタイプ（`/valorant`）があります。

運用ルール・構成の詳細はリポジトリルートの [`rule.md`](./rule.md) および [`.cursor/rules/`](./.cursor/rules/) を参照してください。

## 開発環境の起動（推奨: Docker）

本リポジトリでは **Docker 上での開発を標準**としています（ホストで直接 `npm run` する前提の説明は下記「参考」を参照）。

### 前提

- [Docker](https://docs.docker.com/get-docker/)（Windows なら Docker Desktop + WSL2 利用が一般的）

### 起動

リポジトリのルートで:

```bash
docker compose up --build
```

初回はイメージのビルドに時間がかかります。ログに `Ready` が出たらブラウザで次を開きます。

- トップ: [http://localhost:3000](http://localhost:3000)
- Valorant クイズ: [http://localhost:3000/valorant](http://localhost:3000/valorant)

ソースはボリュームマウントされているため、ホスト側で編集するとホットリロードされます。

### バックグラウンドで動かす場合

```bash
docker compose up -d --build
```

停止:

```bash
docker compose down
```

### Lint / 本番ビルドの確認（ワンショット）

コンテナを常時起動していなくても実行できます。

```bash
docker compose run --rm web npm run lint
docker compose run --rm -e NODE_ENV=production web npm run build
```

`docker-compose.yml` では開発用に `NODE_ENV=development` が設定されているため、`next build` のときだけ上記のように **`NODE_ENV=production` を上書き**します。

---

## 参考: ホストで npm を使う場合

create-next-app 由来の手順です。**チーム運用・CI 想定の標準は Docker 側**です。

```bash
npm install
npm run dev
```

`node_modules` の権限や環境差でつまずく場合は、Docker 手順に切り替えてください。

---

## 技術スタック（概要）

- Next.js 16（App Router）, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React

詳細は [`.cursor/rules/architecture-frontend.mdc`](./.cursor/rules/architecture-frontend.mdc) を参照。

---

## Supabase（Phase 2: クイズ DB）

1. Supabase の SQL Editor で [`docs/supabase/phase2_schema.sql`](./docs/supabase/phase2_schema.sql) を実行  
2. `games` / `questions` が作成され、`valorant` のサンプル問題が投入される  
3. `http://localhost:3000/valorant` を開く  
   - 上部の黄色通知が消えていれば DB から読み込めています  
   - 通知が出る場合は env / テーブル / RLS を確認してください

---

## Supabase（Phase 3: スコア履歴）

1. SQL Editor で [`docs/supabase/phase3_scores.sql`](./docs/supabase/phase3_scores.sql) を実行  
2. ログインした状態で `http://localhost:3000/valorant` を最後までプレイ  
3. Supabase Table Editor の `quiz_attempts` に、`user_id / game_id / correct_answers` が追加されることを確認

> 未ログイン時は保存せず、結果画面にメッセージを表示します。

---

## Next.js 公式リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

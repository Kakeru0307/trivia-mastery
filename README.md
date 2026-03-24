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

## Next.js 公式リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

---
name: impact-scope
description: >-
  Finds likely blast radius before or after editing code: ripgrep and semantic
  search for imports, routes, types, and config. Use when the user asks for
  影響範囲, どこが壊れるか, refactor impact, rename ripple, or callers of a symbol.
---

# 改修時の影響範囲の探索（impact-scope）

## 役割

- **本スキル**: 既存コードを**変更・削除・リネーム**する前後に、**どのファイル・ルート・設定が連鎖しうるか**を、検索ベースで洗い出す。
- **行わないこと**: 検索せずに断定する。変更の**最終可否の判断**だけを本スキルに任せ切らない（テスト・Docker build は `github-push` 等）。

## いつ使うか

- 関数・コンポーネント・型・定数の**リネーム・シグネチャ変更**
- **`src/app/` のルート追加・削除・レイアウト変更**
- **グローバル CSS・テーマ・フォント**の変更
- **環境変数名・`package.json` 依存**の変更
- **共有データ構造**（クイズ型・定数）の変更

## エージェント用ワークフロー

### 1. 変更対象を特定する

- **シンボル名**（`export function Foo` / `type Bar`）か **ファイルパス**か **URL パス**（`/valorant`）かをはっきりさせる。

### 2. 文字列・パスベース（必須に近い）

`rg`（ripgrep）やエディタ相当の **全文検索**で、少なくとも次を当てる。

| 観点 | 検索の例 |
|------|-----------|
| **import 経路** | 対象ファイル名、`from '.../対象'`、バレル `index` 経由ならその index も |
| **同一シンボル名** | 関数名・コンポーネント名・型名（**誤爆**に注意: 同名別物） |
| **ルート URL** | `"/valorant"`、`href=`、`redirect(`、`metadata` の `url` 等 |
| **CSS** | `globals.css` のクラス名、`@theme`、対象ページで使う **任意の固有文字列**（色コード等） |
| **設定** | `next.config`、`eslint`、`tsconfig` paths、`docker-compose`、`Dockerfile` |

### 3. 意味ベース（補助）

- **semantic search**（「どこで Valorant クイズの state を持っているか」等）で、**import に現れない依存**（コピペ・動的パス）を拾う。

### 4. Next.js App Router 特有

- **`layout.tsx`**: 変更対象の **`app/` 配下の親子**（ルート layout / ネスト layout）を上から順に列挙。
- **`page.tsx` / `route.ts`**: 同階層・兄弟ルートに **リンクや共有レイアウト**がないか。
- **`'use client'` 境界**: 親が Server Component のとき、**子だけ client** になっている箇所の連鎖。

### 5. 将来のバックエンド（Supabase 等）を触るとき

- **`src/lib/`** のクライアント初期化、**Server Actions**、**型定義**（`src/types/`）をキーワード検索。
- **RLS・テーブル名**は SQL / マイグレーション・ドキュメントがあれば **`architecture-backend.mdc`** の想定と突き合わせる。

### 6. 出力形式（ユーザーに返す）

見つかった候補を **表または箇条書き**にまとめる。

```markdown
## 変更の中心
- （ファイルまたはシンボル）

## 影響がありそうな箇所
| パス | 関係（import / ルート / 型 / 設定 等） | リスクメモ |
|------|----------------------------------------|------------|
| ... | ... | 要手動確認 / 低 等 |

## 検索で薄い可能性がある箇所
- （動的 import、文字列連結で組み立てたパス、外部ドキュメントのみ、等）

## 変更後の確認のヒント
- UI 変更なら `rule.md` のブラウザ確認。
- 全体確認なら Docker 内 `lint` / `build`（`github-push`）。
```

## 他スキルとの関係

- **実装方針**: **`.cursor/rules/architecture-frontend.mdc`** / **`architecture-backend.mdc`**。専用の実装スキルを後から足したらここにリンクを追記する。
- **コミット・検証**: **`github-push`**（Docker lint/build）。

## やらないこと

- **本番シークレット**を検索クエリや出力に含めない。
- **検索 0 件**＝**影響なし**と決めつけない（意味検索・手動確認を促す）。

---
name: explain-code
description: >-
  Onboarding-friendly summary of trivia-mastery: what exists, key docs, how to
  run, and next steps. Use for 実装範囲, 途中参加, 引き継ぎ, onboarding, or いま何ができるか.
---

# 実装範囲の説明と次の一手（explain-code）

## 役割と想定読者

- **想定読者**: **プロジェクトに途中からアサインされた人**（TriviaMastery の前提知識なしでも読み進められること）。
- **本スキル**: リポジトリを**実際に読んだうえで**、**文脈 → ドキュメント → コード → 次の一手**の順で整理する。
- **行わないこと**: 未確認の推測を事実として書く。ユーザーが**最優先タスク**を指定していればそれを先に書く。

## 書き方のルール（途中参加者向け）

- **略語は初出で短く解説**する（例: RLS = Row Level Security、DB で行単位のアクセス制御）。
- **パスはリポジトリルートからの相対パス**で統一（例: `src/app/valorant/page.tsx`）。
- **「実装済み」と「Rule 上の予定」**を混同しない。予定は「ドキュメント上の予定」と明記。
- **このリポの運用**: フロントの lint/build は **`github-push` スキルどおり Docker 内**が標準。ルートの `README.md` は create-next-app 由来で **`npm run dev` 中心の記述のまま**のことがある → **Docker を使う旨を説明に含め、README とズレている点を一言添える**。

## 参照する情報（必要に応じて読む）

| 優先 | 内容 |
|------|------|
| 高 | **`package.json`**、`src/` 配下の構成 |
| 高 | **主要ページ**（`src/app/page.tsx`, `src/app/valorant/page.tsx`, `src/app/layout.tsx`） |
| 中 | **`.cursor/rules/architecture-frontend.mdc`**、**`architecture-backend.mdc`** |
| 中 | **`docker-compose.yml`** / **`Dockerfile.dev`**（起動コマンドの事実確認） |
| 低 | **`rule.md`**、**`program.md`**（運用・過去トラブル） |
| 任意 | **`git log -8 --oneline`**、`git status -sb` |

## エージェント用ワークフロー

1. 上表に沿って**事実を集める**。
2. **アーキテクチャ Rule と実コードの差**を、専門用語を避けすぎずつつ**一言で噛み砕く**。
3. 出力は **日本語**で、次の**見出し構成を必須**とする（該当なしは「未着手」「ドキュメントのみ」と明記）。

### 出力テンプレート（途中参加向け）

```markdown
## このリポジトリで作っているもの（30秒版）
- （誰向けの何か、1〜2 文。例: 複数ゲームのクイズサイトのプロトで、現状は Valorant の画面がある、等）

## まず読むとよいドキュメント（順不同でよい）
- `rule.md` … エージェント／開発の運用（UI 変更後の確認依頼など）
- `.cursor/rules/architecture-frontend.mdc` … 技術スタック・命名・`src/` の役割・UI 方針
- `.cursor/rules/architecture-backend.mdc` … バックエンド想定・フェーズ・トラブル切り分け
- `program.md` … 過去にハマった点（あれば）

## 環境の立ち上げ（このプロジェクトでの事実）
- （例: リポジトリルートで `docker compose up` または `docker compose run ...`。ポート `3000`。**README だけ見ると npm 直叩きに見えるが、運用ルール上は Docker が標準**、など）

## いま実装されていること（コードベース）
- （URL や画面と、対応するファイルパス）

## まだない／プロトタイプ段階のこと
- （ホームハブ、Supabase、共通コンポーネント分割など）

## ロードマップ・ドキュメントとの対応
- （Phase や「予定」と、いまのコードの位置づけ）

## 次に取り組むとよいこと（提案）
1. （優先度高・理由一行・可能なら見積り感）
2. （中）
3. （低または任意）

## 関連するスキル・作業の流れ
- ブランチ: `git-branch` / コミット・push: `github-push` / PR: `github-pull-request`
```

4. **「次に取り組むこと」は 3 件前後**。可能なら **見積り**（小/中/大 や 半日 等）を付ける。
5. **UI 変更を含む提案**では、**ユーザーがブラウザで確認する**運用があることを短く書く（`rule.md` 準拠）。

## 他スキルとの関係

- **コード変更や push** は **`github-push`**。ブランチ作成は **`git-branch`**。
- 設計の深掘りは **architecture Rule** 本体を読んでもらう旨をテンプレの「まず読む」に含める。

## やらないこと

- **存在しない機能**を実装済みと書く。
- **秘密情報**（`.env` の値、トークン）を出力する。

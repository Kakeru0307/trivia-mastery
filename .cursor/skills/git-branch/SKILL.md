---
name: git-branch
description: >-
  Defines branch naming for trivia-mastery and guides creating/checking out
  branches from the default branch. Use when the user asks to create a branch,
  ブランチを切る, ブランチ作成, switch branch, or name a topic branch.
---

# Git ブランチの作成・切り替え（trivia-mastery）

## 役割分担

- **本スキル**: ブランチの**命名規則**、**新規ブランチの作成**、**チェックアウト**（作業開始の土台）。
- **別スキル `github-push`**: ステージング・コミット・プッシュ・HTTPS まわり。ブランチを切った**あと**の共有はそちら。

## デフォルトブランチ

- 本リポジトリの既定は **`master`**（`main` に統一していない限り、新規ブランチの起点は `master`）。

## ブランチ名フォーマット（確定）

- 全体は **kebab-case**（例: `cursor-skills`, `fix-valorant-layout`）。
- 先頭は用途別プレフィックス:

| プレフィックス | 用途 | 例 |
|----------------|------|-----|
| `feature/` | 機能・コンテンツ・スキル追加など | `feature/cursor-skills` |
| `fix/` | 不具合のみ | `fix/valorant-layout` |
| `chore/` | ルール・README・設定のみ | `chore/update-rule-md` |

- **Cursor 用スキル**を追加・整理する作業では、内容が分かるように  
  `feature/skill-<名前>` または `feature/cursor-skill-<名前>` のどちらかを使う（例: `feature/skill-github-branch`）。

## マージ後のブランチ

- **マージ後もリモート／ローカルの作業ブランチは削除しない**（プロジェクト方針）。

## エージェント用ワークフロー

1. **`git status`** で未コミットの有無を把握する。ユーザーが WIP のまま切り替えたい場合は指示に従う。
2. **`git fetch origin`**（`origin` がある場合）。
3. **`git checkout master`**（またはユーザー指定の起点ブランチ）。
4. リモート追従がある場合: **`git pull origin master`**（競合はユーザーに確認）。
5. 新規作成: **`git checkout -b <プレフィックス>/<kebab-case 名>`**  
   例: `git checkout -b feature/skill-git-branch`
6. 既存ブランチへ移動のみのとき: **`git checkout <ブランチ名>`**

## やらないこと

- **`git push`・コミットメッセージ・Docker による lint/build** は `github-push` の手順に従う（本スキルだけで push 完了とみなさない）。
- ブランチの**強制削除・履歴の書き換え**（`push --force` 等）は、ユーザーが明示的に求めない限り行わない。

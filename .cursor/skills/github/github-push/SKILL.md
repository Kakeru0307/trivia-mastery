---
name: github-push
description: >-
  Guides committing and pushing to GitHub over HTTPS for this repo; requires
  Docker-run lint/build (no host npm), user verification for UI or other changes
  the agent cannot validate. Use when the user asks to push, プッシュ, commit,
  コミット, or upload to GitHub.
---

# GitHub へコミット・プッシュ（trivia-mastery）

## 適用範囲

- **対象**: 既にチェックアウト済みのブランチ上での `add` → `commit` → `push`、および関連する Git 操作（HTTPS）。
- **対象外**: ブランチの**新規作成・命名・切り替え**は **`git-branch` スキル**（`.cursor/skills/github/git-branch/`）に任せる。本スキルでは行わないか、ユーザー指示がある場合のみ `git-branch` と整合する手順に従う。
- **PR 作成**: **`github-pull-request` スキル**（`.cursor/skills/github/github-pull-request/`）に任せる（push 後に依頼される想定）。

## 前提

- **リモート**: パブリック公開予定。**HTTPS** の `origin` を想定（例: `https://github.com/<owner>/<repo>.git`）。認証情報やトークンはスキル・チャットに書かない。
- **コミットメッセージ**: **日本語**でよい。Conventional Commits 等の特別な形式は**要求しない**（プロジェクトで別ルールが決まったらそちらを優先）。
- **Node / npm**: **ホスト上では `npm`・`npx`・`node` を使わない**。依存のインストール、lint、build、dev サーバー確認のいずれも **Docker 経由**（`docker compose` の `web`）に限定する。

## ワークフロー（エージェント用チェックリスト）

1. **`git status`** と **`git diff`**（必要なら `git diff --staged`）で変更内容を把握する。
2. **コミットに含めてはいけないもの**を確認する: `.env`、`.env.*`、鍵、トークン、ローカルだけの設定、意図しない `node_modules` の変更など。疑わしければユーザーに確認する。
3. **必須チェック**（下記「プッシュ前の必須チェック」）をすべて満たす。**B（lint / build）は常に必須**。**C** は該当する変更があるとき必須。エージェント側で Docker が使えない場合は、ユーザーに WSL 等で同コマンドを実行してもらい、成功ログまたは結果を共有してもらってから push 手順に進む。
4. **`git add`**（範囲はユーザー指示または変更の妥当性に基づく）。
5. **`git commit -m "..."`** — 日本語で、変更の要約と理由が分かる一文〜数行。
6. **`git push origin <現在のブランチ名>`**（またはユーザー指定のリモート・ブランチ）。
7. **PR が必要なら** `github-pull-request` スキルに従い、ブラウザで作成する手順・本文案内を行う。
8. **（任意）タグ・Release**: ユーザーがバージョン公開を求める場合のみ。`git tag` / `git push origin <tag>`、GitHub の Releases 画面での作成を案内（手順のみ。タグ名のポリシーはユーザー確認）。

## プッシュ前の必須チェック（確定ポリシー）

本プロジェクトの**唯一の Node 実行経路は Docker**（`docker-compose.yml` の `web` サービス）。エージェント実行環境で Docker が使えない場合は、**ユーザーに WSL 等で下記コマンドを実行**してもらい、成功を確認してから push に進む。

| 段階 | 必須 / 条件 | 内容 |
|------|-------------|------|
| **A** | **常に** | `git status` / diff で意図しないファイルが混ざっていないこと |
| **B** | **常に** | コンテナ内で `npm run lint` と `npm run build` が成功すること |
| **C** | **該当時** | UI の変更、または**エージェントがこちらで検証できない変更**があるとき: 期待される挙動を具体的に説明し、`rule.md` の UI/UX 方針に沿って**ユーザーにブラウザ等での確認を依頼**し、問題なければ push 可とする |

**C が該当しうる例**（いずれもエージェントが同等の検証をしない場合）:

- レイアウト・アニメーション・テーマなど **見た目・操作感** に触れる変更
- ブラウザ API、実デバイス、実ネットワークが前提の挙動
- Docker 外の手順や本番のみで現れる差分

**コンテナ内コマンド**（プロジェクトルート）:

```bash
docker compose run --rm web npm run lint
docker compose run --rm -e NODE_ENV=production web npm run build
```

`docker-compose.yml` の `web` は `NODE_ENV=development` のため、`next build` だけ **`NODE_ENV=production` を上書き**する（開発サーバー用の compose はそのまま）。

**禁止**: ホストで `npm install` / `npm run lint` / `npm run build` / `npm run dev` 等をエージェントが実行してプッシュ可否を判断すること（方針違反）。

## HTTPS での push が失敗したとき

- `origin` が SSH（`git@github.com:...`）になっていないか確認。HTTPS に統一するなら: `git remote -v` で確認し、必要なら `git remote set-url origin https://github.com/<owner>/<repo>.git` を案内（実 URL はユーザーが持つ）。
- 認証エラー: GitHub の **Personal Access Token**（classic または fine-grained）や **Git Credential Manager** の利用を案内。トークン値は要求・表示しない。

## やらないこと

- 秘密情報をコミットに含める、またはチャットに貼らせる。
- ホストで `npm` / `npx` / `node` を実行して検証・インストールする（Docker 経由に限る）。
- feature ブランチ運用の**標準手順を新設・変更する**（別スキル領域）。

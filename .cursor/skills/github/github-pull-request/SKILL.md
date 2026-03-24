---
name: github-pull-request
description: >-
  Guides opening a GitHub pull request via the web UI (HTTPS) after the branch
  is pushed: base branch, title/body template, compare URL. Use when the user
  asks for a PR, プルリク, プルリクエスト, or merge request on GitHub.
---

# GitHub でプルリクエストを作成（trivia-mastery）

## 役割分担

- **前提**: 作業ブランチの変更は **`github-push`**（`.cursor/skills/github/github-push/`）で **リモートへ push 済み**であること。未 push なら先にそちらを完了する。
- **本スキル**: GitHub 上で **PR を開く**ための手順、タイトル・本文の案、URL の組み立て。
- **ブランチの切り方・命名**: **`git-branch`**（`.cursor/skills/github/git-branch/`）。

## 前提

- **ベースブランチ**: 特に指定がなければ **`master`**（本リポのデフォルト）。
- **認証**: ブラウザで GitHub にログイン済みであること。PAT やパスワードをチャットに書かない。
- **GitHub CLI (`gh`)**: インストール・ログイン済みなら `gh pr create` も使えるが、**必須ではない**。標準は **Web UI**。

## エージェント用ワークフロー

1. **`git branch --show-current`** でヘッドブランチ名を確認する（例: `feature/cursor-skills`）。
2. **`git status`** で未 push のコミットがないか確認する。あれば push は `github-push` に従い **`git push -u origin <ブランチ名>`** を完了させる。
3. **`git remote get-url origin`** から `owner` と `repo` を取り出す。  
   - 例: `https://github.com/Kakeru0307/trivia-mastery.git` → `Kakeru0307`, `trivia-mastery`
4. **PR 作成用 URL** をユーザーに渡す（ブランチに `/` が含まれてもそのまま利用できることが多い。開けない場合は compare 形式を試す）。

   - **推奨（新規 PR）**: `https://github.com/<owner>/<repo>/pull/new/<headブランチ名>`
   - **代替（compare）**: `https://github.com/<owner>/<repo>/compare/master...<headブランチ名>`

5. **タイトル案**（日本語で簡潔）: 変更の一行要約（例: 「Cursor 用 GitHub スキルを github 配下に整理」）。
6. **本文**は下記テンプレをベースに、差分に合わせてチャットでドラフトする。ユーザーが Web の説明欄に貼る。

### PR 本文テンプレ

```markdown
## 概要
（何を・なぜ変更したか）

## 確認したこと
- [ ] Docker 内で `npm run lint` / `npm run build`（`NODE_ENV=production` 上書き）が成功
- [ ] （該当時）画面・エージェント未検証の挙動を確認（URL・手順）

## 備考
（レビュー時に見てほしい点、既知の制限）
```

7. **ドラフト PR** にしたい場合は、作成画面で **Create draft pull request** を選ぶよう案内する。
8. **マージ方法・レビュー必須**などはリポジトリ設定に従う。エージェントがリポジトリ設定を変更しない。

## 任意: GitHub CLI

ユーザーが `gh` を使う場合の例（対話が必要ならユーザー端末で実行）:

```bash
gh pr create --base master --head <ブランチ名> --title "..." --body-file -
```

## やらないこと

- **push や Docker 検証を省略して PR だけ完了扱いにしない**。
- **トークン・シークレット**を本文やコメントに含めない。
- **リポジトリのブランチ保護ルールや必須レビュー**を勝手に変更しない。

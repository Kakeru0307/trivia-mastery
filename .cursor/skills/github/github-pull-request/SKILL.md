---
name: github-pull-request
description: >-
  Creates a GitHub pull request when possible via gh pr create or the REST API
  with GITHUB_TOKEN; falls back to Web URLs and pasted body. Use when the user
  asks for a PR, プルリク, プルリクエスト, or merge request on GitHub.
---

# GitHub でプルリクエストを作成（trivia-mastery）

## 役割分担

- **前提**: 作業ブランチは **`github-push`**（`.cursor/skills/github/github-push/`）で **リモートへ push 済み**であること。未 push なら先にそちらを完了する。
- **本スキル**: **PR を実際に作成する**（可能なら CLI/API）。できない環境だけ Web URL と本文案内にフォールバックする。
- **ブランチの切り方・命名**: **`git-branch`**（`.cursor/skills/github/git-branch/`）。

## 前提

- **ベースブランチ**: 特に指定がなければ **`master`**。
- **トークン・PAT をチャットに貼らない**（ログにも出さない）。

## エージェント用ワークフロー（PR 作成まで実行）

1. **`git branch --show-current`** でヘッドブランチ名を取得する。
2. **`git status`** で未 push のコミットがないか確認する。あれば **`github-push`** に従い push してから続行する。
3. **既存 PR の有無**: `gh pr list --head <ブランチ名> --state all` が使えるなら実行する。既に **OPEN** がある場合は **新規作成せず**、その PR の URL を返す。
4. **タイトル**（日本語・一行）と **本文**（下記テンプレを差分に合わせて埋める）を用意する。
5. **PR 作成（この順で試す）**

   **A. GitHub CLI（最優先）**  
   `gh auth status` が成功し `gh` が使えるとき:

   ```bash
   gh pr create --base master --head "<ブランチ名>" --title "<タイトル>" --body-file "<本文パス>"
   ```

   - 本文はリポジトリ内の一時ファイル（例: `.git-pr-body-temp.md`）に書き、`gh pr create` 後に **削除**する。コミットに含めない。
   - `--draft` が必要ならユーザー指示に従い付与する。

   **B. REST API（`gh` が無いがトークンがあるとき）**  
   環境変数 **`GITHUB_TOKEN`** または **`GH_TOKEN`** が設定されているときのみ（値は表示しない）:

   - `git remote get-url origin` から `owner` / `repo` を解析する。
   - `POST https://api.github.com/repos/<owner>/<repo>/pulls` に `{"title","body","head":"<ブランチ名>","base":"master"}` を送る（`curl` + `Authorization: Bearer`）。  
   - head は **同じリポジトリ上のブランチ名**でよい（fork のときは `ユーザー:ブランチ` が必要な場合あり）。

   **C. フォールバック（A も B も不可）**  
   - `https://github.com/<owner>/<repo>/pull/new/<ブランチ名>`  
   - または `compare/master...<ブランチ名>`  
   - タイトル・本文をチャットに出し、ユーザーに Web で貼り付けてもらう。

6. 成功時は **PR の URL** をユーザーに伝える。

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

## ユーザー側の準備（自動作成を安定させる）

- **`gh`**: [GitHub CLI](https://cli.github.com/) を入れ、`gh auth login` 済み（WSL でブラウザが開かない場合は URL を手動で開く）。
- **トークンのみ**で API を使う場合: シェルに `GITHUB_TOKEN`（repo 相当の権限）を設定。**リポジトリやチャットにコミットしない**。

## やらないこと

- **push や Docker 検証を省略して PR だけ完了扱いにしない**。
- **トークン・シークレット**を本文・コメント・一時ファイルのコミットに含めない。
- **リポジトリのブランチ保護ルール**を勝手に変更しない。

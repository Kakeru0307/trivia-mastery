# TriviaMastery - Agent Operational Rules

> **Cursor Rules**: 本ドキュメントと**同一内容**を **`.cursor/rules/triviamastery.mdc`**（`alwaysApply: true`）に置いている。**編集時は `rule.md` と `.mdc` の両方を同じ内容に更新**し、ずれを作らないこと。

## 【最優先事項】
1. **本リポジトリの運用ルールを最初に読み込み、理解すること**: セッション開始時、または本プロジェクトでの作業開始時に、必ず **本ファイルおよび `.cursor/rules/triviamastery.mdc`（内容は同一）** を最新の状態として同期する。
2. **UI/UX 視覚確認プロトコルの遵守**: ブラウザでの直接確認が不可能なため、UI 変更後は必ず「期待される挙動」を具体的に説明し、ユーザーに `http://localhost:3000/valorant` 等での確認を依頼する。ユーザーの承認（OK）を得るまでタスク完了とは見なさない。
3. **ナレッジ連動型デバッグの実施**: エラー発生時は修正前に必ず `program.md` を参照し、過去の知見を活用する。新しい解決策を発見した際は、即座に `program.md` に追記し、プロジェクトの集合知を更新する。

## 開発の参照（フロント）

- **技術スタック、命名規則、`src/` のディレクトリ役割、UI/ビジュアル方針**は **`.cursor/rules/architecture-frontend.mdc`** に集約している（`globs: src/**/*.{tsx,ts,css}` で該当ファイル編集時に参照されやすい）。

## `.cursor/` 直下（Cursor プロジェクト設定・エージェント）
- **役割**: リポジトリに含め、**別 PC でクローンしたときも同じ Cursor / エージェント向けの約束事**を共有する。
- **`.cursor/rules/`**: Cursor **Rules**（`.mdc` + YAML フロントマター）。
  - **`triviamastery.mdc`**: 運用ルール全文。**`alwaysApply: true`**。
  - **`architecture-backend.mdc`**: バックエンド・プロダクト・Supabase・**フェーズ計画**の参照。**`alwaysApply: false`**。
  - **`architecture-frontend.mdc`**: フロントの**技術・命名・ディレクトリ・UI**の参照。**`alwaysApply: false`**、`globs: src/**/*.{tsx,ts,css}`。
- **`.cursor/skills/`**: **Agent Skills** 用。各スキルは **サブフォルダ 1 つ + その中の `SKILL.md`**（YAML フロントマター付き）で定義する。
- **`.cursor/skills/github/`**: GitHub まわりのスキルをまとめたディレクトリ。
  - **`github-push/`**: コミット・プッシュ（Docker 内 lint/build、HTTPS 等）。
  - **`git-branch/`**: ブランチ命名・作成・チェックアウト。
  - **`github-pull-request/`**: PR 作成（`gh` や API が使えれば実行、不可なら Web 案内）。
- **`.cursor/skills/explain-code/`**: **途中参加・引き継ぎ向け**に、実装範囲・読む順・起動方法・次の一手を、コードとアーキテクチャ Rule に基づき説明する。
- **運用**: スキルを追加・変更したら **Git でコミット**し、他メンバーや他マシンは `git pull` で揃える。Cursor のバージョンによっては **ネストした `skills/github/...` の検出**に差があるため、一覧に出ない場合は Cursor 側の Skills 設定を確認する。
- **スキルと運用ルール文書の同期（必須）**: `.cursor/skills/` に **新規スキルを追加**したり、スキルを **移動・分割・リネーム・廃止**したら、**必ず同じ変更セットで** (1) 本ファイルおよび **`.cursor/rules/triviamastery.mdc` の「`.cursor/` 直下」節**に **当該スキルのパスと役割の一言説明**を追記・修正し、(2) **`rule.md` と `.cursor/rules/triviamastery.mdc` の本文を同一に保つ**。**`SKILL.md` のみ追加・変更して運用ルール文書を直さないままタスク完了とみなさない。**
- **参照用 Rule の一覧同期**: `.cursor/rules/` に **新しい `.mdc`（運用以外の参照ドキュメント）** を増やしたら、**本節の `.cursor/rules/` 箇条書きにパスと役割を追記**し、**`rule.md` と `triviamastery.mdc` の両方で一覧を同じ内容に更新**する。参照 `.mdc` の**全文を** `triviamastery.mdc` に複製する必要はない。

### Cursor Rules との関係
- **`.cursor/rules/triviamastery.mdc`**: Cursor エージェント向け。**`alwaysApply: true`** で常時適用。
- **`rule.md`**: 本ファイル。GitHub 閲覧・Cursor 以外のツール用。**`.mdc` と内容を常に一致させる。**

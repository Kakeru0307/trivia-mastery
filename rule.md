# TriviaMastery - Agent Operational Rules

## 【最優先事項】
1. **本ファイルを最初に読み込み、理解すること**: セッション開始時、または本プロジェクトでの作業開始時に、必ず本ファイルの内容を最新の状態として同期する。
2. **UI/UX 視覚確認プロトコルの遵守**: ブラウザでの直接確認が不可能なため、UI 変更後は必ず「期待される挙動」を具体的に説明し、ユーザーに `http://localhost:3000/valorant` 等での確認を依頼する。ユーザーの承認（OK）を得るまでタスク完了とは見なさない。
3. **ナレッジ連動型デバッグの実施**: エラー発生時は修正前に必ず `program.md` を参照し、過去の知見を活用する。新しい解決策を発見した際は、即座に `program.md` に追記し、プロジェクトの集合知を更新する。

## 開発ガイドライン
- **ファイル操作の安全性**:
  - 大規模ファイル（100行以上）の新規作成・更新は、シェルのバッファ制限を避けるため、必ず `generalist` エージェントまたは Python ブリッジを使用する。
  - 特殊文字（`${}` や引用符）の保護のため、書き込み時は `cat << "EOF"` または Python Raw String 形式を徹底する。
- **インフラ管理**:
  - Docker コンテナの操作（up/down/restart）は Gemini CLI から直接行わず、WSL ターミナルでユーザーに実行を依頼する。
- **技術スタックの遵守**:
  - Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Lucide React を標準とする。
  - ゲームらしい没入感の高い UI デザインと、TypeScript による型安全性を両立させる。

### 命名規則 (Naming Conventions)
- **ディレクトリとファイル**: 
  - ルーティング/ディレクトリ: `kebab-case` (例: `src/app/valorant-quiz/`)
  - コンポーネントファイル: `PascalCase` (例: `QuizCard.tsx`)
- **変数・関数・型**:
  - 変数・関数: `camelCase` (例: `currentStep`, `handleSelectOption`)
  - 定数: `UPPER_SNAKE_CASE` (例: `QUIZ_DATA`, `MAX_SCORE`)
  - 型 (Type / Interface): `PascalCase` (例: `QuizQuestion`, `UserSession`)
- **React コンポーネント**:
  - コンポーネント名: `PascalCase` (例: `ValorantQuizPage`)
  - Props: `camelCase` (例: `isSelected`, `onClickNext`)
- **CSS / Tailwind**:
  - カスタムクラス: `kebab-case` (Tailwind v4 の `@theme` 拡張等)

### ディレクトリ構成 (Directory Structure)
- **src/app/**: ルーティングと各ページ（Page Components）のみを配置する。
- **src/components/**: 再利用可能な UI 部品（共通コンポーネント）を配置する。
- **src/lib/**: 外部 API (Supabase 等) との連携ロジックや、ユーティリティ関数を配置する。
- **src/types/**: 複数のファイルで共有される TypeScript の型定義ファイルを配置する。
- **src/assets/**: 画像、フォント、静的リソースを配置する。

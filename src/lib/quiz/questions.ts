import { tryCreateSupabaseServerClient } from "@/lib/supabase/server";
import type { QuizQuestion } from "@/types/quiz";

type QuestionRow = {
  id: number;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_option_index: number;
  explanation: string | null;
  category: string | null;
  sort_order: number;
};

export const FALLBACK_VALORANT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "ジェットのアルティメット「ブレードストーム」は、開始時にナイフを何本持っていますか？",
    options: ["3本", "5本", "6本", "7本"],
    correctAnswer: 1,
    explanation:
      "ジェットのアルティメット『ブレードストーム』は、開始時に5本のクナイを所持しており、キルで補充されます。",
    category: "エージェント",
  },
  {
    id: 2,
    question:
      "マップ「バインド」において、AショートからBサイトへ移動できるテレポーターの出口はどこにありますか？",
    options: ["B ウィンドウ (フーカー)", "B ロング", "B リンク", "B エルボー"],
    correctAnswer: 0,
    explanation:
      "バインドのAショートにあるテレポーターは、Bウィンドウ付近に繋がっています。",
    category: "マップ",
  },
  {
    id: 3,
    question: "キルジョイの「タレット」の最大HPはいくらですか？（パッチ 8.0以降）",
    options: ["100 HP", "125 HP", "150 HP", "200 HP"],
    correctAnswer: 0,
    explanation: "パッチ 8.0でタレットの耐久性が調整され、現在は 100 HP となっています。",
    category: "エージェント",
  },
];

export type QuizFetchResult = {
  questions: QuizQuestion[];
  gameId: number | null;
  source: "database" | "fallback";
  reason?: string;
};

export async function getQuizQuestionsBySlug(gameSlug: string): Promise<QuizFetchResult> {
  const supabase = await tryCreateSupabaseServerClient();

  if (!supabase) {
    return {
      questions: FALLBACK_VALORANT_QUESTIONS,
      gameId: null,
      source: "fallback",
      reason: "Supabase env is missing",
    };
  }

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("id")
    .eq("slug", gameSlug)
    .single();

  if (gameError || !game) {
    return {
      questions: FALLBACK_VALORANT_QUESTIONS,
      gameId: null,
      source: "fallback",
      reason: "Game not found in DB",
    };
  }

  const { data: rows, error: rowsError } = await supabase
    .from("questions")
    .select(
      "id,question_text,option_1,option_2,option_3,option_4,correct_option_index,explanation,category,sort_order"
    )
    .eq("game_id", game.id)
    .order("sort_order", { ascending: true });

  if (rowsError || !rows || rows.length === 0) {
    return {
      questions: FALLBACK_VALORANT_QUESTIONS,
      gameId: game.id,
      source: "fallback",
      reason: "Questions not found in DB",
    };
  }

  const normalized = (rows as QuestionRow[]).map((row) => ({
    id: row.id,
    question: row.question_text,
    options: [row.option_1, row.option_2, row.option_3, row.option_4],
    correctAnswer: row.correct_option_index,
    explanation: row.explanation ?? "解説は準備中です。",
    category: row.category ?? "一般",
  }));

  return {
    questions: normalized,
    gameId: game.id,
    source: "database",
  };
}

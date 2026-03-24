import QuizRunner from "@/components/quiz/QuizRunner";
import { getQuizQuestionsBySlug } from "@/lib/quiz/questions";

export default async function ValorantQuizPage() {
  const { questions, gameId, source, reason } = await getQuizQuestionsBySlug("valorant");

  return (
    <>
      {source === "fallback" && (
        <div className="bg-amber-100 px-4 py-2 text-sm text-amber-900">
          DB の問題取得に失敗したため、ローカル問題で表示しています。
          {reason ? ` (${reason})` : ""}
        </div>
      )}
      <QuizRunner questions={questions} gameId={gameId} />
    </>
  );
}

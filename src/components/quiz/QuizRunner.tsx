"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCcw, Info } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { QuizQuestion } from "@/types/quiz";

type QuizRunnerProps = {
  questions: QuizQuestion[];
  gameId: number | null;
};

export default function QuizRunner({ questions, gameId }: QuizRunnerProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const currentQuestion = questions[currentStep];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctAnswer) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setSaveMessage(null);
    setHasSaved(false);
  };

  useEffect(() => {
    if (!isFinished || hasSaved) return;

    const saveAttempt = async () => {
      setHasSaved(true);

      if (!gameId) {
        setSaveMessage("ゲーム情報が未解決のためスコア保存をスキップしました。");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSaveMessage("未ログインのためスコア保存は行いませんでした。");
        return;
      }

      const { error } = await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        game_id: gameId,
        total_questions: questions.length,
        correct_answers: score,
      });

      if (error) {
        setSaveMessage(`スコア保存に失敗しました: ${error.message}`);
        return;
      }

      setSaveMessage("スコア履歴を保存しました。");
    };

    void saveAttempt();
  }, [gameId, hasSaved, isFinished, questions.length, score, supabase]);

  if (isFinished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1923] p-6 text-white font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded bg-[#1F2326] border-t-4 border-[#FF4655] p-10 text-center shadow-2xl"
        >
          <Trophy className="mx-auto mb-6 h-20 w-20 text-[#FF4655]" />
          <h1 className="mb-2 text-4xl font-black italic uppercase tracking-tighter">
            Mission Accomplished
          </h1>
          <div className="my-8 text-6xl font-bold text-[#FF4655]">
            {score} / {questions.length}
          </div>
          {saveMessage && <p className="mb-4 text-xs text-gray-300">{saveMessage}</p>}
          <button
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-2 rounded bg-white py-4 font-bold text-black uppercase transition-all hover:bg-[#FF4655] hover:text-white"
          >
            <RefreshCcw size={20} /> Retry Mission
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F1923] p-4 text-white font-sans md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 flex items-end justify-between border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#FF4655]">
              TriviaMastery // VAL
            </h2>
            <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-500 opacity-50">
              Status: Active
            </p>
          </div>
          <div className="text-right">
            <div className="leading-none text-2xl font-black italic tracking-tighter">
              {String(currentStep + 1).padStart(2, "0")} <span className="text-gray-700">/</span>{" "}
              {String(questions.length).padStart(2, "0")}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-10">
              <span className="mb-4 inline-block bg-[#FF4655] px-2 py-1 text-[10px] font-black italic uppercase tracking-widest">
                Category: {currentQuestion.category}
              </span>
              <h1 className="text-2xl font-bold uppercase tracking-tight md:text-4xl">
                {currentQuestion.question}
              </h1>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                let borderClass = "border-gray-800";
                if (isAnswered) {
                  if (isCorrect)
                    borderClass =
                      "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-green-500/10 text-green-400";
                  else if (isSelected) borderClass = "border-red-500 bg-red-500/10 text-red-400";
                  else borderClass = "opacity-50 grayscale border-gray-900";
                }
                return (
                  <button
                    key={index}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(index)}
                    className={`group relative flex items-center justify-between overflow-hidden bg-[#1F2326] p-5 text-left font-bold border-2 transition-all hover:bg-[#2F353A] ${borderClass}`}
                  >
                    <span className="relative z-10">{option}</span>
                    <div className="relative z-10">
                      {isAnswered && isCorrect && <CheckCircle2 size={20} />}
                      {isAnswered && isSelected && !isCorrect && <XCircle size={20} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex gap-4 border-l-4 border-blue-500 bg-[#1F2326] p-6">
                  <Info className="shrink-0 text-blue-400" size={20} />
                  <div>
                    <h4 className="mb-1 text-[10px] font-black italic uppercase tracking-widest text-blue-400">
                      Tactical Report
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-300">{currentQuestion.explanation}</p>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="ml-auto flex items-center gap-2 bg-white px-10 py-5 text-xl font-black italic uppercase tracking-tighter text-black transition-all hover:bg-[#FF4655] hover:text-white"
                >
                  {currentStep < questions.length - 1 ? "Next Phase" : "Mission Result"}{" "}
                  <ChevronRight size={24} />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

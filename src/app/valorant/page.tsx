'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCcw, Info } from 'lucide-react';

const QUIZ_DATA = [
  {
    id: 1,
    question: "ジェットのアルティメット「ブレードストーム」は、開始時にナイフを何本持っていますか？",
    options: ["3本", "5本", "6本", "7本"],
    correctAnswer: 1,
    explanation: "ジェットのアルティメット『ブレードストーム』は、開始時に5本のクナイを所持しており、キルで補充されます。",
    category: "エージェント"
  },
  {
    id: 2,
    question: "マップ「バインド」において、AショートからBサイトへ移動できるテレポーターの出口はどこにありますか？",
    options: ["B ウィンドウ (フーカー)", "B ロング", "B リンク", "B エルボー"],
    correctAnswer: 0,
    explanation: "バインドのAショートにあるテレポーターは、Bウィンドウ付近に繋がっています。",
    category: "マップ"
  },
  {
    id: 3,
    question: "キルジョイの「タレット」の最大HPはいくらですか？（パッチ 8.0以降）",
    options: ["100 HP", "125 HP", "150 HP", "200 HP"],
    correctAnswer: 0,
    explanation: "パッチ 8.0でタレットの耐久性が調整され、現在は 100 HP となっています。",
    category: "エージェント"
  }
];

export default function ValorantQuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_DATA[currentStep];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctAnswer) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentStep < QUIZ_DATA.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0); setSelectedOption(null); setIsAnswered(false); setScore(0); setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#0F1923] text-white flex flex-col items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1F2326] border-t-4 border-[#FF4655] p-10 rounded shadow-2xl max-w-md w-full text-center">
          <Trophy className="w-20 h-20 text-[#FF4655] mx-auto mb-6" />
          <h1 className="text-4xl font-black mb-2 italic uppercase tracking-tighter">Mission Accomplished</h1>
          <div className="text-6xl font-bold text-[#FF4655] my-8">{score} / {QUIZ_DATA.length}</div>
          <button onClick={handleReset} className="w-full bg-white text-black font-bold py-4 rounded hover:bg-[#FF4655] hover:text-white transition-all flex items-center justify-center gap-2 uppercase">
            <RefreshCcw size={20} /> Retry Mission
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1923] text-white p-4 md:p-8 font-sans overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-[#FF4655] font-black italic text-xl uppercase tracking-tighter">TriviaMastery // VAL</h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold font-mono opacity-50">Status: Active</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black italic tracking-tighter leading-none">
              {String(currentStep + 1).padStart(2, '0')} <span className="text-gray-700">/</span> {String(QUIZ_DATA.length).padStart(2, '0')}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="mb-10">
              <span className="inline-block bg-[#FF4655] text-[10px] font-black uppercase tracking-widest px-2 py-1 mb-4 italic">Category: {currentQuestion.category}</span>
              <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-tight">{currentQuestion.question}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                let borderClass = "border-gray-800";
                if (isAnswered) {
                  if (isCorrect) borderClass = "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-green-500/10 text-green-400";
                  else if (isSelected) borderClass = "border-red-500 bg-red-500/10 text-red-400";
                  else borderClass = "opacity-50 grayscale border-gray-900";
                }
                return (
                  <button key={index} disabled={isAnswered} onClick={() => handleSelectOption(index)}
                    className={`text-left p-5 border-2 transition-all font-bold ${borderClass} bg-[#1F2326] hover:bg-[#2F353A] flex justify-between items-center group relative overflow-hidden`}
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
                <div className="bg-[#1F2326] p-6 border-l-4 border-blue-500 flex gap-4">
                  <Info className="text-blue-400 shrink-0" size={20} />
                  <div>
                    <h4 className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-1 italic">Tactical Report</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                </div>
                <button onClick={handleNext} className="ml-auto flex items-center gap-2 bg-white text-black font-black italic uppercase px-10 py-5 hover:bg-[#FF4655] hover:text-white transition-all tracking-tighter text-xl">
                  {currentStep < QUIZ_DATA.length - 1 ? 'Next Phase' : 'Mission Result'} <ChevronRight size={24} />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

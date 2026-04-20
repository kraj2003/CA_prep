"use client";

import { useState, useCallback } from "react";
import { 
  Brain, CheckCircle, XCircle, Clock, ChevronRight, 
  RotateCcw, Trophy, Target, Zap, BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mcq } from "@/lib/types";
import { cn } from "@/lib/utils";

type QuizModeProps = {
  mcqs: Mcq[];
  topic: string;
  onComplete?: (score: number, total: number, answers: QuizAnswer[]) => void;
};

export type QuizAnswer = {
  questionIndex: number;
  selectedOption: number | null;
  correctOption: number;
  isCorrect: boolean;
  timeSpent: number;
};

export function QuizMode({ mcqs, topic, onComplete }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const currentMcq = mcqs[currentIndex];
  const totalQuestions = mcqs.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = useCallback((optionIndex: number) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
  }, [showResult]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null) return;

    const timeSpent = Date.now() - questionStartTime;
    const correctOptionIndex = currentMcq.options.findIndex(opt => 
      opt === currentMcq.answer || currentMcq.answer.includes(opt)
    );
    const isCorrect = selectedOption === correctOptionIndex;

    const newAnswer: QuizAnswer = {
      questionIndex: currentIndex,
      selectedOption,
      correctOption: correctOptionIndex,
      isCorrect,
      timeSpent,
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowResult(true);
  }, [selectedOption, currentMcq, currentIndex, questionStartTime]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setQuestionStartTime(Date.now());
    } else {
      // Quiz complete
      const correctCount = answers.filter(a => a.isCorrect).length + (showResult && selectedOption !== null ? 
        (mcqs[currentIndex].options.findIndex(opt => opt === mcqs[currentIndex].answer || mcqs[currentIndex].answer.includes(opt)) === selectedOption ? 1 : 0) : 0);
      setFinalScore(correctCount);
      setIsComplete(true);
      onComplete?.(correctCount, totalQuestions, answers);
    }
  }, [currentIndex, totalQuestions, answers, showResult, selectedOption, mcqs, onComplete]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setAnswers([]);
    setQuestionStartTime(Date.now());
    setIsComplete(false);
    setFinalScore(0);
  }, []);

  if (isComplete) {
    const percentage = (finalScore / totalQuestions) * 100;
    const totalTime = Date.now() - startTime;
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);

    return (
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-black text-zinc-900 dark:text-white">
            Quiz Complete!
          </CardTitle>
          <p className="text-zinc-500 dark:text-zinc-400">{topic}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-5xl font-black text-amber-600">
              {finalScore}/{totalQuestions}
            </div>
            <div className="text-lg font-semibold text-zinc-600 dark:text-zinc-300">
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : percentage >= 40 ? "Keep Practicing!" : "Need More Practice"}
            </div>
            <div className="mt-2 flex items-center justify-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {minutes}m {seconds}s
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {Math.round(percentage)}%
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-emerald-100 p-4 text-center dark:bg-emerald-900/30">
              <div className="text-2xl font-black text-emerald-600">
                {answers.filter(a => a.isCorrect).length}
              </div>
              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Correct</div>
            </div>
            <div className="rounded-xl bg-red-100 p-4 text-center dark:bg-red-900/30">
              <div className="text-2xl font-black text-red-600">
                {totalQuestions - finalScore}
              </div>
              <div className="text-xs font-medium text-red-700 dark:text-red-400">Wrong</div>
            </div>
            <div className="rounded-xl bg-blue-100 p-4 text-center dark:bg-blue-900/30">
              <div className="text-2xl font-black text-blue-600">
                {Math.round(answers.reduce((acc, a) => acc + a.timeSpent, 0) / answers.length / 1000)}s
              </div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-400">Avg Time</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900 dark:text-white">Question Review</h3>
            {mcqs.map((mcq, idx) => {
              const answer = answers[idx];
              const userAnswer = answer?.selectedOption;
              const correctIdx = mcq.options.findIndex(opt => 
                opt === mcq.answer || mcq.answer.includes(opt)
              );
              const isCorrect = userAnswer === correctIdx;

              return (
                <div 
                  key={idx} 
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-3",
                    isCorrect ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1">
                      Q{idx + 1}: {mcq.question.substring(0, 60)}...
                    </p>
                    <p className="text-xs text-zinc-500">
                      Your answer: {userAnswer !== null ? String.fromCharCode(65 + userAnswer) : "Skipped"} | 
                      Correct: {String.fromCharCode(65 + correctIdx)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleRestart} className="w-full gap-2" size="lg">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
      <CardHeader className="pb-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-[#0052CC]" />
              <span className="font-semibold text-zinc-900 dark:text-white">Quiz Mode</span>
            </div>
            <span className="text-sm font-medium text-zinc-500">
              {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#0052CC] to-[#1847A4] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-xl bg-[#0052CC]/5 p-4 border border-[#0052CC]/10">
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            <span className="text-[#0052CC]">Q{currentIndex + 1}.</span> {currentMcq.question}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
            <span className={cn(
              "px-2 py-0.5 rounded-full",
              currentMcq.difficulty === "Easy" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              currentMcq.difficulty === "Medium" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              currentMcq.difficulty === "Hard" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            )}>
              {currentMcq.difficulty}
            </span>
            {currentMcq.examTip && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {currentMcq.examTip}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Options */}
        {currentMcq.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = currentMcq.answer.includes(option);
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              disabled={showResult}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left transition-all duration-200",
                "hover:border-[#0052CC] hover:bg-[#0052CC]/5",
                isSelected && !showResult && "border-[#0052CC] bg-[#0052CC]/10",
                showCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
                showWrong && "border-red-500 bg-red-50 dark:bg-red-900/20",
                !isSelected && !showResult && "border-zinc-200 dark:border-zinc-700",
                showResult && "cursor-not-allowed opacity-75"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg font-bold",
                  isSelected && !showResult && "bg-[#0052CC] text-white",
                  showCorrect && "bg-emerald-500 text-white",
                  showWrong && "bg-red-500 text-white",
                  !isSelected && !showResult && "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                )}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 font-medium text-zinc-900 dark:text-white">
                  {option}
                </span>
                {showCorrect && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                {showWrong && <XCircle className="h-5 w-5 text-red-500" />}
              </div>
            </button>
          );
        })}

        {/* Explanation (shown after answering) */}
        {showResult && (
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-900 dark:text-blue-100">Explanation</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">{currentMcq.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {!showResult ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={selectedOption === null}
              className="flex-1 gap-2"
              size="lg"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion} 
              className="flex-1 gap-2"
              size="lg"
            >
              {currentIndex < totalQuestions - 1 ? (
                <>
                  Next Question
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  See Results
                  <Trophy className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
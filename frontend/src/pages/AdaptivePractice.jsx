import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
} from 'lucide-react';

export default function AdaptivePractice() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const conceptParam = searchParams.get('concept') || '';
  const modeParam = searchParams.get('mode') || 'adaptive';

  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [questionCount, setQuestionCount] = useState(4); // Starts at Question 4 of 10 as specified in prompt

  const studentId = user?._id || '6ab0e1e6738c04c7df5f20e4';

  const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedOption('');
    setShowHint(false);

    try {
      const data = await api.getNextQuestion(studentId, conceptParam);
      setQuestionData(data);
    } catch (err) {
      console.error('Failed to load next question:', err);
      setError(err.message || 'No questions currently available');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [conceptParam, studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption || !questionData?.question) return;

    setIsSubmitting(true);
    try {
      const res = await api.answerQuestion(
        questionData.question._id,
        studentId,
        selectedOption
      );
      setResult(res);
    } catch (err) {
      alert('Error submitting answer: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setQuestionCount((prev) => (prev >= 10 ? 1 : prev + 1));
    loadQuestion();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">
          Selecting optimal question via BKT and prerequisite heuristics...
        </span>
      </div>
    );
  }

  if (error || !questionData?.question) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-lg mx-auto space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Question Unavailable</h3>
        <p className="text-xs text-slate-400">{error || 'Please choose another concept or reseed database.'}</p>
        <button
          onClick={loadQuestion}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { question, concept, difficulty, difficultyName, reason } = questionData;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Concept:</span>
            <span className="text-sm font-extrabold text-indigo-400">{concept?.name || 'Mathematics'}</span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1">{reason}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
            Level {difficulty} — {difficultyName || 'Medium'}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs font-bold text-indigo-300">
            Question {questionCount} of 10
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="rounded-3xl bg-slate-900/95 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Question Statement */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Question</span>
            {question.hint && (
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
              </button>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-relaxed">
            {question.question}
          </h2>

          {showHint && question.hint && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
              💡 <strong>Hint:</strong> {question.hint}
            </div>
          )}
        </div>

        {/* Answer Options */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2.5">
            {question.options?.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isSubmitted = Boolean(result);
              const isCorrectOption = isSubmitted && (
                option === result.correctAnswer ||
                option.startsWith(result.correctAnswer)
              );
              const isWrongSelected = isSubmitted && isSelected && !result.correct;

              let optionStyle = 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50 text-slate-200';
              if (isSelected && !isSubmitted) {
                optionStyle = 'bg-indigo-950/50 border-indigo-500 text-white shadow-md shadow-indigo-600/20';
              }
              if (isSubmitted) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                } else if (isWrongSelected) {
                  optionStyle = 'bg-red-950/60 border-red-500 text-red-200 line-through';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <label
                  key={idx}
                  className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${optionStyle}`}
                >
                  <input
                    type="radio"
                    name="quiz-option"
                    disabled={Boolean(result)}
                    checked={isSelected}
                    onChange={() => setSelectedOption(option)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              );
            })}
          </div>

          {/* Submit Button */}
          {!result && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={!selectedOption || isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>{isSubmitting ? 'Evaluating BKT Probability...' : 'Submit Answer'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </form>

        {/* AFTER SUBMISSION DISPLAY */}
        {result && (
          <div className="space-y-6 pt-4 border-t border-slate-800 animate-fadeIn">
            {/* Correct / Incorrect Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                result.correct
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/50 border-red-500/50 text-red-200'
              }`}
            >
              {result.correct ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400 shrink-0" />
              )}
              <div>
                <div className="text-base font-extrabold">
                  {result.correct ? 'Correct ✓' : 'Incorrect'}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {result.explanation}
                </div>
              </div>
            </div>

            {/* LIVE AI COGNITIVE DIAGNOSIS (API KEY POWERED) */}
            {result.aiScoreAnalysis && (
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span>Live AI Cognitive Analysis</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    result.aiScoreAnalysis.aiPowered ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {result.aiScoreAnalysis.source}
                  </span>
                </div>
                <div className="text-xs text-white font-bold">{result.aiScoreAnalysis.summary}</div>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  {result.aiScoreAnalysis.cognitiveDiagnosis}
                </p>
                {result.aiScoreAnalysis.recommendedNextStep && (
                  <div className="text-[11px] text-indigo-300 font-semibold pt-0.5">
                    💡 AI Next Step: {result.aiScoreAnalysis.recommendedNextStep}
                  </div>
                )}
              </div>
            )}

            {/* AI LEARNING UPDATE (Section 9 Requirement) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">BKT Model Update</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  Corbett & Anderson Bayesian Model
                </span>
              </div>

              {/* Mastery Shift */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block">{result.concept?.name} Mastery:</span>
                  <div className="flex items-center gap-2 text-xl font-black text-white">
                    <span>{result.bktUpdate?.percentBefore}%</span>
                    <span className="text-slate-500">→</span>
                    <span className={result.correct ? 'text-emerald-400' : 'text-red-400'}>
                      {result.bktUpdate?.percentAfter}%
                    </span>
                    {result.correct ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1 sm:text-right font-mono text-[11px]">
                  <div>P(Transition): {result.bktUpdate?.parameters?.pTransition}</div>
                  <div>P(Guess): {result.bktUpdate?.parameters?.pGuess} | P(Slip): {result.bktUpdate?.parameters?.pSlip}</div>
                </div>
              </div>

              {/* Difficulty Adaptation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Current Difficulty:</span>
                  <span className="font-bold text-slate-200">
                    Level {result.difficultyUpdate?.currentDifficulty}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Next Recommended Difficulty:</span>
                  <span className="font-bold text-indigo-300">
                    Level {result.difficultyUpdate?.nextDifficulty} ({result.difficultyUpdate?.levelName})
                  </span>
                </div>
              </div>

              {/* Dynamic Reason */}
              <p className="text-xs text-slate-300 italic">
                Reason: "{result.difficultyUpdate?.reason}"
              </p>
            </div>

            {/* Foundational Gap Trigger Alert if Detected */}
            {result.gapDetected && result.gapDetails && (
              <div className="p-4 rounded-2xl bg-red-950/60 border-2 border-red-500 space-y-2 animate-pulse">
                <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span>Foundational Knowledge Gap Triggered</span>
                </div>
                <p className="text-xs text-slate-200">
                  {result.gapDetails.reason}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/learning-path?gap=${result.gapDetails.concept}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-white bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-lg"
                  >
                    <span>Practice Prerequisite Recovery Path</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Next Question Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>Next Question</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

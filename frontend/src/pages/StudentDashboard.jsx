import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Network,
  Sparkles,
  Milestone,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Target,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, aiStatus } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [masteries, setMasteries] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [aiProfileAnalysis, setAiProfileAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [error, setError] = useState(null);

  const studentId = user?._id;

  const fetchData = async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const [sInfo, mList, gList] = await Promise.all([
        api.getStudent(studentId),
        api.getMastery(studentId),
        api.getGaps(studentId),
      ]);

      setStudentData(sInfo);
      setMasteries(mList || []);
      setGaps(gList || []);

      // If user has attempts, run real AI cognitive score analysis
      if (sInfo.totalQuestions > 0) {
        setAnalyzingAi(true);
        api.analyzeProfile(studentId)
          .then(res => setAiProfileAnalysis(res))
          .catch(e => console.warn('AI analysis skipped:', e.message))
          .finally(() => setAnalyzingAi(false));
      }
    } catch (err) {
      console.error('Error loading authentic dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">
          Loading your authentic learning scores from MongoDB...
        </span>
      </div>
    );
  }

  const overallMastery = studentData?.overallMastery ?? 0;
  const totalQuestions = studentData?.totalQuestions ?? 0;
  const accuracy = studentData?.accuracy ?? 0;
  const criticalGap = gaps.length > 0 ? gaps[0] : null;

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome, {user?.name || 'Student'} <span className="inline-block animate-pulse">🎓</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time mastery tracking powered by Bayesian Knowledge Tracing and AI cognitive diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/practice"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <BrainCircuit className="h-4 w-4" />
            <span>Start Practice Session</span>
          </Link>
          <Link
            to="/graph"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Network className="h-4 w-4 text-indigo-400" />
            <span>Knowledge Graph</span>
          </Link>
        </div>
      </div>

      {/* Fresh Student Onboarding Banner if 0 Questions */}
      {totalQuestions === 0 && (
        <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>New Student Profile Initialized</span>
            </div>
            <p className="text-xs text-slate-300">
              Answer your first few questions to establish your genuine concept mastery baseline and allow the AI engine to detect your prerequisite learning gaps.
            </p>
          </div>
          <Link
            to="/practice"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 text-center"
          >
            Take First Diagnostic Quiz
          </Link>
        </div>
      )}

      {/* TOP ROW: Overall Mastery & Knowledge Gap Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Overall Mastery Gauge Card (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Authentic Mastery Score</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              Live BKT
            </span>
          </div>

          {/* Large Circular Gauge */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-slate-800"
                  strokeWidth="9"
                  stroke="currentColor"
                  fill="transparent"
                  r="38"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeWidth="9"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - Math.max(0, overallMastery) / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="38"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white tracking-tight">{overallMastery}%</span>
                <span className="text-[10px] text-slate-400 font-medium">Posterior P(L)</span>
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Accuracy: <strong className="text-white">{accuracy}%</strong> over <strong className="text-white">{totalQuestions}</strong> questions
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-800/80">
            Probability updates continuously as you answer questions.
          </div>
        </div>

        {/* PROMINENT GAP / AI COGNITIVE ANALYSIS CARD (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {criticalGap ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-red-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-red-200 tracking-tight">
                    Foundational Knowledge Gap Detected
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                  Priority Remediation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Prerequisite Root Misconception</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-white">{criticalGap.conceptName}</span>
                    <span className="text-sm font-black text-red-400">{criticalGap.masteryPercent}% Mastery</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${criticalGap.masteryPercent}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Constrained Concept</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-white">{criticalGap.affectedConceptName}</span>
                    <span className="text-sm font-black text-amber-400">{criticalGap.affectedMasteryPercent}% Mastery</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${criticalGap.affectedMasteryPercent}%` }} />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                "{criticalGap.reason}"
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Targeted micro-practice available</span>
                <Link
                  to={`/practice?concept=${criticalGap.conceptId}&mode=gap_recovery`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow"
                >
                  <span>Practice This Gap</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 my-auto">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Cognitive Balance Status</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {totalQuestions > 0
                  ? 'No critical prerequisite bottlenecks currently impeding your progress. The adaptive engine will monitor your upcoming responses.'
                  : 'Complete a practice quiz to let the AI analyze your personal learning strengths and isolate any foundational knowledge gaps.'}
              </p>

              {aiProfileAnalysis && (
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>AI Cognitive Diagnosis ({aiProfileAnalysis.source})</span>
                    </span>
                    {aiProfileAnalysis.aiPowered && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Live LLM
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200">{aiProfileAnalysis.overallAssessment}</p>
                  <div className="text-[11px] text-indigo-300 font-semibold pt-1">
                    Study Recommendation: {aiProfileAnalysis.studyPlan}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONCEPT MASTERY SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Concept Mastery</h2>
            <p className="text-xs text-slate-400">Calculated strictly from your genuine quiz responses</p>
          </div>
          <Link to="/graph" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>Inspect Knowledge Graph</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {masteries.map((c) => {
            const isWeak = c.masteryPercent < 50;
            const isMastered = c.masteryPercent >= 75;

            return (
              <div
                key={c.conceptId || c.slug}
                className={`p-4 rounded-2xl bg-slate-900/80 border transition-all ${
                  isWeak
                    ? 'border-red-500/40 shadow-lg shadow-red-950/20'
                    : isMastered
                    ? 'border-emerald-500/30'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200 truncate">{c.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isMastered
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isWeak
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="text-2xl font-black text-white mb-2">
                  {c.masteryPercent}%
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isMastered ? 'bg-emerald-500' : isWeak ? 'bg-red-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${c.masteryPercent}%` }}
                  />
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Level {c.difficulty || 2}</span>
                  <Link
                    to={`/practice?concept=${c.conceptId}`}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Practice →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

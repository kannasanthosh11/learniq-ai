import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Milestone,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export default function KnowledgeGapsPage() {
  const { user } = useAuth();
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = user?._id || '6ab0e1e6738c04c7df5f20e4';

  const fetchGaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGaps(studentId);
      setGaps(data || []);
    } catch (err) {
      console.error('Error fetching gaps:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">
          Running backward DAG traversal to isolate prerequisite gaps...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans animate-fadeIn">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold mb-2">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Cognitive Bottleneck Isolation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Detected Knowledge Gaps
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Root prerequisite weaknesses currently constraining your performance in advanced topics.
        </p>
      </div>

      {gaps.length > 0 ? (
        <div className="space-y-6">
          {gaps.map((gap, index) => (
            <div
              key={index}
              className="rounded-3xl bg-slate-900/90 border-2 border-red-500/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-red-500/20 text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                      Foundational Root Gap
                    </span>
                    <h2 className="text-xl font-black text-white">{gap.conceptName}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                    Priority: Critical Remediation
                  </span>
                </div>
              </div>

              {/* Comparative Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Root Prerequisite Skill</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-white">{gap.conceptName}</span>
                    <span className="text-base font-black text-red-400">{gap.masteryPercent}% Mastery</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${gap.masteryPercent}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Blocked Advanced Concept</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-white">{gap.affectedConceptName}</span>
                    <span className="text-base font-black text-amber-400">{gap.affectedMasteryPercent}% Mastery</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${gap.affectedMasteryPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-slate-300 space-y-1 mb-6">
                <div className="font-bold text-indigo-300">Pedagogical Analysis:</div>
                <p className="leading-relaxed text-slate-200">
                  {gap.reason}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{gap.recommendedAction}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/learning-path"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
                  >
                    <Milestone className="h-3.5 w-3.5" />
                    <span>View 5-Step Path</span>
                  </Link>

                  <Link
                    to={`/practice?concept=${gap.conceptId}&mode=gap_recovery`}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/40 transition transform hover:-translate-y-0.5"
                  >
                    <span>Practice This Gap</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Critical Bottlenecks Detected</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your foundational prerequisites are currently in harmony with your advanced concepts.
          </p>
          <Link
            to="/practice"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Continue General Practice
          </Link>
        </div>
      )}
    </div>
  );
}

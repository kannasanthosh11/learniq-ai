import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  BookOpen,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function TeacherConceptsPage() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConcepts = async () => {
      setLoading(true);
      try {
        const data = await api.getConceptAnalytics();
        setConcepts(data);
      } catch (err) {
        console.error('Error fetching concept analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConcepts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Analyzing curriculum concept difficulty ratings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans animate-fadeIn max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Concept Analytics & Cohort Difficulty
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Surveillance of curriculum topics with highest misconception rates across all enrolled students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((c) => {
          const isHighDiff = c.avgMastery < 50;
          const isModerate = c.avgMastery >= 50 && c.avgMastery < 75;

          return (
            <div
              key={c.conceptId}
              className={`p-6 rounded-3xl bg-slate-900/90 border transition shadow-xl space-y-4 ${
                isHighDiff
                  ? 'border-red-500/50 shadow-red-950/20'
                  : isModerate
                  ? 'border-amber-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Curriculum Topic
                  </span>
                  <h3 className="text-base font-black text-white">{c.name}</h3>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    isHighDiff
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : isModerate
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {c.difficultyRating}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">Cohort Average Mastery</span>
                  <span className="text-lg font-black text-white">{c.avgMastery}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isHighDiff ? 'bg-red-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${c.avgMastery}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Accuracy</span>
                  <span className="font-bold text-slate-200">{c.accuracy}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Attempts</span>
                  <span className="font-bold text-slate-200">{c.totalAttempts}</span>
                </div>
              </div>

              {isHighDiff && (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-[11px] text-red-300 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>High bottleneck potential. Recommend class review.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

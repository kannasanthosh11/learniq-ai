import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  TrendingUp,
  BrainCircuit,
  Network,
} from 'lucide-react';

export default function TeacherStudentDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await api.getTeacherStudent(id);
        setDetails(data);
      } catch (err) {
        console.error('Error fetching student details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Retrieving student cognitive record...</span>
      </div>
    );
  }

  const { student, masteries, gaps, recentResponses, totalResponses, accuracy } = details || {};

  return (
    <div className="space-y-8 font-sans animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <Link
        to="/teacher"
        className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Student Roster</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-black text-white">
            {student?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{student?.name}</h1>
            <div className="text-xs text-purple-400 font-semibold">{student?.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Total Questions</span>
            <span className="text-lg font-black text-white">{totalResponses ?? 0}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Accuracy</span>
            <span className="text-lg font-black text-purple-400">{accuracy ?? 0}%</span>
          </div>
        </div>
      </div>

      {/* Active Knowledge Gaps */}
      {gaps && gaps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span>Foundational Gaps Identified for {student?.name}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {gaps.map((g, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-red-950/40 border border-red-500/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-red-200">
                    {g.conceptName} ({g.masteryPercent}%) → Blocks {g.affectedConceptName} ({g.affectedMasteryPercent}%)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                    Prerequisite Bottleneck
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{g.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concept Mastery Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white">Concept Masteries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {masteries?.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{m.concept}</span>
                <span className="text-xs font-black text-indigo-400">{m.mastery}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    m.mastery < 50 ? 'bg-red-500' : m.mastery >= 75 ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${m.mastery}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>Adaptive Level: {m.difficulty}</span>
                <span>Consecutive: {m.consecutiveCorrect} correct</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Recent Question Attempt Audit Log</h3>
        <div className="space-y-2">
          {recentResponses?.slice(0, 8).map((r, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                {r.correct ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <div>
                  <span className="font-bold text-slate-200">{r.conceptId?.name || 'Concept'}</span>
                  <span className="text-slate-500 ml-2">Selected: "{r.selectedAnswer}"</span>
                </div>
              </div>
              <div className="text-slate-400 text-[11px] font-mono">
                Level {r.difficulty} • Mastery: {Math.round((r.updatedMastery || 0.5) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

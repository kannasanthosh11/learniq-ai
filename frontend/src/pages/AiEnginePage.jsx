import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Network,
  AlertTriangle,
  Sliders,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Activity,
} from 'lucide-react';

export default function AiEnginePage() {
  const [activeStage, setActiveStage] = useState(0);

  const pipelineStages = [
    {
      title: 'Student Response',
      subtitle: 'Observation Event',
      desc: 'Student submits an answer to an algebraic equation (e.g. 2x + 6 = 14) along with response time and metadata.',
      state: 'Raw Observation (correct = false)',
      color: 'border-slate-700 bg-slate-900',
    },
    {
      title: 'BKT Update',
      subtitle: 'Corbett & Anderson (1995)',
      desc: 'Computes P(incorrect) = P(L)*S + (1-P(L))*(1-G), then posterior P(L|incorrect) = [P(L)*S] / P(incorrect). Updates transition step P(L_next).',
      state: 'Posterior Update: 0.42 → 0.38',
      color: 'border-indigo-500/50 bg-indigo-950/40',
    },
    {
      title: 'Mastery State',
      subtitle: 'Persistent MongoDB Record',
      desc: 'Saves updated probability and streak counts to the student Mastery collection for the target concept.',
      state: 'Stored: Linear Equations = 0.38 (Weak)',
      color: 'border-purple-500/50 bg-purple-950/40',
    },
    {
      title: 'Knowledge Graph Analysis',
      subtitle: 'DAG Dependency Traversal',
      desc: 'Traverses upstream edges in the Directed Acyclic Graph to retrieve prerequisites: Fractions and Algebraic Expressions.',
      state: 'Prerequisites Checked: Fractions (0.39), Algebra (0.81)',
      color: 'border-blue-500/50 bg-blue-950/40',
    },
    {
      title: 'Root Gap Detection',
      subtitle: 'Prerequisite Misconception Isolation',
      desc: 'Detects that Fractions mastery (39%) is below the prerequisite threshold (55%), diagnosing it as the root cause of Linear Equation errors.',
      state: 'Gap Flagged: Fractions (Critical Bottleneck)',
      color: 'border-red-500/60 bg-red-950/40',
    },
    {
      title: 'Difficulty Selection',
      subtitle: 'Dynamic Difficulty Engine',
      desc: 'Consecutive incorrect responses triggers down-scaling. Prerequisite bottleneck imposes a Level 2 safety cap to protect learner confidence.',
      state: 'Calibrated: Level 2 (Easy)',
      color: 'border-amber-500/50 bg-amber-950/40',
    },
    {
      title: 'Question Recommendation',
      subtitle: 'Explainable AI Recommendation',
      desc: 'Intervention activates: presents a Level 2 Fraction question with pedagogical justification explaining why fractions will unlock linear equations.',
      state: 'Delivered: "What is 3/5 - 1/4?"',
      color: 'border-emerald-500/50 bg-emerald-950/40',
    },
  ];

  return (
    <div className="space-y-10 font-sans max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
          <Cpu className="h-3.5 w-3.5" />
          <span>Cognitive Machine Learning Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Learning Intelligence Core
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Four synchronized AI engines communicating in real time to diagnose misconceptions, adapt difficulty, and synthesize prerequisite micro-recovery paths.
        </p>
      </div>

      {/* FOUR ACTIVE ENGINE CARDS (Section 25 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: BKT */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Bayesian Knowledge Tracing</h3>
            <p className="text-xs text-slate-400 mt-1">Mastery estimation</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            P(L_next) = P(L|obs) + (1-P(L|obs))*P(T)
          </div>
        </div>

        {/* Card 2: Knowledge Graph */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Network className="h-6 w-6" />
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Knowledge Graph</h3>
            <p className="text-xs text-slate-400 mt-1">Prerequisite reasoning</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            DAG Multi-Hop Topological Traversal
          </div>
        </div>

        {/* Card 3: Root Gap Detector */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-red-500/40 transition">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Root Gap Detector</h3>
            <p className="text-xs text-slate-400 mt-1">Foundational misconception detection</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Upstream Dependency Bottleneck Isolation
          </div>
        </div>

        {/* Card 4: Adaptive Difficulty */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Sliders className="h-6 w-6" />
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Adaptive Difficulty</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time question adjustment</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            5-Tier Calibration (Streak & Bounds)
          </div>
        </div>
      </div>

      {/* LIVE INTERACTIVE PIPELINE (Section 25 Requirement) */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              <span>Live Cognitive Execution Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400">
              Trace how a student response flows through the backend AI services into personalized action.
            </p>
          </div>

          <Link
            to="/practice"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition"
          >
            <span>Trigger Pipeline Live</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Pipeline Sequence */}
        <div className="space-y-4">
          {pipelineStages.map((stage, idx) => {
            const isSelected = activeStage === idx;
            const isLast = idx === pipelineStages.length - 1;

            return (
              <div key={idx} className="space-y-3">
                <div
                  onClick={() => setActiveStage(idx)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${stage.color} ${
                    isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-xl bg-slate-950/80 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-white">{stage.title}</h3>
                        <span className="text-[11px] text-slate-400">{stage.subtitle}</span>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-indigo-300">
                      {stage.state}
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                {!isLast && (
                  <div className="flex justify-center text-slate-600">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

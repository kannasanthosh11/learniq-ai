import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  BrainCircuit,
  Network,
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Compass,
  Zap,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navbar />

      <main className="pt-32 pb-24 px-6 lg:px-12 max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <span>Pedagogical & Algorithmic Foundation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            How LearnIQ Works
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            A deep dive into Corbett & Anderson’s Bayesian Knowledge Tracing, multi-hop Directed Acyclic Graphs (DAG), and Explainable AI gap detection.
          </p>
        </div>

        {/* Section 1: The Problem of Uniform Pacing */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-black">1</span>
            The Challenge of Uniform Pacing
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            In standard classrooms and traditional LMS platforms, every learner moves at an identical pace. If a student repeatedly fails Linear Equations questions, standard systems assume they need more Linear Equations questions. However, cognitive research shows that over 70% of algebraic errors stem from misunderstandings in foundational prerequisites like <strong>Fractions</strong> and <strong>Arithmetic Properties</strong>.
          </p>
        </div>

        {/* Section 2: Corbett & Anderson BKT Mathematics */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-black">2</span>
            Bayesian Knowledge Tracing (BKT)
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            LearnIQ uses standard Corbett & Anderson (1995) Bayesian Knowledge Tracing. For each concept, the system models four fundamental latent parameters:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="font-mono text-indigo-400 font-bold block text-sm">P(L) = 0.30</span>
              <span className="font-semibold text-white">Prior Mastery</span>
              <p className="text-slate-400 text-[11px]">Probability skill is currently mastered.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="font-mono text-purple-400 font-bold block text-sm">P(T) = 0.15</span>
              <span className="font-semibold text-white">Transition</span>
              <p className="text-slate-400 text-[11px]">Probability of learning during an opportunity.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="font-mono text-emerald-400 font-bold block text-sm">P(G) = 0.20</span>
              <span className="font-semibold text-white">Guess Rate</span>
              <p className="text-slate-400 text-[11px]">Probability of guessing right without knowing.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="font-mono text-amber-400 font-bold block text-sm">P(S) = 0.10</span>
              <span className="font-semibold text-white">Slip Rate</span>
              <p className="text-slate-400 text-[11px]">Probability of a careless error when knowing.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#090d16] border border-slate-800 text-xs font-mono space-y-3">
            <div className="text-slate-400 font-sans font-bold uppercase text-[11px] tracking-wider">Exact Mathematical Execution:</div>
            <div className="text-slate-200">
              1. P(correct) = P(L) * (1 - P(S)) + (1 - P(L)) * P(G)
            </div>
            <div className="text-slate-200">
              2. If Correct: P(L | correct) = [P(L) * (1 - P(S))] / P(correct)
            </div>
            <div className="text-slate-200">
              3. If Incorrect: P(L | incorrect) = [P(L) * P(S)] / P(incorrect)
            </div>
            <div className="text-emerald-400 font-semibold">
              4. Posterior Transition: P(L_next) = P(L | obs) + (1 - P(L | obs)) * P(T)
            </div>
          </div>
        </div>

        {/* Section 3: The Prerequisite DAG & Gap Detection */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-black">3</span>
            Prerequisite DAG & Root Gap Detection
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every concept belongs to a Directed Acyclic Graph (DAG) stored in MongoDB. When a student struggles in a higher-order concept (such as Linear Equations with 42% mastery), the <strong>GapDetector</strong> service runs reverse graph traversal to evaluate the mastery of each prerequisite. If a foundational skill (such as Fractions with 39% mastery) is below the threshold, the system flags a <strong>Foundational Knowledge Gap</strong>.
          </p>
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            <strong>Key Benefit:</strong> Instead of trapping learners in endless repetitive failure, LearnIQ automatically synthesizes a targeted 5-step micro-recovery path to bridge the foundational gap before resuming advanced topics.
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition"
          >
            <span>Launch Live Demo Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

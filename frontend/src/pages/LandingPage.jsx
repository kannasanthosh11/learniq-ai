import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  BrainCircuit,
  Network,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  GitFork,
  Sliders,
  Compass,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>TENSORA 2026 — Track EDU-01 Winner</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Learn at your pace.{' '}
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Master the concepts behind your mistakes.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              An AI-powered adaptive learning platform that discovers hidden prerequisite knowledge gaps, adapts question difficulty in real time, and synthesizes personalized recovery micro-practice.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>Start Learning</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 transition"
              >
                Explore How It Works
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-black text-white">Corbett & Anderson</div>
                <div className="text-xs text-slate-400 font-medium">Bayesian Knowledge Tracing</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-400">Prerequisite DAG</div>
                <div className="text-xs text-slate-400 font-medium">Multi-Hop Gap Traversal</div>
              </div>
              <div>
                <div className="text-2xl font-black text-purple-400">5-Tier Dynamic</div>
                <div className="text-xs text-slate-400 font-medium">Difficulty Calibration</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Animated Graph & Knowledge Gap Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl shadow-indigo-950/50 backdrop-blur">
              {/* Top Banner */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-400">Concept Prerequisite Network</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                  BKT Real-Time DAG
                </span>
              </div>

              {/* Visual Graph Hierarchy */}
              <div className="space-y-4 py-2">
                {/* Node: Functions & Quadratics */}
                <div className="flex justify-center gap-4">
                  <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-center font-semibold text-slate-300">
                    Functions <span className="text-[10px] text-indigo-400 block font-normal">67% Mastery</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-center font-semibold text-slate-300">
                    Quadratic Equations <span className="text-[10px] text-slate-400 block font-normal">25% Mastery</span>
                  </div>
                </div>

                <div className="flex justify-center text-slate-600 text-xs font-mono">↑ prerequisite dependency</div>

                {/* Node: Linear Equations */}
                <div className="flex justify-center">
                  <div className="px-4 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-center font-bold text-amber-200 shadow-md">
                    Linear Equations
                    <span className="text-[10px] text-amber-300/80 block font-normal">42% Mastery • Bottlenecked</span>
                  </div>
                </div>

                <div className="flex justify-around text-slate-600 text-xs font-mono px-8">
                  <span>↗</span>
                  <span>↖</span>
                </div>

                {/* Prerequisites: Algebra & Fractions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="px-3.5 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-center font-semibold text-emerald-200">
                    Algebraic Expressions
                    <span className="text-[10px] text-emerald-400 block font-normal">81% Mastered ✓</span>
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl bg-red-950/60 border-2 border-red-500 text-xs text-center font-bold text-red-200 shadow-lg shadow-red-950/50 animate-pulse">
                    Fractions
                    <span className="text-[10px] text-red-400 block font-extrabold">39% Root Gap ⚠</span>
                  </div>
                </div>
              </div>

              {/* Alert Callout */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-red-950/50 via-slate-900 to-slate-900 border border-red-500/40">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-red-300">Foundational Knowledge Gap Detected</div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Weakness in <strong>Fractions (39%)</strong> is causing repeated mistakes in <strong>Linear Equations</strong> when clearing denominators.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/learning-path"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300"
                      >
                        <span>Recommended: Fraction Recovery Path</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 lg:px-12 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">The Problem</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Every learner is different. Uniform pacing fails them.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Traditional education gives the same questions and pace to every student. When a student fails Linear Equations, standard homework repeats more Linear Equations questions. But the real culprit is often an unaddressed gap in Fractions from two grades prior.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-bold text-white">The Hidden Root Flaw</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Struggling with \(2x/3 + 4 = 10\) is rarely an algebra misconception. Students fail because they cannot manipulate fractional coefficients.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-bold text-white">Cognitive Frustration</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Repeatedly drilling questions beyond a student’s prerequisite mastery creates discouragement and high dropout rates.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">3</div>
              <h3 className="text-lg font-bold text-white">Teacher Blindspot</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instructors grading 40 assignments cannot manually reconstruct the individual DAG prerequisite state of every child.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 lg:px-12 border-t border-slate-800/80 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Continuous Multi-Layer Cognitive Diagnosis
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              LearnIQ combines formal probabilistic knowledge tracing with graph theory to diagnose why mistakes happen and prescribe exact micro-interventions.
            </p>
          </div>

          {/* Interactive Pipeline visualization */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-center space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">Step 1</span>
                <span className="font-bold text-white text-sm">Response</span>
                <p className="text-[11px] text-slate-400">Student answers question</p>
              </div>

              <div className="hidden md:flex justify-center text-indigo-400 font-bold text-xl">→</div>

              <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center space-y-1">
                <span className="text-xs text-indigo-400 font-semibold block">Step 2</span>
                <span className="font-bold text-indigo-200 text-sm">BKT Analysis</span>
                <p className="text-[11px] text-indigo-300">Bayes posterior updated</p>
              </div>

              <div className="hidden md:flex justify-center text-indigo-400 font-bold text-xl">→</div>

              <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 text-center space-y-1">
                <span className="text-xs text-purple-400 font-semibold block">Step 3</span>
                <span className="font-bold text-purple-200 text-sm">Gap Detection</span>
                <p className="text-[11px] text-purple-300">DAG backward traversal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Dynamic Difficulty Selection</h4>
                  <p className="text-xs text-slate-400 mt-1">Calibrates level 1 to 5 dynamically without frustrating or boring the learner.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Micro-Practice Paths</h4>
                  <p className="text-xs text-slate-400 mt-1">Automatically generates targeted recovery sequences for identified bottlenecks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Explainable AI</h4>
                  <p className="text-xs text-slate-400 mt-1">Transparent rationale explains why each specific practice problem is recommended.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 px-6 lg:px-12 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Engineered for Real Cognitive Mastery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Adaptive Learning Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Continually computes the likelihood that a student understands a skill based on their sequence of attempts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
                <Network className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Prerequisite Knowledge Graph</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Directed acyclic graph maps how fundamental mathematical building blocks connect to advanced topics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 w-fit">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Root Gap Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pinpoints upstream gaps causing downstream failure, preventing hours of unproductive drill-and-kill.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Dynamic Difficulty</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adapts difficulty across 5 discrete levels using consecutive streaks and prerequisite thresholds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Personalized Micro-Practice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Synthesizes targeted 5-step recovery pathways designed to remediate foundational misconceptions quickly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Explainable AI (XAI)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every practice recommendation provides clear pedagogical justification so learners know why each step matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-6 lg:px-12 border-t border-slate-800 relative text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Stop guessing what you don't know.
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Experience real Bayesian Knowledge Tracing with Alex Kumar’s pre-configured benchmark learning profile.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              Start Your Learning Journey
            </Link>
            <Link
              to="/ai-engine"
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition"
            >
              Inspect Live AI Engine Pipeline
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-12 border-t border-slate-900 text-center text-xs text-slate-500">
        LearnIQ • TENSORA 2026 Hackathon • Problem EDU-01: Uniform Pacing and Unidentified Knowledge Gaps
      </footer>
    </div>
  );
}

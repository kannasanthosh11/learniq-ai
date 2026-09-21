import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Milestone,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function LearningPathPage() {
  const { user } = useAuth();
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = user?._id || '6ab0e1e6738c04c7df5f20e4';

  useEffect(() => {
    const fetchPath = async () => {
      setLoading(true);
      try {
        const data = await api.getRecommendations(studentId);
        setPathData(data.microPractice);
      } catch (err) {
        console.error('Error fetching learning path:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPath();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">
          Synthesizing personalized prerequisite remediation sequence...
        </span>
      </div>
    );
  }

  const steps = pathData?.steps || [
    {
      stepNumber: 1,
      concept: 'Fraction Fundamentals',
      conceptSlug: 'fractions',
      difficultyLabel: 'Beginner (Level 1)',
      masteryPercent: 39,
      status: 'recommended',
      reason: 'Solidify basic numerator and denominator relationships before solving multi-step equations.',
    },
    {
      stepNumber: 2,
      concept: 'Equivalent Fractions & Common Denominators',
      conceptSlug: 'fractions',
      difficultyLabel: 'Easy (Level 2)',
      masteryPercent: 39,
      status: 'upcoming',
      reason: 'Critical for finding common denominators when combining fractional terms.',
    },
    {
      stepNumber: 3,
      concept: 'Fraction Operations (+, -, ×, ÷)',
      conceptSlug: 'fractions',
      difficultyLabel: 'Medium (Level 3)',
      masteryPercent: 39,
      status: 'upcoming',
      reason: 'Multiplying by reciprocal is required to isolate variable coefficients.',
    },
    {
      stepNumber: 4,
      concept: 'Algebraic Expressions with Fractions',
      conceptSlug: 'algebraic_expressions',
      difficultyLabel: 'Medium (Level 3)',
      masteryPercent: 81,
      status: 'upcoming',
      reason: 'Bridge foundational fraction arithmetic into algebraic term manipulation.',
    },
    {
      stepNumber: 5,
      concept: 'Retry Linear Equations',
      conceptSlug: 'linear_equations',
      difficultyLabel: 'Adaptive Level 3',
      masteryPercent: 42,
      status: 'upcoming',
      reason: 'Re-test equation solving with refreshed prerequisite confidence.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans animate-fadeIn pb-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Dynamic Micro-Curriculum</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Your Personalized Recovery Path
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {pathData?.explanation ||
            'Your Linear Equations performance is 42%. Fractions is a critical prerequisite for this concept and your current Fractions mastery is 39%. Strengthening Fractions will resolve systematic errors when isolating variables.'}
        </p>
      </div>

      {/* Sequenced Pathway Steps */}
      <div className="space-y-4 relative">
        {steps.map((step, idx) => {
          const isRecommended = step.status === 'recommended';
          const isLast = idx === steps.length - 1;

          return (
            <div key={idx} className="space-y-3">
              <div
                className={`p-6 rounded-3xl border transition-all ${
                  isRecommended
                    ? 'bg-slate-900/95 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl shadow-indigo-950/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isRecommended
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {step.stepNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white tracking-tight">{step.concept}</h3>
                        {isRecommended && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold border border-indigo-500/30">
                            ✓ Recommended
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Difficulty: <strong className="text-slate-200">{step.difficultyLabel}</strong></span>
                        <span>•</span>
                        <span>Current Mastery: <strong className="text-indigo-400">{step.masteryPercent}%</strong></span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/practice?concept=${step.conceptSlug}`}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow ${
                      isRecommended
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isRecommended ? 'Start Practice' : 'Preview'}</span>
                  </Link>
                </div>

                <p className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
                  Rationale: "{step.reason}"
                </p>
              </div>

              {!isLast && (
                <div className="flex justify-center text-slate-600 py-1">
                  <ArrowDown className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

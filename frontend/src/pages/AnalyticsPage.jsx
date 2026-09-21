import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Target,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = user?._id || '6ab0e1e6738c04c7df5f20e4';

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.getProgress(studentId);
        setData(res);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Aggregating longitudinal BKT analytics...</span>
      </div>
    );
  }

  const history = data?.history || [];
  const conceptBreakdown = data?.conceptBreakdown || [];
  const totalQuestions = data?.totalQuestions ?? 12;
  const correctCount = data?.correctCount ?? 8;
  const incorrectCount = totalQuestions - correctCount;
  const accuracy = data?.accuracy ?? 67;
  const streak = data?.streak ?? 4;

  const pieData = [
    { name: 'Correct', value: correctCount, color: '#10b981' },
    { name: 'Incorrect', value: incorrectCount, color: '#ef4444' },
  ];

  // Timeline for mastery and difficulty progression
  const timelineData = history.length > 0 ? history : [
    { index: 'Q1', masteryAfter: 35, difficulty: 2 },
    { index: 'Q2', masteryAfter: 42, difficulty: 2 },
    { index: 'Q3', masteryAfter: 39, difficulty: 3 },
    { index: 'Q4', masteryAfter: 48, difficulty: 3 },
    { index: 'Q5', masteryAfter: 55, difficulty: 3 },
    { index: 'Q6', masteryAfter: 68, difficulty: 4 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Learning Analytics & Cognitive Growth
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Longitudinal Bayesian mastery progression and session performance metrics.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Questions Answered</span>
          <div className="text-3xl font-black text-white mt-1">{totalQuestions}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Logged to MongoDB</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Overall Accuracy</span>
          <div className="text-3xl font-black text-indigo-400 mt-1">{accuracy}%</div>
          <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="h-3 w-3" />
            <span>Above baseline</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Correct vs Incorrect</span>
          <div className="text-3xl font-black text-white mt-1">
            <span className="text-emerald-400">{correctCount}</span>
            <span className="text-slate-600 text-xl font-normal"> / </span>
            <span className="text-red-400">{incorrectCount}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Attempt distribution</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Learning Streak</span>
          <div className="text-3xl font-black text-amber-400 mt-1 flex items-center gap-2">
            <span>{streak} Days</span>
            <Flame className="h-6 w-6 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Consistent practice</span>
        </div>
      </div>

      {/* Chart 1: Mastery Over Time */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Mastery Progression Over Time</h3>
            <p className="text-xs text-slate-400">Bayesian Knowledge Tracing updates after each question</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
            P(L_next)
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="index" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="masteryAfter"
                name="Mastery Probability"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Concept Breakdown Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Concept Breakdown Bar Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Mastery vs Mastery Threshold (75%)</h3>
          <p className="text-xs text-slate-400">Concept-level breakdown across the curriculum</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conceptBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="mastery" name="Current Mastery %" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="threshold" name="Target Threshold %" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Correct vs Incorrect (4 cols) */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Accuracy Split</h3>
            <p className="text-xs text-slate-400">Success distribution across attempts</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around text-xs pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span>Correct ({correctCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span>Incorrect ({incorrectCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

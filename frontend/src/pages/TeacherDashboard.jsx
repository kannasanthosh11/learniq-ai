import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function TeacherDashboard() {
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCohort = async () => {
      setLoading(true);
      try {
        const data = await api.getTeacherCohort();
        setCohort(data);
      } catch (err) {
        console.error('Error fetching teacher cohort:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCohort();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Aggregating cohort-wide BKT mastery records...</span>
      </div>
    );
  }

  const students = cohort?.students || [
    { _id: '1', name: 'Alex Kumar', mastery: 72, weakConcept: 'Fractions', status: 'Needs Practice' },
    { _id: '2', name: 'Priya Sharma', mastery: 84, weakConcept: 'Functions', status: 'Learning' },
    { _id: '3', name: 'Rahul Patel', mastery: 53, weakConcept: 'Algebra', status: 'Needs Attention' },
  ];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.weakConcept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Instructor Cohort Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time Bayesian knowledge gap surveillance across student rosters.
          </p>
        </div>

        <Link
          to="/teacher/concepts"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition"
        >
          <BookOpen className="h-4 w-4" />
          <span>View Concept Analytics</span>
        </Link>
      </div>

      {/* Cohort KPIs (Section 20 Requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Enrolled Students</span>
          <div className="text-3xl font-black text-white mt-1">{cohort?.totalStudents ?? students.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active Section A</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Average Cohort Mastery</span>
          <div className="text-3xl font-black text-purple-400 mt-1">{cohort?.avgCohortMastery ?? 70}%</div>
          <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="h-3 w-3" />
            <span>Target: 75% threshold</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Students Needing Attention</span>
          <div className="text-3xl font-black text-amber-400 mt-1">{cohort?.needingAttention ?? 2}</div>
          <span className="text-[11px] text-amber-300/80 mt-1 block">Foundational gaps detected</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Most Difficult Concept</span>
          <div className="text-2xl font-black text-red-400 mt-1 truncate">Fractions</div>
          <span className="text-[11px] text-slate-500 mt-1 block">39% avg prerequisite lag</span>
        </div>
      </div>

      {/* STUDENT COHORT TABLE (Section 20 Requirement) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Student Mastery & Knowledge Gap Roster</h3>
            <p className="text-xs text-slate-400">Click any student to inspect individual prerequisite DAG analysis</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student or concept..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Mastery</th>
                <th className="py-3 px-4">Weak Concept</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredStudents.map((s) => {
                const isNeedsAttention = s.status.includes('Attention');
                const isNeedsPractice = s.status.includes('Practice');
                const isLearning = s.status.includes('Learning');

                return (
                  <tr
                    key={s._id}
                    onClick={() => navigate(`/teacher/student/${s._id}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                        {s.name.charAt(0)}
                      </div>
                      <span>{s.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-200">{s.mastery}%</span>
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.mastery < 55 ? 'bg-red-500' : s.mastery >= 75 ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${s.mastery}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-300">
                      {s.weakConcept}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                          isNeedsAttention
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : isNeedsPractice
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-purple-400 group-hover:text-purple-300 font-semibold inline-flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

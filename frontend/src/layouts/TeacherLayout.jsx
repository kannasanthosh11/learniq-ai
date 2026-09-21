import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Users,
  BookOpen,
  ArrowLeft,
  BrainCircuit,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

export default function TeacherLayout() {
  const { user, logout, switchDemoAccount } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToStudent = async () => {
    await switchDemoAccount('student');
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] border-r border-slate-800 p-4 justify-between">
        <div>
          <div className="flex items-center gap-3 px-3 py-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                LearnIQ
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-purple-400 font-semibold">
                Educator Portal
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <NavLink
              to="/teacher"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Users className="h-4 w-4" />
              <span>Student Cohort</span>
            </NavLink>

            <NavLink
              to="/teacher/concepts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <BookOpen className="h-4 w-4" />
              <span>Concept Analytics</span>
            </NavLink>
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleSwitchToStudent}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Student Demo</span>
          </button>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300">
                SJ
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Dr. Sarah Jenkins</div>
                <div className="text-[10px] text-slate-400">Teacher Account</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-[#0f172a]/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-200">Instructor Cohort Overview</h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Live BKT Diagnostics
            </span>
          </div>
          <button
            onClick={handleSwitchToStudent}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Student View (Alex)</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

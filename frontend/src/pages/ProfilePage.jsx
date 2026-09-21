import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Shield,
  Calendar,
  RotateCcw,
  CheckCircle2,
  BrainCircuit,
  Award,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleResetDemo = async () => {
    if (confirm('Reset entire MongoDB benchmark data to starting state?')) {
      setResetting(true);
      setMsg('');
      try {
        const res = await api.reseedDemo();
        setMsg('Successfully reset to benchmark initial states!');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Student Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review your account details and adaptive engine calibration.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-500/20">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{user?.name || 'Alex Kumar'}</h2>
            <div className="text-xs text-indigo-400 font-semibold">{user?.email || 'alex@learniq.edu'}</div>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider font-bold">
              {user?.role || 'student'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              <span>Email Address</span>
            </span>
            <div className="text-sm font-bold text-slate-200">{user?.email || 'alex@learniq.edu'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-slate-500" />
              <span>Authentication</span>
            </span>
            <div className="text-sm font-bold text-slate-200">JWT Bearer Token Protected</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5 text-slate-500" />
              <span>Adaptive Tracing Engine</span>
            </span>
            <div className="text-sm font-bold text-emerald-400">Corbett & Anderson (1995) BKT</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>Hackathon Track</span>
            </span>
            <div className="text-sm font-bold text-slate-200">TENSORA 2026 — EDU-01</div>
          </div>
        </div>

        {msg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            {msg}
          </div>
        )}

        {/* Demo reset card */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-300">Reset Demo Benchmark Data</div>
            <p className="text-[11px] text-slate-400">
              Restore Fractions: 39%, Linear Equations: 42%, Algebraic Expressions: 81%.
            </p>
          </div>
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-700/50 text-xs font-bold transition shadow"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset Benchmark'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

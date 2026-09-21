import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, switchDemoAccount } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async () => {
    await switchDemoAccount('student');
    navigate('/dashboard');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0b0f19]/85 backdrop-blur-md border-b border-slate-800/80 z-50 px-6 lg:px-12 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <BrainCircuit className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-white">
            Learn<span className="text-indigo-400">IQ</span>
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            TENSORA 2026
          </span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link to="/" className="hover:text-indigo-400 transition">Overview</Link>
        <Link to="/about" className="hover:text-indigo-400 transition">How It Works</Link>
        <Link to="/ai-engine" className="hover:text-indigo-400 transition">AI Engine Pipeline</Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <span>My Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

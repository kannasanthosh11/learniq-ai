import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BrainCircuit,
  Network,
  AlertTriangle,
  Milestone,
  LineChart,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Key,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { api } from '../services/api';

export default function StudentLayout() {
  const { user, logout, aiStatus, refreshAiStatus } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [keySaving, setKeySaving] = useState(false);
  const [keySuccess, setKeySuccess] = useState('');

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/practice', label: 'Adaptive Practice', icon: BrainCircuit },
    { to: '/graph', label: 'Knowledge Graph', icon: Network },
    { to: '/gaps', label: 'Knowledge Gaps', icon: AlertTriangle },
    { to: '/learning-path', label: 'My Learning Path', icon: Milestone },
    { to: '/analytics', label: 'Analytics', icon: LineChart },
    { to: '/ai-engine', label: 'AI Engine Intelligence', icon: Sparkles, highlight: true },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setKeySaving(true);
    setKeySuccess('');
    try {
      await api.setApiKey(apiKeyInput.trim(), provider);
      await refreshAiStatus();
      setKeySuccess(`AI API Key configured successfully for ${provider}!`);
      setTimeout(() => {
        setShowKeyModal(false);
        setKeySuccess('');
        setApiKeyInput('');
      }, 1200);
    } catch (err) {
      alert('Error setting API key: ' + err.message);
    } finally {
      setKeySaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a]/95 border-r border-slate-800/80 p-4 justify-between z-20">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                LearnIQ
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
                Adaptive AI Core
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : item.highlight
                        ? 'text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* AI Key & Real User Account Section */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          {/* AI Key Status Card */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                <span>AI Score Engine</span>
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  aiStatus?.active
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {aiStatus?.active ? 'Live AI Key' : 'BKT Standard'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {aiStatus?.active
                ? `Analyzing scores using ${aiStatus.provider}`
                : 'Corbett & Anderson BKT mathematics active.'}
            </p>

            <button
              onClick={() => setShowKeyModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition"
            >
              <Key className="h-3.5 w-3.5" />
              <span>{aiStatus?.active ? 'Change AI API Key' : 'Connect AI API Key'}</span>
            </button>
          </div>

          {/* Real User badge */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-200 truncate">{user?.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#0f172a]/80 backdrop-blur border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Live Cognitive Diagnosis</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-indigo-400 font-semibold">Real Score Tracking</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Status pill */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium border transition ${
                aiStatus?.active
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-indigo-500'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  aiStatus?.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span>{aiStatus?.active ? `${aiStatus.provider} Live` : 'Add AI Key'}</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-[#0f172a] z-50 p-4 overflow-y-auto border-t border-slate-800">
            <nav className="space-y-2 mb-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-3 bg-slate-900 rounded-xl space-y-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setShowKeyModal(true);
                }}
                className="w-full py-2 bg-indigo-600 rounded-lg text-xs font-semibold text-white"
              >
                Configure AI API Key
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full py-2 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI API Key Configuration</h3>
                  <span className="text-[11px] text-slate-400">Real-time LLM score & gap diagnosis</span>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {keySuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{keySuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">AI Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider('gemini')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      provider === 'gemini'
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Google Gemini
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('openai')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      provider === 'openai'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    OpenAI GPT
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter {provider === 'gemini' ? 'Gemini API Key (AI Studio)' : 'OpenAI API Key'}
                </label>
                <input
                  type="password"
                  required
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  The key is applied instantly to evaluate your answers and misconception root causes.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={keySaving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
                >
                  {keySaving ? 'Saving...' : 'Activate AI Diagnosis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

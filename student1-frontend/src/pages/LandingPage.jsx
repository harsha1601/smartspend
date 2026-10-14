import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async () => {
    try {
      await login('demo@smartspend.com', 'password123');
      navigate('/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30">
            S
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">SmartSpend</span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block -mt-1">Suite 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/30"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors hidden sm:inline-block"
              >
                Sign In
              </Link>
              <button
                onClick={handleQuickDemo}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-semibold rounded-xl text-xs sm:text-sm transition-all"
              >
                ⚡ 1-Click Demo Login
              </button>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/30"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-6 py-16 sm:py-24 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <span>✨ Full-Stack Web Application Suite</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>College Team Project</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Master Personal Finances & <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Plan Smarter Purchases</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            SmartSpend seamlessly unifies your income, day-to-day expenses, monthly category budgets, savings milestones, and planned e-commerce shopping into one intelligent dashboard.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleQuickDemo}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all text-base"
            >
              🚀 Launch Live Interactive Demo
            </button>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold rounded-2xl transition-all text-base"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="text-lg font-bold text-white">Finance Dashboard & KPIs</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Real-time monitoring of net balance, total income, expenses, category breakdowns, and dynamic over-budget warning indicators.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4">
              🎯
            </div>
            <h3 className="text-lg font-bold text-white">Budgets & Savings Goals</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Set monthly category spending caps, track percentage utilization, and track savings progress bars with behind-schedule alerts.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-2xl mb-4">
              🛍️
            </div>
            <h3 className="text-lg font-bold text-white">E-Commerce Shopping Planner</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Plan upcoming wishlist items, evaluate purchase feasibility, search & filter by price or priority, and calculate budget impact before buying.
            </p>
          </div>
        </div>

        {/* Team Collaboration Architecture Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 to-indigo-950/60 border border-indigo-900/50 p-6 rounded-2xl">
          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 text-center sm:text-left">
            GitHub Team Collaboration Architecture
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-700/60">
              <span className="font-bold text-white block">Student 1: Frontend & Dashboard</span>
              <span className="text-slate-400 block mt-0.5">Landing, UI, Routing, Budget UI & Charts</span>
              <span className="inline-block mt-2 font-mono text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                branch: student1-frontend
              </span>
            </div>
            <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-700/60">
              <span className="font-bold text-white block">Student 2: Backend & Database</span>
              <span className="text-slate-400 block mt-0.5">Express APIs, MongoDB models, JWT Auth & Validation</span>
              <span className="inline-block mt-2 font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                branch: student2-backend
              </span>
            </div>
            <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-700/60">
              <span className="font-bold text-white block">Student 3: E-Commerce, QA & Docs</span>
              <span className="text-slate-400 block mt-0.5">Shopping Planner, Product Search, Test Suite & Docs</span>
              <span className="inline-block mt-2 font-mono text-[10px] text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                branch: student3-ecommerce
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        SmartSpend: Personal Finance & E-Commerce Planning Suite &copy; 2026. Built with React, Node.js, Express & MongoDB.
      </footer>
    </div>
  );
}

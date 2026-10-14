import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const DEFAULT_CATEGORIES = [
  'Food',
  'Travel',
  'Education',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Other'
];

export default function BudgetPage() {
  const { formatCurrency } = useAuth();
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Edit budget form
  const [totalBudget, setTotalBudget] = useState(3000);
  const [categoryLimits, setCategoryLimits] = useState({});

  const fetchBudgetStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/budgets/status');
      if (res.data && res.data.success) {
        setBudgetStatus(res.data);
        setTotalBudget(res.data.totalBudget);

        const initialLimits = {};
        (res.data.categoryUsage || []).forEach(cat => {
          initialLimits[cat.category] = cat.limit;
        });
        DEFAULT_CATEGORIES.forEach(c => {
          if (initialLimits[c] === undefined) initialLimits[c] = 200;
        });
        setCategoryLimits(initialLimits);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetStatus();
  }, []);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const categoryBudgets = Object.entries(categoryLimits).map(([category, limit]) => ({
        category,
        limit: Number(limit)
      }));

      await api.post('/budgets', {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        totalBudget: Number(totalBudget),
        categoryBudgets
      });

      setSuccess('Monthly budget limits updated successfully!');
      setIsEditModalOpen(false);
      fetchBudgetStatus();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-400">Loading budget allocations...</div>;
  }

  const {
    totalSpent = 0,
    remainingBudget = 0,
    percentageUsed = 0,
    overallStatus = 'Normal',
    categoryUsage = []
  } = budgetStatus || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Budget Management</h2>
          <p className="text-sm text-slate-500">Define category limits, track spending thresholds, and receive real-time alerts.</p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>⚙️</span> Configure Budget Limits
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          🚨 {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Monthly Budget</span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{formatCurrency(totalBudget)}</div>
          <span className="text-xs text-slate-500 mt-1 block">Allocated spending cap</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Actual Outflow</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{formatCurrency(totalSpent)}</div>
          <span className="text-xs text-rose-500 font-medium mt-1 block">{percentageUsed}% used</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Remaining Cushion</span>
          <div className={`text-2xl font-extrabold mt-1 ${remainingBudget > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(remainingBudget)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Available for discretionary spend</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Overall Health</span>
          <div className={`text-2xl font-extrabold mt-1 ${
            overallStatus === 'Exceeded' ? 'text-rose-600' : overallStatus === 'Warning' ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {overallStatus}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {overallStatus === 'Exceeded' ? 'Over budget limit' : overallStatus === 'Warning' ? 'Approaching 80% cap' : 'Within budget'}
          </span>
        </div>
      </div>

      {/* Category Budget Cards Grid */}
      <div>
        <h3 className="font-bold text-slate-800 text-lg mb-4">Category-Wise Spending Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryUsage.map(cat => {
            const isExceeded = cat.percentage >= 100;
            const isWarning = cat.percentage >= 80 && !isExceeded;

            return (
              <div
                key={cat.category}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-base">{cat.category}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isExceeded
                        ? 'bg-rose-100 text-rose-700'
                        : isWarning
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {cat.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Spent</span>
                      <span className="text-lg font-bold text-slate-800">{formatCurrency(cat.spent)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Limit</span>
                      <span className="text-sm font-semibold text-slate-600">{formatCurrency(cat.limit)}</span>
                    </div>
                  </div>

                  {/* Meter */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{cat.percentage}% of limit used</span>
                  <span className={`font-semibold ${cat.remaining > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {cat.remaining > 0 ? `${formatCurrency(cat.remaining)} left` : `Exceeded by ${formatCurrency(Math.abs(cat.limit - cat.spent))}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Configure Monthly Spending Limits</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSaveBudget} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Overall Monthly Spending Cap ($) *
                </label>
                <input
                  type="number"
                  min="100"
                  required
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <span className="block text-xs font-semibold uppercase text-slate-400 mb-2">Category Allocations ($)</span>
                <div className="grid grid-cols-2 gap-3">
                  {DEFAULT_CATEGORIES.map(cat => (
                    <div key={cat}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{cat}</label>
                      <input
                        type="number"
                        min="0"
                        value={categoryLimits[cat] || 0}
                        onChange={(e) => setCategoryLimits({ ...categoryLimits, [cat]: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Save Limits</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

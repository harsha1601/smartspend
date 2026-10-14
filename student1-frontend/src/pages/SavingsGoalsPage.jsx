import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const CATEGORIES = [
  'Emergency Fund',
  'Vacation',
  'Gadgets',
  'Vehicle',
  'Education',
  'Home',
  'Investment',
  'Other'
];

export default function SavingsGoalsPage() {
  const { formatCurrency } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Goal Form
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: 0,
    targetDate: '',
    category: 'Emergency Fund',
    notes: ''
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/savings');
      if (res.data && res.data.success) {
        setGoals(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/savings', {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount || 0)
      });
      setSuccess('New savings milestone created!');
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        targetAmount: '',
        currentAmount: 0,
        targetDate: '',
        category: 'Emergency Fund',
        notes: ''
      });
      fetchGoals();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount || Number(depositAmount) <= 0) return;

    try {
      await api.post(`/savings/${selectedGoal._id}/contribute`, {
        amount: Number(depositAmount)
      });
      setSuccess(`Deposit of ${formatCurrency(depositAmount)} added to "${selectedGoal.title}"!`);
      setIsDepositModalOpen(false);
      setDepositAmount('');
      fetchGoals();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this savings goal?')) return;
    try {
      await api.delete(`/savings/${id}`);
      setSuccess('Savings goal removed.');
      fetchGoals();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const totalSaved = goals.reduce((s, g) => s + Number(g.currentAmount), 0);
  const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount), 0);
  const completedCount = goals.filter(g => g.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Savings Goals & Wealth Milestones</h2>
          <p className="text-sm text-slate-500">Plan and track long-term assets, emergency cushions, and dream projects.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>🌱</span> Create Savings Goal
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Capital Saved</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{formatCurrency(totalSaved)}</div>
          <span className="text-xs text-slate-500 mt-1 block">Accumulated across all funds</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Target Capital Requirement</span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{formatCurrency(totalTarget)}</div>
          <span className="text-xs text-slate-500 mt-1 block">Total milestone targets</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Completed Goals</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{completedCount} / {goals.length}</div>
          <span className="text-xs text-slate-500 mt-1 block">100% funded milestones</span>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">Loading savings goals...</div>
      ) : goals.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-4xl mb-2">🌱</div>
          <h4 className="font-semibold text-slate-700 text-lg">No savings goals created yet</h4>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Set aside money for emergencies, vacations, gadgets, or vehicles and monitor progress visually.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-lg text-sm hover:bg-emerald-100 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const isCompleted = goal.isCompleted;
            const isBehind = goal.isBehind;

            return (
              <div
                key={goal._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {goal.category}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isBehind
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {isCompleted ? 'Completed 🎉' : isBehind ? 'Behind Schedule ⚠️' : 'On Track'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-800 mt-3">{goal.title}</h4>
                  {goal.notes && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{goal.notes}</p>
                  )}

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Saved</span>
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(goal.currentAmount)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Target</span>
                      <span className="text-sm font-semibold text-slate-700">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-500' : isBehind ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, goal.percentage)}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>{goal.percentage}% funded</span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setDepositAmount('');
                      setIsDepositModalOpen(true);
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 transition-colors text-center"
                  >
                    + Add Deposit
                  </button>

                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                    title="Delete Goal"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Create New Savings Milestone</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vacation Trip to Japan"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Target Amount ($) *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    placeholder="3500"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Initial Savings ($)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Notes / Plan</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Dedicated high-yield interest savings account..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Deposit Modal */}
      {isDepositModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Add Savings Deposit</h3>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleDeposit} className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Contributing towards:</span>
                <span className="font-bold text-slate-800 text-base">{selectedGoal.title}</span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Current: {formatCurrency(selectedGoal.currentAmount)} / Target: {formatCurrency(selectedGoal.targetAmount)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Deposit Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="100.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsDepositModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">Confirm Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

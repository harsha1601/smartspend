import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const { user, formatCurrency } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick Action Modal states
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [quickForm, setQuickForm] = useState({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/dashboard');
      if (res.data && res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddQuickIncome = async (e) => {
    e.preventDefault();
    try {
      await api.post('/incomes', {
        title: quickForm.title,
        amount: Number(quickForm.amount),
        category: quickForm.category || 'Salary',
        date: quickForm.date
      });
      setIsIncomeModalOpen(false);
      setQuickForm({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleAddQuickExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        title: quickForm.title,
        amount: Number(quickForm.amount),
        category: quickForm.category || 'Food',
        date: quickForm.date,
        paymentMethod: 'Credit Card'
      });
      setIsExpenseModalOpen(false);
      setQuickForm({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-medium text-sm">Aggregating financial metrics...</p>
      </div>
    );
  }

  const summary = data?.summary || {};
  const alerts = data?.alerts || [];
  const recent = data?.recentTransactions || [];
  const categoryBreakdown = data?.categoryBreakdown || [];

  // Doughnut Chart Data
  const doughnutData = {
    labels: categoryBreakdown.map(c => c.category),
    datasets: [
      {
        data: categoryBreakdown.map(c => c.amount),
        backgroundColor: [
          '#6366f1', '#10b981', '#f59e0b', '#ef4444', 
          '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'
        ],
        borderWidth: 0
      }
    ]
  };

  const budgetSpentPercent = summary.budgetUsagePercent || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-900/10">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
            Financial Health Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Alex'}!
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            You're using {budgetSpentPercent}% of your monthly budget. All accounts synced with SmartSpend.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setQuickForm({ title: '', amount: '', category: 'Salary', date: new Date().toISOString().split('T')[0] });
              setIsIncomeModalOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
          >
            <span>＋</span> Add Income
          </button>
          <button
            onClick={() => {
              setQuickForm({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
              setIsExpenseModalOpen(true);
            }}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
          >
            <span>＋</span> Log Expense
          </button>
          <Link
            to="/shopping-planner"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-1.5"
          >
            <span>🛍️</span> Plan Purchase
          </Link>
        </div>
      </div>

      {/* Alerts & Warnings Banners */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-sm transition-all ${
                alert.type === 'danger'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <span className="text-xl">{alert.type === 'danger' ? '🚨' : '⚠️'}</span>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{alert.title}</h4>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5 Core Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Income"
          amount={formatCurrency(summary.totalIncome)}
          icon="💰"
          subtitle="All recorded inflows"
          trend="Positive"
          color="emerald"
        />

        <StatCard
          title="Total Expenses"
          amount={formatCurrency(summary.totalExpense)}
          icon="💳"
          subtitle="All recorded outflows"
          trend="Total spent"
          color="rose"
        />

        <StatCard
          title="Net Balance"
          amount={formatCurrency(summary.currentBalance)}
          icon="🏦"
          subtitle="Disposable capital"
          trend="Available"
          color="indigo"
        />

        <StatCard
          title="Monthly Budget Left"
          amount={formatCurrency(summary.remainingBudget)}
          icon="🎯"
          subtitle={`Limit: ${formatCurrency(summary.monthlyBudgetLimit)}`}
          trend={`${budgetSpentPercent}% used`}
          color={budgetSpentPercent >= 80 ? 'rose' : 'sky'}
        />

        <StatCard
          title="Total Savings"
          amount={formatCurrency(summary.totalSavings)}
          icon="🌱"
          subtitle={`Target: ${formatCurrency(summary.totalSavingsTarget)}`}
          trend="Accumulated"
          color="amber"
        />
      </div>

      {/* Budget Progress Bar & E-Commerce Impact Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Monthly Budget Consumption</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current month expenditure vs spending cap
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              budgetSpentPercent >= 100
                ? 'bg-rose-100 text-rose-700'
                : budgetSpentPercent >= 80
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {budgetSpentPercent}% Spent
            </span>
          </div>

          {/* Progress Bar Meter */}
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mt-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetSpentPercent >= 100
                  ? 'bg-rose-500'
                  : budgetSpentPercent >= 80
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, budgetSpentPercent)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Spent This Month</span>
              <span className="font-bold text-slate-700 text-sm mt-0.5 block">{formatCurrency(summary.monthlyExpense)}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Monthly Limit</span>
              <span className="font-bold text-slate-700 text-sm mt-0.5 block">{formatCurrency(summary.monthlyBudgetLimit)}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Remaining Budget</span>
              <span className={`font-bold text-sm mt-0.5 block ${summary.remainingBudget > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(summary.remainingBudget)}
              </span>
            </div>
          </div>
        </div>

        {/* E-Commerce Shopping Planner Quick Card (Student 3 Integration) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">E-Commerce Planner</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
                Student 3 Module
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mt-2">Planned Shopping Outlay</h3>
            <div className="text-3xl font-extrabold text-slate-800 mt-2">
              {formatCurrency(summary.totalPlannedShopping)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary.plannedCount || 0} planned purchases currently queued in wishlist.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Link
              to="/shopping-planner"
              className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors text-center block"
            >
              Open Shopping Planner →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Expense Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Recent Transactions</h3>
            <div className="flex gap-2">
              <Link to="/income" className="text-xs text-emerald-600 hover:underline font-semibold">View Incomes</Link>
              <span className="text-slate-300">•</span>
              <Link to="/expenses" className="text-xs text-rose-600 hover:underline font-semibold">View Expenses</Link>
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No recent transactions recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            tx.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {tx.type === 'income' ? '↓' : '↑'}
                          </span>
                          <span>{tx.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {tx.date}
                      </td>
                      <td className={`py-3.5 px-5 text-right font-bold ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expense Category Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Expense Breakdown</h3>
            <p className="text-xs text-slate-400 mb-4">Spending by category</p>

            {categoryBreakdown.length > 0 ? (
              <div className="w-48 h-48 mx-auto relative my-2">
                <Doughnut
                  data={doughnutData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    cutout: '70%'
                  }}
                />
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">No expense data yet</div>
            )}
          </div>

          <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 max-h-40 overflow-y-auto">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{cat.category}</span>
                <span className="font-bold text-slate-800">{formatCurrency(cat.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Add Income Modal */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Add Income Source</h3>
              <button onClick={() => setIsIncomeModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddQuickIncome} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Income Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Freelance Consulting"
                  value={quickForm.title}
                  onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={quickForm.amount}
                    onChange={(e) => setQuickForm({ ...quickForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={quickForm.category}
                    onChange={(e) => setQuickForm({ ...quickForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Business">Business</option>
                    <option value="Side Hustle">Side Hustle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={quickForm.date}
                  onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsIncomeModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">Save Income</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Log Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Log Daily Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddQuickExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grocery Restock"
                  value={quickForm.title}
                  onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={quickForm.amount}
                    onChange={(e) => setQuickForm({ ...quickForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={quickForm.category}
                    onChange={(e) => setQuickForm({ ...quickForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={quickForm.date}
                  onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

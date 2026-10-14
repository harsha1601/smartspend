import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const CATEGORIES = [
  'All',
  'Food',
  'Travel',
  'Education',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Other'
];

const PAYMENT_METHODS = [
  'All',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
  'UPI/Digital'
];

export default function ExpensePage() {
  const { formatCurrency } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [category, setCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    notes: ''
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (paymentMethod !== 'All') params.append('paymentMethod', paymentMethod);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/expenses?${params.toString()}`);
      if (res.data && res.data.success) {
        setExpenses(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchExpenses();
    }, 200);
    return () => clearTimeout(delay);
  }, [category, paymentMethod, search]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: item.date,
      paymentMethod: item.paymentMethod || 'Credit Card',
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, formData);
        setSuccess('Expense record updated successfully!');
      } else {
        await api.post('/expenses', formData);
        setSuccess('Expense recorded successfully!');
      }
      setIsModalOpen(false);
      fetchExpenses();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setSuccess('Expense record deleted.');
      fetchExpenses();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Expense Management</h2>
          <p className="text-sm text-slate-500">Track and categorize expenditures, bills, groceries, and leisure spending.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>＋</span> Log New Expense
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
          <span className="text-xs font-semibold uppercase text-slate-400">Total Filtered Outflows</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{formatCurrency(totalExpense)}</div>
          <span className="text-xs text-slate-500 mt-1 block">Cumulative spending</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Expense Transactions</span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{expenses.length}</div>
          <span className="text-xs text-slate-500 mt-1 block">Logged items</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Average Outflow</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {formatCurrency(expenses.length > 0 ? totalExpense / expenses.length : 0)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Per transaction event</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-semibold uppercase">Payment:</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {PAYMENT_METHODS.map(pm => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading expense transactions...</div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="text-3xl mb-2">🧾</div>
            No expenses recorded matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Expense Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-5 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map(item => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-800">
                      <div>{item.title}</div>
                      {item.notes && (
                        <p className="text-xs text-slate-400 font-normal mt-0.5">{item.notes}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                      💳 {item.paymentMethod || 'Credit Card'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-slate-800">
                      -{formatCurrency(item.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-slate-400 hover:text-indigo-600 p-1.5 transition-colors mr-1"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">
                {editingId ? 'Edit Expense Record' : 'Log New Expense'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whole Foods Supermarket"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {PAYMENT_METHODS.filter(m => m !== 'All').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Notes / Memo</label>
                <textarea
                  rows="2"
                  placeholder="Optional notes or receipt references..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

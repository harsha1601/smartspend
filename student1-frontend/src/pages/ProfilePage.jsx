import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProfilePage() {
  const { user, updateUser, formatCurrency } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    currency: user?.currency || 'USD',
    monthlyBudgetLimit: user?.monthlyBudgetLimit || 3000,
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password.length < 6) {
      return setError('New password must be at least 6 characters long.');
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        currency: formData.currency,
        monthlyBudgetLimit: Number(formData.monthlyBudgetLimit)
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data && res.data.success) {
        updateUser(res.data.user);
        setSuccess('Profile and preferences updated successfully!');
        setFormData({ ...formData, password: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">User Profile & Account Preferences</h2>
        <p className="text-sm text-slate-500">Manage account information, currency formatting, and security settings.</p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          🚨 {error}
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name || 'User Avatar'}
          className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md flex-shrink-0"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-xl font-bold text-slate-800">{user?.name || 'Alex Morgan'}</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 inline-block self-center sm:self-auto">
              SmartSpend Suite Member
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{user?.email || 'demo@smartspend.com'}</p>
          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-500">
            <span>Primary Currency: <strong className="text-slate-700">{user?.currency || 'USD'}</strong></span>
            <span>•</span>
            <span>Monthly Target: <strong className="text-slate-700">{formatCurrency(user?.monthlyBudgetLimit || 3000)}</strong></span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h4 className="font-bold text-slate-800 text-base mb-4">Edit Profile & Financial Preferences</h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Full Display Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Account Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Preferred Currency Symbol
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - European Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="CAD">CAD (C$) - Canadian Dollar</option>
                <option value="AUD">AUD (A$) - Australian Dollar</option>
                <option value="AED">AED (AED) - UAE Dirham</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Default Monthly Budget Target ($)
              </label>
              <input
                type="number"
                min="100"
                value={formData.monthlyBudgetLimit}
                onChange={(e) => setFormData({ ...formData, monthlyBudgetLimit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h5 className="font-bold text-slate-800 text-sm mb-1">Security & Password</h5>
            <p className="text-xs text-slate-400 mb-3">Leave blank if you do not want to change your password.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all disabled:opacity-60"
            >
              {loading ? 'Saving Changes...' : 'Save Profile Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

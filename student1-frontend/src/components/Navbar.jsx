import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Navbar({ onOpenSidebar, pageTitle }) {
  const { user, changeCurrency, currencies, currentCurrency } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data && res.data.alerts) {
          setAlerts(res.data.alerts);
        }
      } catch (e) {
        // quiet
      }
    };
    fetchAlerts();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Open Menu"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">{pageTitle || 'Dashboard'}</h1>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">SmartSpend Personal Finance & E-Commerce Suite</span>
        </div>
      </div>

      {/* Right: Actions, Currency, Notifications & Avatar */}
      <div className="flex items-center gap-3">
        {/* Live Currency Selector Dropdown */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-sm hover:border-indigo-400 transition-colors">
          <span className="text-indigo-600 font-bold hidden sm:inline">Currency:</span>
          <select
            value={currentCurrency}
            onChange={(e) => changeCurrency(e.target.value)}
            className="bg-transparent border-none text-slate-800 font-bold text-xs focus:outline-none cursor-pointer pr-1"
            title="Change Currency Across Suite"
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} - {c.label.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsAlertOpen(!isAlertOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
            title="Notifications & Alerts"
          >
            🔔
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {isAlertOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsAlertOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-800 text-sm">System Notifications & Alerts</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {alerts.length} Active
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      ✅ All financial indicators healthy! No active alerts.
                    </div>
                  ) : (
                    alerts.map((a, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs ${
                          a.type === 'danger'
                            ? 'bg-rose-50 border-rose-100 text-rose-900'
                            : 'bg-amber-50 border-amber-100 text-amber-900'
                        }`}
                      >
                        <div className="font-bold mb-0.5 flex items-center gap-1.5">
                          <span>{a.type === 'danger' ? '🚨' : '⚠️'}</span>
                          <span>{a.title}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{a.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
          />
          <span className="hidden md:inline-block text-xs font-semibold text-slate-700">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}

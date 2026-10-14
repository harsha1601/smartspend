import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', category: 'Overview' },
    { name: 'Income', path: '/income', icon: '💰', category: 'Finance' },
    { name: 'Expenses', path: '/expenses', icon: '💳', category: 'Finance' },
    { name: 'Budget Limits', path: '/budget', icon: '🎯', category: 'Finance' },
    { name: 'Savings Goals', path: '/savings', icon: '🌱', category: 'Finance' },
    { name: 'Shopping Planner', path: '/shopping-planner', icon: '🛍️', category: 'E-Commerce', badge: 'Student 3' },
    { name: 'Product Search', path: '/product-search', icon: '🔍', category: 'E-Commerce', badge: 'Student 3' },
    { name: 'Analytics & Charts', path: '/analytics', icon: '📈', category: 'Insights' },
    { name: 'User Profile', path: '/profile', icon: '⚙️', category: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-300 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
                S
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block">SmartSpend</span>
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold block -mt-1">Suite 2026</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item, idx) => {
              const isFirstOfCategory = idx === 0 || navItems[idx - 1].category !== item.category;
              return (
                <React.Fragment key={item.path}>
                  {isFirstOfCategory && (
                    <div className="px-3 pt-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </div>
                  )}
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] bg-slate-800 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-md font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* User Profile Badge & Logout Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover border border-slate-700 bg-slate-800 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Alex Morgan'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'demo@smartspend.com'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

import React from 'react';

export default function StatCard({ title, amount, icon, subtitle, trend, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-100/80 text-indigo-700'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-100/80 text-emerald-700'
    },
    rose: {
      bg: 'bg-rose-50/70',
      text: 'text-rose-600',
      border: 'border-rose-100',
      iconBg: 'bg-rose-100/80 text-rose-700'
    },
    amber: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-600',
      border: 'border-amber-100',
      iconBg: 'bg-amber-100/80 text-amber-700'
    },
    sky: {
      bg: 'bg-sky-50/70',
      text: 'text-sky-600',
      border: 'border-sky-100',
      iconBg: 'bg-sky-100/80 text-sky-700'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1 tracking-tight">
            {amount}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">{subtitle}</span>
        {trend && (
          <span className={`font-semibold ${scheme.text}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

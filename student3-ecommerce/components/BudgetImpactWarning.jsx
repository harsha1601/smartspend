import React from 'react';

export default function BudgetImpactWarning({ impact, formatCurrency }) {
  if (!impact) return null;

  const {
    remainingBudget = 0,
    totalPlannedCost = 0,
    highPriorityCost = 0,
    willExceedBudget = false,
    deficit = 0,
    warningLevel = 'Safe'
  } = impact;

  const fmt = (val) => formatCurrency ? formatCurrency(val) : `$${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className={`rounded-xl border p-5 mb-6 transition-all duration-300 shadow-sm ${
      willExceedBudget 
        ? warningLevel === 'Severe'
          ? 'bg-red-50 border-red-200 text-red-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg text-lg flex-shrink-0 ${
            willExceedBudget
              ? warningLevel === 'Severe' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
              : 'bg-emerald-200 text-emerald-800'
          }`}>
            {willExceedBudget ? '⚠️' : '✅'}
          </div>
          <div>
            <h4 className="font-bold text-base">
              {willExceedBudget
                ? `Budget Alert: Planned Shopping Exceeds Remaining Budget!`
                : 'Shopping Budget Status: Healthy & Within Budget'}
            </h4>
            <p className="text-sm mt-0.5 opacity-90">
              {willExceedBudget
                ? `Your unpurchased planned purchases (${fmt(totalPlannedCost)}) exceed this month's remaining budget (${fmt(remainingBudget)}) by ${fmt(deficit)}.`
                : `You have ${fmt(remainingBudget)} left in this month's budget to cover ${fmt(totalPlannedCost)} in planned purchases.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider bg-white/70 px-4 py-2 rounded-lg border border-current/10 self-stretch sm:self-auto justify-around">
          <div>
            <span className="block opacity-60">High Priority</span>
            <span className="text-sm font-bold">{fmt(highPriorityCost)}</span>
          </div>
          <div className="h-6 w-px bg-current/20"></div>
          <div>
            <span className="block opacity-60">Status</span>
            <span className={`text-sm font-bold ${
              warningLevel === 'Severe' ? 'text-red-600' : warningLevel === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {warningLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

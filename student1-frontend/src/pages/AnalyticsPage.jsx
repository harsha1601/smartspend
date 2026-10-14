import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const { formatCurrency } = useAuth();
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/charts');
      if (res.data && res.data.success) {
        setChartsData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-medium text-sm">Generating financial visualizations & trend analytics...</p>
      </div>
    );
  }

  const {
    monthlyTrends = [],
    categoryBreakdown = [],
    savingsOverview = [],
    shoppingBreakdown = []
  } = chartsData || {};

  // 1. Income vs Expense Bar Chart
  const barChartData = {
    labels: monthlyTrends.map(t => t.month),
    datasets: [
      {
        label: 'Income ($)',
        data: monthlyTrends.map(t => t.income),
        backgroundColor: '#10b981',
        borderRadius: 6
      },
      {
        label: 'Expense ($)',
        data: monthlyTrends.map(t => t.expense),
        backgroundColor: '#ef4444',
        borderRadius: 6
      }
    ]
  };

  // 2. Net Savings Growth Line Chart
  const lineChartData = {
    labels: monthlyTrends.map(t => t.month),
    datasets: [
      {
        label: 'Net Monthly Savings ($)',
        data: monthlyTrends.map(t => t.savings),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#4f46e5',
        pointRadius: 4
      }
    ]
  };

  // 3. Category Breakdown Doughnut
  const categoryColors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'
  ];

  const doughnutData = {
    labels: categoryBreakdown.map(c => c.category),
    datasets: [
      {
        data: categoryBreakdown.map(c => c.amount),
        backgroundColor: categoryColors,
        borderWidth: 0
      }
    ]
  };

  // 4. Shopping Wishlist Categories Bar Chart
  const shoppingChartData = {
    labels: shoppingBreakdown.map(s => s.category),
    datasets: [
      {
        label: 'Planned Outlay ($)',
        data: shoppingBreakdown.map(s => s.amount),
        backgroundColor: '#8b5cf6',
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Financial Analytics & Insights</h2>
        <p className="text-sm text-slate-500">
          Visual breakdowns of multi-month cash flow trends, category disbursements, and capital allocation.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          🚨 {error}
        </div>
      )}

      {/* Row 1: Income vs Expense & Net Savings Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Income vs. Expense Trend</h3>
              <p className="text-xs text-slate-400">Past 6 months comparison</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600">
              Bi-axial Flow
            </span>
          </div>

          <div className="h-64 sm:h-72">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>

        {/* Net Monthly Savings Growth Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Net Monthly Cash Surplus</h3>
              <p className="text-xs text-slate-400">Monthly residual savings</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
              Surplus Trend
            </span>
          </div>

          <div className="h-64 sm:h-72">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Category Donut & Planned Shopping Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Expenses Doughnut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Category Expense Distribution</h3>
              <p className="text-xs text-slate-400">Total historical disbursements</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600">
              Donut Ratio
            </span>
          </div>

          <div className="h-64 flex items-center justify-center relative">
            {categoryBreakdown.length > 0 ? (
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } }
                  },
                  cutout: '65%'
                }}
              />
            ) : (
              <span className="text-xs text-slate-400">No expense records found.</span>
            )}
          </div>
        </div>

        {/* Planned Shopping Expenditure by Category (Student 3 Integration) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Planned Shopping by Category</h3>
              <p className="text-xs text-slate-400">Wishlist budget distribution</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg">
              E-Commerce Module
            </span>
          </div>

          <div className="h-64">
            {shoppingBreakdown.length > 0 ? (
              <Bar
                data={shoppingChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No planned shopping items queued yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Savings Goals Progress Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="font-bold text-slate-800 text-base mb-1">Savings Goal Completion Rates</h3>
        <p className="text-xs text-slate-400 mb-4">Progress toward active savings milestones</p>

        <div className="space-y-4">
          {savingsOverview.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.title}</span>
                <span className="text-slate-500 font-medium">
                  {formatCurrency(item.currentAmount)} / {formatCurrency(item.targetAmount)} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

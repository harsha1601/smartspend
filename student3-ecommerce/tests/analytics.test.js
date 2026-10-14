const assert = require('assert');
const { apiRequest } = require('./testHelper');

async function runAnalyticsTests(token) {
  const results = [];
  const authHeader = { Authorization: `Bearer ${token}` };

  // Test 1: Fetch Dashboard KPI Overview
  try {
    const res = await apiRequest('/api/analytics/dashboard', {
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.summary.totalIncome > 0);
    assert.ok(res.data.summary.totalExpense > 0);
    assert.ok(res.data.summary.currentBalance !== undefined);
    assert.ok(Array.isArray(res.data.recentTransactions));
    assert.ok(Array.isArray(res.data.alerts));
    results.push({ test: 'Analytics - Dashboard Financial Overview & KPIs', passed: true });
  } catch (e) {
    results.push({ test: 'Analytics - Dashboard Financial Overview & KPIs', passed: false, error: e.message });
  }

  // Test 2: Fetch Visual Charts Data (6-month trends, Category donuts)
  try {
    const res = await apiRequest('/api/analytics/charts', {
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.monthlyTrends));
    assert.strictEqual(res.data.monthlyTrends.length, 6, 'Must provide 6-month historical trend');
    assert.ok(Array.isArray(res.data.categoryBreakdown));
    results.push({ test: 'Analytics - Visual Trends & Category Breakdown Datasets', passed: true });
  } catch (e) {
    results.push({ test: 'Analytics - Visual Trends & Category Breakdown Datasets', passed: false, error: e.message });
  }

  return { module: 'Financial Analytics, Visualizations & Dynamic Alerts', results };
}

module.exports = { runAnalyticsTests };

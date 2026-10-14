const assert = require('assert');
const { apiRequest } = require('./testHelper');

async function runFinanceTests(token) {
  const results = [];
  const authHeader = { Authorization: `Bearer ${token}` };
  let createdIncomeId = '';
  let createdExpenseId = '';
  let createdGoalId = '';

  // Test 1: Create Income
  try {
    const res = await apiRequest('/api/incomes', {
      method: 'POST',
      headers: authHeader,
      body: {
        title: 'Consulting Honorarium',
        amount: 1500,
        category: 'Freelance',
        date: '2026-10-10',
        description: 'Completed system architectural review'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.amount, 1500);
    createdIncomeId = res.data.data._id;
    results.push({ test: 'Income - Create Income Record', passed: true });
  } catch (e) {
    results.push({ test: 'Income - Create Income Record', passed: false, error: e.message });
  }

  // Test 2: Reject Negative / Zero Income Amount
  try {
    const res = await apiRequest('/api/incomes', {
      method: 'POST',
      headers: authHeader,
      body: {
        title: 'Invalid Income',
        amount: -50,
        category: 'Salary',
        date: '2026-10-10'
      }
    });
    assert.strictEqual(res.status, 400);
    results.push({ test: 'Validation - Reject Non-Positive Income Amount', passed: true });
  } catch (e) {
    results.push({ test: 'Validation - Reject Non-Positive Income Amount', passed: false, error: e.message });
  }

  // Test 3: List Incomes with Category Filter
  try {
    const res = await apiRequest('/api/incomes?category=Freelance', {
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.some(i => i._id === createdIncomeId));
    results.push({ test: 'Income - Filter Incomes by Category', passed: true });
  } catch (e) {
    results.push({ test: 'Income - Filter Incomes by Category', passed: false, error: e.message });
  }

  // Test 4: Create Expense
  try {
    const res = await apiRequest('/api/expenses', {
      method: 'POST',
      headers: authHeader,
      body: {
        title: 'Weekly Supermarket Trip',
        amount: 185.50,
        category: 'Food',
        date: '2026-10-12',
        paymentMethod: 'Credit Card',
        notes: 'Groceries and meal prep ingredients'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.data.category, 'Food');
    createdExpenseId = res.data.data._id;
    results.push({ test: 'Expense - Create Expense Record', passed: true });
  } catch (e) {
    results.push({ test: 'Expense - Create Expense Record', passed: false, error: e.message });
  }

  // Test 5: List Expenses
  try {
    const res = await apiRequest('/api/expenses', {
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.totalExpense >= 185.50);
    results.push({ test: 'Expense - Fetch Expense History & Total Summary', passed: true });
  } catch (e) {
    results.push({ test: 'Expense - Fetch Expense History & Total Summary', passed: false, error: e.message });
  }

  // Test 6: Set & Get Budget
  try {
    const setRes = await apiRequest('/api/budgets', {
      method: 'POST',
      headers: authHeader,
      body: {
        month: 10,
        year: 2026,
        totalBudget: 2800,
        categoryBudgets: [
          { category: 'Food', limit: 500 },
          { category: 'Travel', limit: 300 }
        ]
      }
    });
    assert.strictEqual(setRes.status, 200);

    const statusRes = await apiRequest('/api/budgets/status?month=10&year=2026', {
      headers: authHeader
    });
    assert.strictEqual(statusRes.status, 200);
    assert.strictEqual(statusRes.data.totalBudget, 2800);
    assert.ok(statusRes.data.remainingBudget !== undefined);
    results.push({ test: 'Budget - Set Monthly Spending Limits & Usage Tracking', passed: true });
  } catch (e) {
    results.push({ test: 'Budget - Set Monthly Spending Limits & Usage Tracking', passed: false, error: e.message });
  }

  // Test 7: Create Savings Goal & Deposit
  try {
    const goalRes = await apiRequest('/api/savings', {
      method: 'POST',
      headers: authHeader,
      body: {
        title: 'Emergency Rainy Day Fund',
        targetAmount: 5000,
        currentAmount: 1000,
        targetDate: '2026-12-31',
        category: 'Emergency Fund'
      }
    });
    assert.strictEqual(goalRes.status, 201);
    createdGoalId = goalRes.data.data._id;

    // Contribute $500
    const contribRes = await apiRequest(`/api/savings/${createdGoalId}/contribute`, {
      method: 'POST',
      headers: authHeader,
      body: { amount: 500 }
    });
    assert.strictEqual(contribRes.status, 200);
    assert.strictEqual(contribRes.data.data.currentAmount, 1500);
    results.push({ test: 'Savings - Create Goal & Add Savings Contribution', passed: true });
  } catch (e) {
    results.push({ test: 'Savings - Create Goal & Add Savings Contribution', passed: false, error: e.message });
  }

  return { module: 'Personal Finance Engine (Income, Expense, Budget, Savings)', results };
}

module.exports = { runFinanceTests };

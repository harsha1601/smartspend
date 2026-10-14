const assert = require('assert');
const { apiRequest } = require('./testHelper');

async function runShoppingTests(token) {
  const results = [];
  const authHeader = { Authorization: `Bearer ${token}` };
  let item1Id = '';
  let item2Id = '';

  // Test 1: Add High Priority Product to Shopping Planner
  try {
    const res = await apiRequest('/api/shopping', {
      method: 'POST',
      headers: authHeader,
      body: {
        name: '4K Ultra-Wide Curved Monitor 34-inch',
        category: 'Electronics',
        price: 650,
        quantity: 1,
        priority: 'High',
        expectedDate: '2026-11-15',
        notes: 'Productivity monitor for dual workstation setup'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.priority, 'High');
    assert.strictEqual(res.data.data.price, 650);
    item1Id = res.data.data._id;
    results.push({ test: 'E-Commerce - Add High Priority Item to Shopping Planner', passed: true });
  } catch (e) {
    results.push({ test: 'E-Commerce - Add High Priority Item to Shopping Planner', passed: false, error: e.message });
  }

  // Test 2: Add Second Product
  try {
    const res = await apiRequest('/api/shopping', {
      method: 'POST',
      headers: authHeader,
      body: {
        name: 'Mechanical Ergonomic Keyboard',
        category: 'Electronics',
        price: 150,
        quantity: 2,
        priority: 'Medium',
        expectedDate: '2026-11-20'
      }
    });
    assert.strictEqual(res.status, 201);
    item2Id = res.data.data._id;
    results.push({ test: 'E-Commerce - Add Item with Quantity > 1', passed: true });
  } catch (e) {
    results.push({ test: 'E-Commerce - Add Item with Quantity > 1', passed: false, error: e.message });
  }

  // Test 3: Search by Keyword
  try {
    const res = await apiRequest('/api/shopping?search=Curved', {
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    assert.ok(res.data.data.some(i => i.name.includes('Curved')));
    results.push({ test: 'Product Search - Search by Name Keyword', passed: true });
  } catch (e) {
    results.push({ test: 'Product Search - Search by Name Keyword', passed: false, error: e.message });
  }

  // Test 4: Filter by Priority (High)
  try {
    const res = await apiRequest('/api/shopping?priority=High', {
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.every(i => i.priority === 'High'));
    results.push({ test: 'Product Filter - Filter by Priority Level', passed: true });
  } catch (e) {
    results.push({ test: 'Product Filter - Filter by Priority Level', passed: false, error: e.message });
  }

  // Test 5: Sort by Price Ascending
  try {
    const res = await apiRequest('/api/shopping?sortBy=price&sortOrder=asc', {
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    const prices = res.data.data.map(i => Number(i.price));
    for (let i = 1; i < prices.length; i++) {
      assert.ok(prices[i] >= prices[i - 1], 'Prices must be non-decreasing');
    }
    results.push({ test: 'Product Sorting - Sort by Price (Low to High)', passed: true });
  } catch (e) {
    results.push({ test: 'Product Sorting - Sort by Price (Low to High)', passed: false, error: e.message });
  }

  // Test 6: Toggle Item Purchased Status
  try {
    const res = await apiRequest(`/api/shopping/${item1Id}/toggle-purchased`, {
      method: 'PATCH',
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.isPurchased, true);
    results.push({ test: 'Product Management - Toggle Purchased Status', passed: true });
  } catch (e) {
    results.push({ test: 'Product Management - Toggle Purchased Status', passed: false, error: e.message });
  }

  // Test 7: Budget Impact Analysis
  try {
    const res = await apiRequest('/api/shopping/budget-impact', {
      headers: authHeader
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.totalPlannedCost !== undefined);
    assert.ok(typeof res.data.willExceedBudget === 'boolean');
    assert.ok(['Safe', 'Moderate', 'Severe'].includes(res.data.warningLevel));
    results.push({ test: 'Budget Impact - Calculate Planned Spending vs Monthly Budget', passed: true });
  } catch (e) {
    results.push({ test: 'Budget Impact - Calculate Planned Spending vs Monthly Budget', passed: false, error: e.message });
  }

  return { module: 'E-Commerce Planning Suite & Product Search', results };
}

module.exports = { runShoppingTests };

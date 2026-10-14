const assert = require('assert');
const { apiRequest } = require('./testHelper');

async function runAuthTests() {
  const results = [];
  const testEmail = `testuser_${Date.now()}@example.com`;
  let authToken = '';

  // Test 1: User Registration
  try {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Jane Doe',
        email: testEmail,
        password: 'securePassword123',
        monthlyBudgetLimit: 3000
      }
    });
    assert.strictEqual(res.status, 201, 'Expected 201 Created on valid registration');
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.token, 'Token must be returned');
    assert.strictEqual(res.data.user.email, testEmail);
    authToken = res.data.token;
    results.push({ test: 'User Registration - Valid Credentials', passed: true });
  } catch (e) {
    results.push({ test: 'User Registration - Valid Credentials', passed: false, error: e.message });
  }

  // Test 2: Reject Duplicate Email
  try {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Duplicate Jane',
        email: testEmail,
        password: 'password123'
      }
    });
    assert.strictEqual(res.status, 400, 'Expected 400 Bad Request for duplicate email');
    assert.strictEqual(res.data.success, false);
    results.push({ test: 'User Registration - Reject Duplicate Email', passed: true });
  } catch (e) {
    results.push({ test: 'User Registration - Reject Duplicate Email', passed: false, error: e.message });
  }

  // Test 3: Reject Invalid Short Password
  try {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Short Pass User',
        email: `short_${Date.now()}@example.com`,
        password: '123'
      }
    });
    assert.strictEqual(res.status, 400, 'Expected 400 Bad Request for password < 6 chars');
    results.push({ test: 'Validation - Reject Short Password (<6 chars)', passed: true });
  } catch (e) {
    results.push({ test: 'Validation - Reject Short Password (<6 chars)', passed: false, error: e.message });
  }

  // Test 4: User Login
  try {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'securePassword123'
      }
    });
    assert.strictEqual(res.status, 200, 'Expected 200 OK on valid login');
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.token);
    results.push({ test: 'User Login - Valid Credentials', passed: true });
  } catch (e) {
    results.push({ test: 'User Login - Valid Credentials', passed: false, error: e.message });
  }

  // Test 5: Reject Invalid Password
  try {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'wrongPassword999'
      }
    });
    assert.strictEqual(res.status, 401, 'Expected 401 Unauthorized for incorrect password');
    assert.strictEqual(res.data.success, false);
    results.push({ test: 'Security - Reject Wrong Password', passed: true });
  } catch (e) {
    results.push({ test: 'Security - Reject Wrong Password', passed: false, error: e.message });
  }

  // Test 6: Protected Profile Access
  try {
    const res = await apiRequest('/api/auth/profile', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.user.email, testEmail);
    results.push({ test: 'Protected Route - Get User Profile with JWT', passed: true });
  } catch (e) {
    results.push({ test: 'Protected Route - Get User Profile with JWT', passed: false, error: e.message });
  }

  return { module: 'Authentication & Security', results, token: authToken, email: testEmail };
}

module.exports = { runAuthTests };

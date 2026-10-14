process.env.NODE_ENV = 'test';
const { startTestServer, stopTestServer } = require('./testHelper');
const { runAuthTests } = require('./auth.test');
const { runFinanceTests } = require('./finance.test');
const { runShoppingTests } = require('./shopping.test');
const { runAnalyticsTests } = require('./analytics.test');

async function runTestSuite() {
  console.log('\n================================================================');
  console.log('🧪 SMART SPEND FULL SYSTEM INTEGRATION & COMPONENT TEST SUITE');
  console.log('   Assigned to: Student 3 (E-Commerce, Testing & QA Lead)');
  console.log('================================================================\n');

  let serverInstance;
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  try {
    const { server, baseUrl } = await startTestServer();
    serverInstance = server;
    console.log(`[Test Runner] Test Server active at: ${baseUrl}\n`);

    // 1. Auth Tests
    const authSuite = await runAuthTests();
    printModuleResults(authSuite);
    accumulate(authSuite);

    // 2. Finance Tests (uses token generated from auth suite)
    const financeSuite = await runFinanceTests(authSuite.token);
    printModuleResults(financeSuite);
    accumulate(financeSuite);

    // 3. Shopping & E-Commerce Tests
    const shoppingSuite = await runShoppingTests(authSuite.token);
    printModuleResults(shoppingSuite);
    accumulate(shoppingSuite);

    // 4. Analytics Tests
    const analyticsSuite = await runAnalyticsTests(authSuite.token);
    printModuleResults(analyticsSuite);
    accumulate(analyticsSuite);

    function accumulate(suite) {
      suite.results.forEach(r => {
        totalTests++;
        if (r.passed) passedTests++;
        else failedTests++;
      });
    }

    console.log('\n================================================================');
    console.log('📊 FINAL TEST EXECUTION SUMMARY');
    console.log('================================================================');
    console.log(`Total Test Cases Executed : ${totalTests}`);
    console.log(`Passed                    : ${passedTests} ✅`);
    console.log(`Failed                    : ${failedTests} ${failedTests === 0 ? '' : '❌'}`);
    console.log(`Success Rate              : ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('================================================================\n');

    await stopTestServer();

    if (failedTests > 0) {
      process.exit(1);
    } else {
      console.log('✨ ALL SYSTEM & API CONTRACT TESTS PASSED WITH ZERO ERRORS!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('[Test Runner Fatal Error]:', error);
    if (serverInstance) await stopTestServer();
    process.exit(1);
  }
}

function printModuleResults(suite) {
  console.log(`📦 Module: ${suite.module}`);
  console.log('----------------------------------------------------------------');
  suite.results.forEach(res => {
    if (res.passed) {
      console.log(`  [PASS] ✔ ${res.test}`);
    } else {
      console.log(`  [FAIL] ✖ ${res.test}`);
      console.log(`         Error: ${res.error}`);
    }
  });
  console.log('');
}

runTestSuite();

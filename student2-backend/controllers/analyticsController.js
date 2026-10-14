const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const ShoppingItem = require('../models/ShoppingItem');
const User = require('../models/User');

// @desc    Get dashboard statistics overview
// @route   GET /api/analytics/dashboard
const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const padMonth = String(currentMonth).padStart(2, '0');
    const monthPrefix = `${currentYear}-${padMonth}`;

    // 1. Fetch incomes & expenses
    let incomes = await Income.find({ userId });
    incomes = incomes._data || incomes;
    let expenses = await Expense.find({ userId });
    expenses = expenses._data || expenses;

    const totalIncomeAllTime = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExpenseAllTime = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const currentBalance = totalIncomeAllTime - totalExpenseAllTime;

    // Monthly figures
    const thisMonthIncomes = incomes.filter(i => i.date && i.date.startsWith(monthPrefix));
    const thisMonthExpenses = expenses.filter(e => e.date && e.date.startsWith(monthPrefix));

    const monthlyIncome = thisMonthIncomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const monthlyExpense = thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // 2. Fetch budget
    let budget = await Budget.findOne({ userId, month: currentMonth, year: currentYear });
    const monthlyBudgetLimit = budget ? Number(budget.totalBudget) : 3000;
    const remainingBudget = Math.max(0, monthlyBudgetLimit - monthlyExpense);
    const budgetUsagePercent = monthlyBudgetLimit > 0 
      ? Math.min(100, Math.round((monthlyExpense / monthlyBudgetLimit) * 100))
      : 0;

    // 3. Fetch savings
    let savings = await SavingsGoal.find({ userId });
    savings = savings._data || savings;
    const totalSavings = savings.reduce((sum, s) => sum + Number(s.currentAmount), 0);
    const totalSavingsTarget = savings.reduce((sum, s) => sum + Number(s.targetAmount), 0);

    // 4. Fetch planned shopping
    let shopping = await ShoppingItem.find({ userId });
    shopping = shopping._data || shopping;
    const plannedShopping = shopping.filter(item => !item.isPurchased);
    const totalPlannedShopping = plannedShopping.reduce(
      (sum, item) => sum + Number(item.price) * (Number(item.quantity) || 1),
      0
    );

    // 5. Recent transactions (combined income + expense)
    const formattedIncomes = incomes.map(inc => ({
      id: inc._id,
      title: inc.title,
      type: 'income',
      amount: Number(inc.amount),
      category: inc.category,
      date: inc.date
    }));

    const formattedExpenses = expenses.map(exp => ({
      id: exp._id,
      title: exp.title,
      type: 'expense',
      amount: Number(exp.amount),
      category: exp.category,
      date: exp.date
    }));

    const recentTransactions = [...formattedIncomes, ...formattedExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);

    // 6. Category-wise expense distribution for current month or all-time
    const expenseSource = thisMonthExpenses.length > 0 ? thisMonthExpenses : expenses;
    const categoryTotals = {};
    expenseSource.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: monthlyExpense > 0 ? Math.round((amount / monthlyExpense) * 100) : 0
    }));

    // 7. Dynamic Alerts
    const alerts = [];
    if (monthlyExpense > monthlyBudgetLimit) {
      alerts.push({
        id: 'budget-exceeded',
        type: 'danger',
        title: 'Monthly Budget Exceeded',
        message: `You have spent $${monthlyExpense.toFixed(2)}, which exceeds your monthly budget of $${monthlyBudgetLimit.toFixed(2)} by $${(monthlyExpense - monthlyBudgetLimit).toFixed(2)}.`
      });
    } else if (budgetUsagePercent >= 80) {
      alerts.push({
        id: 'budget-warning',
        type: 'warning',
        title: 'Budget Warning',
        message: `You have used ${budgetUsagePercent}% of your monthly budget. $${remainingBudget.toFixed(2)} remaining.`
      });
    }

    // Check savings goal alerts
    savings.forEach(goal => {
      const targetDate = new Date(goal.targetDate);
      const isPast = targetDate < now;
      const pct = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      if (!isPast && pct < 50 && ((targetDate - now) / (1000 * 60 * 60 * 24)) < 21) {
        alerts.push({
          id: `goal-alert-${goal._id}`,
          type: 'warning',
          title: 'Savings Goal Behind Schedule',
          message: `Goal "${goal.title}" target date is in less than 3 weeks and is only ${Math.round(pct)}% funded.`
        });
      }
    });

    // Check planned purchases exceeding available budget
    if (totalPlannedShopping > remainingBudget && remainingBudget > 0) {
      alerts.push({
        id: 'shopping-budget-excess',
        type: 'warning',
        title: 'Planned Purchases Exceed Remaining Budget',
        message: `Your planned shopping purchases ($${totalPlannedShopping.toFixed(2)}) exceed your remaining monthly budget ($${remainingBudget.toFixed(2)}) by $${(totalPlannedShopping - remainingBudget).toFixed(2)}.`
      });
    } else if (totalPlannedShopping > currentBalance && currentBalance > 0) {
      alerts.push({
        id: 'shopping-balance-excess',
        type: 'danger',
        title: 'Planned Purchases Exceed Current Balance',
        message: `Planned purchases ($${totalPlannedShopping.toFixed(2)}) exceed your current available balance ($${currentBalance.toFixed(2)}).`
      });
    }

    res.status(200).json({
      success: true,
      summary: {
        totalIncome: totalIncomeAllTime,
        totalExpense: totalExpenseAllTime,
        currentBalance,
        monthlyIncome,
        monthlyExpense,
        monthlyBudgetLimit,
        remainingBudget,
        budgetUsagePercent,
        totalSavings,
        totalSavingsTarget,
        totalPlannedShopping,
        plannedCount: plannedShopping.length
      },
      recentTransactions,
      categoryBreakdown,
      alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed financial analytics (charts & trends)
// @route   GET /api/analytics/charts
const getAnalyticsCharts = async (req, res) => {
  try {
    const userId = req.user.id;
    let incomes = await Income.find({ userId });
    incomes = incomes._data || incomes;
    let expenses = await Expense.find({ userId });
    expenses = expenses._data || expenses;

    // Monthly trends (past 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const pad = String(m).padStart(2, '0');
      const prefix = `${y}-${pad}`;
      const label = `${monthNames[m - 1]} ${y}`;

      const incTotal = incomes
        .filter(inc => inc.date && inc.date.startsWith(prefix))
        .reduce((sum, inc) => sum + Number(inc.amount), 0);

      const expTotal = expenses
        .filter(exp => exp.date && exp.date.startsWith(prefix))
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      monthlyTrends.push({
        month: label,
        income: incTotal,
        expense: expTotal,
        savings: Math.max(0, incTotal - expTotal)
      });
    }

    // Expense breakdown by category
    const catMap = {};
    expenses.forEach(e => {
      catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
    });

    const categoryBreakdown = Object.entries(catMap).map(([category, amount]) => ({
      category,
      amount
    }));

    // Savings goals breakdown
    let savings = await SavingsGoal.find({ userId });
    savings = savings._data || savings;
    const savingsOverview = savings.map(s => ({
      title: s.title,
      targetAmount: Number(s.targetAmount),
      currentAmount: Number(s.currentAmount),
      percentage: s.targetAmount > 0 ? Math.min(100, Math.round((s.currentAmount / s.targetAmount) * 100)) : 0
    }));

    // Planned shopping breakdown by category
    let shopping = await ShoppingItem.find({ userId });
    shopping = shopping._data || shopping;
    const shoppingCatMap = {};
    shopping.filter(i => !i.isPurchased).forEach(item => {
      const cost = Number(item.price) * (Number(item.quantity) || 1);
      shoppingCatMap[item.category] = (shoppingCatMap[item.category] || 0) + cost;
    });

    const shoppingBreakdown = Object.entries(shoppingCatMap).map(([category, amount]) => ({
      category,
      amount
    }));

    res.status(200).json({
      success: true,
      monthlyTrends,
      categoryBreakdown,
      savingsOverview,
      shoppingBreakdown
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardOverview,
  getAnalyticsCharts
};

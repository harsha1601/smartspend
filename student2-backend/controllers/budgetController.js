const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get user budget for a month/year (defaults to current date)
// @route   GET /api/budgets
const getBudget = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    let budget = await Budget.findOne({ userId: req.user.id, month, year });

    if (!budget) {
      // Default initial budget layout if not yet explicitly saved
      budget = {
        userId: req.user.id,
        month,
        year,
        totalBudget: 3000,
        categoryBudgets: [
          { category: 'Food', limit: 600 },
          { category: 'Travel', limit: 350 },
          { category: 'Education', limit: 250 },
          { category: 'Shopping', limit: 400 },
          { category: 'Bills', limit: 700 },
          { category: 'Entertainment', limit: 300 },
          { category: 'Healthcare', limit: 200 },
          { category: 'Other', limit: 200 }
        ]
      };
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set or update budget
// @route   POST /api/budgets
const setBudget = async (req, res) => {
  try {
    const { month, year, totalBudget, categoryBudgets } = req.body;
    const targetMonth = Number(month);
    const targetYear = Number(year);

    let existing = await Budget.findOne({ userId: req.user.id, month: targetMonth, year: targetYear });

    let savedBudget;
    if (existing) {
      savedBudget = await Budget.findByIdAndUpdate(
        existing._id,
        {
          totalBudget: Number(totalBudget),
          categoryBudgets: categoryBudgets || existing.categoryBudgets
        },
        { new: true }
      );
    } else {
      savedBudget = await Budget.create({
        userId: req.user.id,
        month: targetMonth,
        year: targetYear,
        totalBudget: Number(totalBudget),
        categoryBudgets: categoryBudgets || []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget saved successfully!',
      data: savedBudget
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get real-time budget usage and status
// @route   GET /api/budgets/status
const getBudgetStatus = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    let budget = await Budget.findOne({ userId: req.user.id, month, year });
    if (!budget) {
      budget = {
        totalBudget: 3000,
        categoryBudgets: [
          { category: 'Food', limit: 600 },
          { category: 'Travel', limit: 350 },
          { category: 'Education', limit: 250 },
          { category: 'Shopping', limit: 400 },
          { category: 'Bills', limit: 700 },
          { category: 'Entertainment', limit: 300 },
          { category: 'Healthcare', limit: 200 },
          { category: 'Other', limit: 200 }
        ]
      };
    }

    // Get this month's expenses
    const padMonth = String(month).padStart(2, '0');
    const monthPrefix = `${year}-${padMonth}`;

    let expenses = await Expense.find({ userId: req.user.id });
    expenses = expenses._data || expenses;
    const currentMonthExpenses = expenses.filter(exp => exp.date && exp.date.startsWith(monthPrefix));

    const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const remainingBudget = Number(budget.totalBudget) - totalSpent;
    const percentageUsed = budget.totalBudget > 0 ? ((totalSpent / budget.totalBudget) * 100).toFixed(1) : 0;

    // Category breakdown
    const categoryUsage = (budget.categoryBudgets || []).map(catObj => {
      const spentInCat = currentMonthExpenses
        .filter(exp => exp.category.toLowerCase() === catObj.category.toLowerCase())
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      const percent = catObj.limit > 0 ? ((spentInCat / catObj.limit) * 100).toFixed(1) : 0;
      let status = 'Normal';
      if (Number(percent) >= 100) status = 'Exceeded';
      else if (Number(percent) >= 80) status = 'Warning';

      return {
        category: catObj.category,
        limit: catObj.limit,
        spent: spentInCat,
        remaining: Math.max(0, catObj.limit - spentInCat),
        percentage: Number(percent),
        status
      };
    });

    let overallStatus = 'Normal';
    if (Number(percentageUsed) >= 100) overallStatus = 'Exceeded';
    else if (Number(percentageUsed) >= 80) overallStatus = 'Warning';

    res.status(200).json({
      success: true,
      month,
      year,
      totalBudget: budget.totalBudget,
      totalSpent,
      remainingBudget,
      percentageUsed: Number(percentageUsed),
      overallStatus,
      categoryUsage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBudget,
  setBudget,
  getBudgetStatus
};

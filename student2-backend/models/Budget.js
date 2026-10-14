const { createModel } = require('./modelHelper');

const budgetSchema = {
  userId: { type: String, required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  totalBudget: { type: Number, required: true, min: 0 },
  categoryBudgets: [
    {
      category: { type: String, required: true },
      limit: { type: Number, required: true, min: 0 }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

const Budget = createModel('Budget', budgetSchema, 'budgets');

module.exports = Budget;

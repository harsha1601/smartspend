const { createModel } = require('./modelHelper');

const savingsGoalSchema = {
  userId: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  targetAmount: { type: Number, required: true, min: 1 },
  currentAmount: { type: Number, default: 0, min: 0 },
  targetDate: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Emergency Fund', 'Vacation', 'Gadgets', 'Vehicle', 'Education', 'Home', 'Investment', 'Other'],
    default: 'Emergency Fund'
  },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['In Progress', 'Completed', 'On Hold'], 
    default: 'In Progress' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

const SavingsGoal = createModel('SavingsGoal', savingsGoalSchema, 'savings');

module.exports = SavingsGoal;

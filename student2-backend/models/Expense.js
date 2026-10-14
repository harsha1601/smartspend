const { createModel } = require('./modelHelper');

const expenseSchema = {
  userId: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Travel', 'Education', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Personal', 'Other'],
    default: 'Food'
  },
  date: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'UPI/Digital'],
    default: 'Credit Card'
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

const Expense = createModel('Expense', expenseSchema, 'expenses');

module.exports = Expense;

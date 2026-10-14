const { createModel } = require('./modelHelper');

const incomeSchema = {
  userId: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { 
    type: String, 
    required: true,
    enum: ['Salary', 'Freelance', 'Investments', 'Business', 'Side Hustle', 'Gifts', 'Other'],
    default: 'Salary'
  },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

const Income = createModel('Income', incomeSchema, 'incomes');

module.exports = Income;

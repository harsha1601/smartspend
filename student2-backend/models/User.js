const { createModel } = require('./modelHelper');

const userSchema = {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  monthlyBudgetLimit: { type: Number, default: 2500 },
  currency: { type: String, default: 'USD' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

const User = createModel('User', userSchema, 'users');

module.exports = User;

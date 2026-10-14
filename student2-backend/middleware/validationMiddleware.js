// Validation helper middleware

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Name is required (at least 2 characters).' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  next();
};

const validateAmount = (req, res, next) => {
  const { amount } = req.body;
  if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Amount must be a valid positive number.' });
  }
  next();
};

const validateIncome = (req, res, next) => {
  const { title, amount, date } = req.body;
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Income title/source is required.' });
  }
  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Income amount must be greater than 0.' });
  }
  if (!date) {
    return res.status(400).json({ success: false, message: 'Income date is required.' });
  }
  next();
};

const validateExpense = (req, res, next) => {
  const { title, amount, category, date } = req.body;
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Expense title is required.' });
  }
  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Expense amount must be greater than 0.' });
  }
  if (!category) {
    return res.status(400).json({ success: false, message: 'Expense category is required.' });
  }
  if (!date) {
    return res.status(400).json({ success: false, message: 'Expense date is required.' });
  }
  next();
};

const validateBudget = (req, res, next) => {
  const { month, year, totalBudget } = req.body;
  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ success: false, message: 'Valid month (1-12) is required.' });
  }
  if (!year || year < 2000 || year > 2100) {
    return res.status(400).json({ success: false, message: 'Valid year is required.' });
  }
  if (totalBudget === undefined || isNaN(Number(totalBudget)) || Number(totalBudget) < 0) {
    return res.status(400).json({ success: false, message: 'Total budget must be a positive number.' });
  }
  next();
};

const validateSavings = (req, res, next) => {
  const { title, targetAmount, targetDate } = req.body;
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Goal title is required.' });
  }
  if (targetAmount === undefined || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
    return res.status(400).json({ success: false, message: 'Target amount must be greater than 0.' });
  }
  if (!targetDate) {
    return res.status(400).json({ success: false, message: 'Target date is required.' });
  }
  next();
};

const validateShoppingItem = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Product name is required.' });
  }
  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ success: false, message: 'Product price must be a valid number >= 0.' });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateAmount,
  validateIncome,
  validateExpense,
  validateBudget,
  validateSavings,
  validateShoppingItem
};

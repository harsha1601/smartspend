const Expense = require('../models/Expense');

// @desc    Get all expenses for current user
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const { category, paymentMethod, startDate, endDate, search } = req.query;
    const query = { userId: req.user.id };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    let expenses = await Expense.find(query);
    expenses = expenses._data || expenses;

    if (search) {
      const term = search.toLowerCase();
      expenses = expenses.filter(exp => 
        exp.title.toLowerCase().includes(term) || 
        (exp.notes && exp.notes.toLowerCase().includes(term))
      );
    }

    if (startDate) {
      expenses = expenses.filter(exp => new Date(exp.date) >= new Date(startDate));
    }
    if (endDate) {
      expenses = expenses.filter(exp => new Date(exp.date) <= new Date(endDate));
    }

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalExpense,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || String(expense.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, paymentMethod, notes } = req.body;
    const expense = await Expense.create({
      userId: req.user.id,
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Food',
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'Credit Card',
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully!',
      data: expense
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const existing = await Expense.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' });
    }

    const { title, amount, category, date, paymentMethod, notes } = req.body;
    const updates = {};
    if (title) updates.title = title.trim();
    if (amount !== undefined) updates.amount = Number(amount);
    if (category) updates.category = category;
    if (date) updates.date = date;
    if (paymentMethod) updates.paymentMethod = paymentMethod;
    if (notes !== undefined) updates.notes = notes;

    const updated = await Expense.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully!',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const existing = await Expense.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Expense record deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};

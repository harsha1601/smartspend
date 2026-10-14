const Income = require('../models/Income');

// @desc    Get all incomes for current user
// @route   GET /api/incomes
const getIncomes = async (req, res) => {
  try {
    const { category, startDate, endDate, search } = req.query;
    const query = { userId: req.user.id };

    if (category && category !== 'All') {
      query.category = category;
    }

    let incomes = await Income.find(query);
    incomes = incomes._data || incomes;

    if (search) {
      const term = search.toLowerCase();
      incomes = incomes.filter(inc => 
        inc.title.toLowerCase().includes(term) || 
        (inc.description && inc.description.toLowerCase().includes(term))
      );
    }

    if (startDate) {
      incomes = incomes.filter(inc => new Date(inc.date) >= new Date(startDate));
    }
    if (endDate) {
      incomes = incomes.filter(inc => new Date(inc.date) <= new Date(endDate));
    }

    incomes.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);

    res.status(200).json({
      success: true,
      count: incomes.length,
      totalIncome,
      data: incomes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single income
// @route   GET /api/incomes/:id
const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income || String(income.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Income record not found.' });
    }
    res.status(200).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new income
// @route   POST /api/incomes
const createIncome = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;
    const income = await Income.create({
      userId: req.user.id,
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Salary',
      date: date || new Date().toISOString().split('T')[0],
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Income added successfully!',
      data: income
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update income
// @route   PUT /api/incomes/:id
const updateIncome = async (req, res) => {
  try {
    const existing = await Income.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Income record not found.' });
    }

    const { title, amount, category, date, description } = req.body;
    const updates = {};
    if (title) updates.title = title.trim();
    if (amount !== undefined) updates.amount = Number(amount);
    if (category) updates.category = category;
    if (date) updates.date = date;
    if (description !== undefined) updates.description = description;

    const updated = await Income.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Income updated successfully!',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete income
// @route   DELETE /api/incomes/:id
const deleteIncome = async (req, res) => {
  try {
    const existing = await Income.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Income record not found.' });
    }

    await Income.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Income record deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
};

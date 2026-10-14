const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get all savings goals for user
// @route   GET /api/savings
const getSavingsGoals = async (req, res) => {
  try {
    let goals = await SavingsGoal.find({ userId: req.user.id });
    goals = goals._data || goals;

    const now = new Date();

    const formattedGoals = goals.map(goal => {
      const target = Number(goal.targetAmount);
      const current = Number(goal.currentAmount);
      const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
      
      const targetDate = new Date(goal.targetDate);
      const isPastTarget = targetDate < now;
      const isBehind = !isPastTarget && percentage < 50 && ((targetDate - now) / (1000 * 60 * 60 * 24)) < 30;

      return {
        ...goal,
        percentage,
        isBehind,
        isCompleted: current >= target
      };
    });

    const totalSaved = goals.reduce((acc, g) => acc + Number(g.currentAmount), 0);
    const totalTarget = goals.reduce((acc, g) => acc + Number(g.targetAmount), 0);

    res.status(200).json({
      success: true,
      count: goals.length,
      totalSaved,
      totalTarget,
      data: formattedGoals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new savings goal
// @route   POST /api/savings
const createSavingsGoal = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, targetDate, category, notes } = req.body;
    const goal = await SavingsGoal.create({
      userId: req.user.id,
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      targetDate,
      category: category || 'Emergency Fund',
      notes: notes || '',
      status: (Number(currentAmount) >= Number(targetAmount)) ? 'Completed' : 'In Progress'
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully!',
      data: goal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update savings goal
// @route   PUT /api/savings/:id
const updateSavingsGoal = async (req, res) => {
  try {
    const existing = await SavingsGoal.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Savings goal not found.' });
    }

    const { title, targetAmount, currentAmount, targetDate, category, notes, status } = req.body;
    const updates = {};
    if (title) updates.title = title.trim();
    if (targetAmount !== undefined) updates.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) updates.currentAmount = Number(currentAmount);
    if (targetDate) updates.targetDate = targetDate;
    if (category) updates.category = category;
    if (notes !== undefined) updates.notes = notes;
    if (status) updates.status = status;

    if (updates.targetAmount && updates.currentAmount !== undefined) {
      if (updates.currentAmount >= updates.targetAmount) updates.status = 'Completed';
    }

    const updated = await SavingsGoal.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Savings goal updated successfully!',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add deposit/contribution to a savings goal
// @route   POST /api/savings/:id/contribute
const contributeToGoal = async (req, res) => {
  try {
    const existing = await SavingsGoal.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Savings goal not found.' });
    }

    const { amount } = req.body;
    const deposit = Number(amount);
    if (isNaN(deposit) || deposit <= 0) {
      return res.status(400).json({ success: false, message: 'Contribution amount must be greater than 0.' });
    }

    const newAmount = Number(existing.currentAmount) + deposit;
    const status = newAmount >= Number(existing.targetAmount) ? 'Completed' : existing.status;

    const updated = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      { currentAmount: newAmount, status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Successfully contributed $${deposit.toFixed(2)} to ${existing.title}!`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete savings goal
// @route   DELETE /api/savings/:id
const deleteSavingsGoal = async (req, res) => {
  try {
    const existing = await SavingsGoal.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Savings goal not found.' });
    }

    await SavingsGoal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  contributeToGoal,
  deleteSavingsGoal
};

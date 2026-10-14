const ShoppingItem = require('../models/ShoppingItem');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Get all shopping items for user with search, filter, and sort
// @route   GET /api/shopping
const getShoppingItems = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      priority, 
      isPurchased, 
      minPrice, 
      maxPrice, 
      sortBy, 
      sortOrder 
    } = req.query;

    let items = await ShoppingItem.find({ userId: req.user.id });
    items = items._data || items;

    // Search by product name or notes
    if (search) {
      const term = search.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(term) || 
        (item.notes && item.notes.toLowerCase().includes(term))
      );
    }

    // Filter by Category
    if (category && category !== 'All') {
      items = items.filter(item => item.category === category);
    }

    // Filter by Priority
    if (priority && priority !== 'All') {
      items = items.filter(item => item.priority === priority);
    }

    // Filter by Purchase Status
    if (isPurchased !== undefined && isPurchased !== 'All') {
      const boolVal = isPurchased === 'true' || isPurchased === true;
      items = items.filter(item => Boolean(item.isPurchased) === boolVal);
    }

    // Filter by Price range
    if (minPrice !== undefined && minPrice !== '') {
      items = items.filter(item => Number(item.price) >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      items = items.filter(item => Number(item.price) <= Number(maxPrice));
    }

    // Sorting
    // Default: Created date desc
    const order = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'price') {
      items.sort((a, b) => (Number(a.price) - Number(b.price)) * order);
    } else if (sortBy === 'date' || sortBy === 'expectedDate') {
      items.sort((a, b) => {
        const da = a.expectedDate ? new Date(a.expectedDate) : new Date(8640000000000000);
        const db = b.expectedDate ? new Date(b.expectedDate) : new Date(8640000000000000);
        return (da - db) * order;
      });
    } else if (sortBy === 'priority') {
      const weight = { High: 3, Medium: 2, Low: 1 };
      items.sort((a, b) => ((weight[b.priority] || 0) - (weight[a.priority] || 0)) * order);
    } else {
      // Default: date created or expected
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Summary calculations
    const totalPlanned = items
      .filter(item => !item.isPurchased)
      .reduce((sum, item) => sum + (Number(item.price) * (Number(item.quantity) || 1)), 0);

    const totalPurchased = items
      .filter(item => item.isPurchased)
      .reduce((sum, item) => sum + (Number(item.price) * (Number(item.quantity) || 1)), 0);

    res.status(200).json({
      success: true,
      count: items.length,
      totalPlanned,
      totalPurchased,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single shopping item
// @route   GET /api/shopping/:id
const getShoppingItemById = async (req, res) => {
  try {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item || String(item.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Shopping item not found.' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create shopping item
// @route   POST /api/shopping
const createShoppingItem = async (req, res) => {
  try {
    const { name, category, price, quantity, priority, expectedDate, notes, productUrl } = req.body;
    const item = await ShoppingItem.create({
      userId: req.user.id,
      name: name.trim(),
      category: category || 'Electronics',
      price: Number(price),
      quantity: Number(quantity) || 1,
      priority: priority || 'Medium',
      expectedDate: expectedDate || '',
      productUrl: productUrl || '',
      notes: notes || '',
      isPurchased: false
    });

    res.status(201).json({
      success: true,
      message: 'Product added to shopping planner!',
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update shopping item
// @route   PUT /api/shopping/:id
const updateShoppingItem = async (req, res) => {
  try {
    const existing = await ShoppingItem.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Shopping item not found.' });
    }

    const { name, category, price, quantity, priority, expectedDate, notes, productUrl, isPurchased } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (category) updates.category = category;
    if (price !== undefined) updates.price = Number(price);
    if (quantity !== undefined) updates.quantity = Number(quantity);
    if (priority) updates.priority = priority;
    if (expectedDate !== undefined) updates.expectedDate = expectedDate;
    if (notes !== undefined) updates.notes = notes;
    if (productUrl !== undefined) updates.productUrl = productUrl;
    if (isPurchased !== undefined) updates.isPurchased = Boolean(isPurchased);

    const updated = await ShoppingItem.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Shopping item updated successfully!',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle purchased status
// @route   PATCH /api/shopping/:id/toggle-purchased
const togglePurchased = async (req, res) => {
  try {
    const existing = await ShoppingItem.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Shopping item not found.' });
    }

    const newStatus = !existing.isPurchased;
    const updated = await ShoppingItem.findByIdAndUpdate(
      req.params.id,
      { isPurchased: newStatus },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: newStatus ? 'Marked as purchased!' : 'Restored to planned wishlist!',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete shopping item
// @route   DELETE /api/shopping/:id
const deleteShoppingItem = async (req, res) => {
  try {
    const existing = await ShoppingItem.findById(req.params.id);
    if (!existing || String(existing.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Shopping item not found.' });
    }

    await ShoppingItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product removed from shopping planner.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Calculate budget impact of planned purchases
// @route   GET /api/shopping/budget-impact
const getBudgetImpact = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // 1. Get current month budget
    let budget = await Budget.findOne({ userId: req.user.id, month, year });
    const totalBudgetLimit = budget ? Number(budget.totalBudget) : 3000;

    // 2. Get current month expenses
    const padMonth = String(month).padStart(2, '0');
    const prefix = `${year}-${padMonth}`;
    let expenses = await Expense.find({ userId: req.user.id });
    expenses = expenses._data || expenses;
    const spentSoFar = expenses
      .filter(exp => exp.date && exp.date.startsWith(prefix))
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    const remainingBudget = Math.max(0, totalBudgetLimit - spentSoFar);

    // 3. Get total unpurchased shopping items
    let items = await ShoppingItem.find({ userId: req.user.id });
    items = items._data || items;
    const unpurchased = items.filter(item => !item.isPurchased);

    const totalPlannedCost = unpurchased.reduce(
      (sum, item) => sum + Number(item.price) * (Number(item.quantity) || 1),
      0
    );

    const highPriorityCost = unpurchased
      .filter(item => item.priority === 'High')
      .reduce((sum, item) => sum + Number(item.price) * (Number(item.quantity) || 1), 0);

    const willExceedBudget = totalPlannedCost > remainingBudget;
    const deficit = willExceedBudget ? totalPlannedCost - remainingBudget : 0;

    res.status(200).json({
      success: true,
      remainingBudget,
      totalPlannedCost,
      highPriorityCost,
      willExceedBudget,
      deficit,
      warningLevel: willExceedBudget ? (deficit > 500 ? 'Severe' : 'Moderate') : 'Safe'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getShoppingItems,
  getShoppingItemById,
  createShoppingItem,
  updateShoppingItem,
  togglePurchased,
  deleteShoppingItem,
  getBudgetImpact
};

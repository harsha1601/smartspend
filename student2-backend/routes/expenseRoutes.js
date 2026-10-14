const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateExpense } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

router.route('/')
  .get(getExpenses)
  .post(validateExpense, createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;

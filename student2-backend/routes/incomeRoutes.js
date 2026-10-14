const express = require('express');
const router = express.Router();
const {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateIncome } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

router.route('/')
  .get(getIncomes)
  .post(validateIncome, createIncome);

router.route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getBudget,
  setBudget,
  getBudgetStatus
} = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBudget } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

router.get('/', getBudget);
router.post('/', validateBudget, setBudget);
router.get('/status', getBudgetStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  contributeToGoal,
  deleteSavingsGoal
} = require('../controllers/savingsController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateSavings } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

router.route('/')
  .get(getSavingsGoals)
  .post(validateSavings, createSavingsGoal);

router.route('/:id')
  .put(updateSavingsGoal)
  .delete(deleteSavingsGoal);

router.post('/:id/contribute', contributeToGoal);

module.exports = router;

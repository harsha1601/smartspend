const express = require('express');
const router = express.Router();
const {
  getShoppingItems,
  getShoppingItemById,
  createShoppingItem,
  updateShoppingItem,
  togglePurchased,
  deleteShoppingItem,
  getBudgetImpact
} = require('../controllers/shoppingController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateShoppingItem } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

router.get('/budget-impact', getBudgetImpact);

router.route('/')
  .get(getShoppingItems)
  .post(validateShoppingItem, createShoppingItem);

router.route('/:id')
  .get(getShoppingItemById)
  .put(updateShoppingItem)
  .delete(deleteShoppingItem);

router.patch('/:id/toggle-purchased', togglePurchased);

module.exports = router;

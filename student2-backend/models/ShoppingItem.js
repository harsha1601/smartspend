const { createModel } = require('./modelHelper');

const shoppingItemSchema = {
  userId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books & Media', 'Health & Beauty', 'Fitness & Sports', 'Other'],
    default: 'Electronics'
  },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, default: 1, min: 1 },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  expectedDate: { type: String, default: '' },
  isPurchased: { type: Boolean, default: false },
  productUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

const ShoppingItem = createModel('ShoppingItem', shoppingItemSchema, 'shopping');

module.exports = ShoppingItem;

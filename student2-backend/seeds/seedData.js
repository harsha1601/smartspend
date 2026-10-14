const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const ShoppingItem = require('../models/ShoppingItem');

const seedDatabase = async ({ quiet = false } = {}) => {
  try {
    if (!quiet) console.log('🌱 Seeding SmartSpend database with realistic demonstration data...');

    // 1. Check if demo user already exists
    let demoUser = await User.findOne({ email: 'demo@smartspend.com' });

    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      demoUser = await User.create({
        name: 'Alex Morgan',
        email: 'demo@smartspend.com',
        password: hashedPassword,
        monthlyBudgetLimit: 3200,
        currency: 'USD',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      if (!quiet) console.log('👤 Created demo user: demo@smartspend.com / password123');
    }

    const userId = String(demoUser._id);

    // Check if user already has data; if not, populate
    const incomeCount = await Income.countDocuments({ userId });
    if (incomeCount === 0) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const pad = (n) => String(n).padStart(2, '0');

      // Incomes
      const sampleIncomes = [
        {
          userId,
          title: 'Senior Software Engineer Salary',
          amount: 4800,
          category: 'Salary',
          date: `${currentYear}-${pad(currentMonth)}-01`,
          description: 'Monthly direct deposit paycheck from TechCorp'
        },
        {
          userId,
          title: 'UI/UX Freelance Design Project',
          amount: 950,
          category: 'Freelance',
          date: `${currentYear}-${pad(currentMonth)}-08`,
          description: 'Client dashboard design milestone completion'
        },
        {
          userId,
          title: 'Stock Portfolio Dividends',
          amount: 320,
          category: 'Investments',
          date: `${currentYear}-${pad(currentMonth)}-12`,
          description: 'Q3 Index ETF quarterly dividends'
        },
        {
          userId,
          title: 'Tech Blog Sponsorship',
          amount: 450,
          category: 'Side Hustle',
          date: `${currentYear}-${pad(currentMonth)}-15`,
          description: 'Monthly newsletter sponsorship spot'
        }
      ];
      await Income.insertMany(sampleIncomes);

      // Expenses
      const sampleExpenses = [
        {
          userId,
          title: 'Apartment Rent & Utilities',
          amount: 1200,
          category: 'Bills',
          date: `${currentYear}-${pad(currentMonth)}-02`,
          paymentMethod: 'Bank Transfer',
          notes: 'Fixed monthly housing expense'
        },
        {
          userId,
          title: 'Whole Foods Grocery Haul',
          amount: 215.50,
          category: 'Food',
          date: `${currentYear}-${pad(currentMonth)}-04`,
          paymentMethod: 'Credit Card',
          notes: 'Bi-weekly organic groceries and pantry restock'
        },
        {
          userId,
          title: 'High-speed Fiber Internet',
          amount: 79.99,
          category: 'Bills',
          date: `${currentYear}-${pad(currentMonth)}-05`,
          paymentMethod: 'Debit Card',
          notes: '1 Gbps home office internet connection'
        },
        {
          userId,
          title: 'Metro Rail Pass & Transit',
          amount: 110,
          category: 'Travel',
          date: `${currentYear}-${pad(currentMonth)}-07`,
          paymentMethod: 'Credit Card',
          notes: 'Monthly public transport card'
        },
        {
          userId,
          title: 'Full Stack Web Architecture Course',
          amount: 149.99,
          category: 'Education',
          date: `${currentYear}-${pad(currentMonth)}-09`,
          paymentMethod: 'Credit Card',
          notes: 'O\'Reilly learning subscription renewal'
        },
        {
          userId,
          title: 'Dinner with Colleagues at Bistro',
          amount: 92.40,
          category: 'Food',
          date: `${currentYear}-${pad(currentMonth)}-11`,
          paymentMethod: 'Credit Card',
          notes: 'Team dinner celebration'
        },
        {
          userId,
          title: 'Netflix, Spotify & Cloud Storage',
          amount: 42.97,
          category: 'Entertainment',
          date: `${currentYear}-${pad(currentMonth)}-13`,
          paymentMethod: 'Credit Card',
          notes: 'Digital entertainment subscriptions'
        },
        {
          userId,
          title: 'Winter Warm Jacket & Boots',
          amount: 220.00,
          category: 'Shopping',
          date: `${currentYear}-${pad(currentMonth)}-14`,
          paymentMethod: 'Credit Card',
          notes: 'Winter apparel discount deal'
        },
        {
          userId,
          title: 'Gym Membership & Fitness Tracker',
          amount: 65.00,
          category: 'Healthcare',
          date: `${currentYear}-${pad(currentMonth)}-15`,
          paymentMethod: 'Debit Card',
          notes: 'Monthly wellness center access'
        }
      ];
      await Expense.insertMany(sampleExpenses);

      // Monthly Budget
      await Budget.create({
        userId,
        month: currentMonth,
        year: currentYear,
        totalBudget: 3200,
        categoryBudgets: [
          { category: 'Bills', limit: 1400 },
          { category: 'Food', limit: 550 },
          { category: 'Travel', limit: 250 },
          { category: 'Education', limit: 200 },
          { category: 'Entertainment', limit: 150 },
          { category: 'Shopping', limit: 350 },
          { category: 'Healthcare', limit: 150 },
          { category: 'Other', limit: 150 }
        ]
      });

      // Savings Goals
      const sampleSavings = [
        {
          userId,
          title: '6-Month Emergency Safety Fund',
          targetAmount: 10000,
          currentAmount: 7200,
          targetDate: `${currentYear + 1}-06-30`,
          category: 'Emergency Fund',
          notes: 'High-yield savings account for unexpected emergencies',
          status: 'In Progress'
        },
        {
          userId,
          title: 'Tokyo & Kyoto Vacation Trip',
          targetAmount: 3500,
          currentAmount: 2600,
          targetDate: `${currentYear}-12-20`,
          category: 'Vacation',
          notes: 'Flights, ryokan booking, and bullet train passes',
          status: 'In Progress'
        },
        {
          userId,
          title: 'M3 MacBook Pro Upgrade',
          targetAmount: 2200,
          currentAmount: 2200,
          targetDate: `${currentYear}-${pad(currentMonth)}-30`,
          category: 'Gadgets',
          notes: 'Dev workstation upgrade - fully funded!',
          status: 'Completed'
        },
        {
          userId,
          title: 'Downpayment for Electric Vehicle',
          targetAmount: 6000,
          currentAmount: 1800,
          targetDate: `${currentYear + 1}-10-15`,
          category: 'Vehicle',
          notes: 'Savings towards clean energy commuter vehicle',
          status: 'In Progress'
        }
      ];
      await SavingsGoal.insertMany(sampleSavings);

      // Shopping Planner Items (E-Commerce Suite)
      const sampleShopping = [
        {
          userId,
          name: 'Sony WH-1000XM5 Wireless Headphones',
          category: 'Electronics',
          price: 348.00,
          quantity: 1,
          priority: 'High',
          expectedDate: `${currentYear}-${pad(currentMonth)}-25`,
          productUrl: 'https://www.sony.com/electronics/headband-headphones/wh-1000xm5',
          notes: 'Active noise-canceling for remote focus',
          isPurchased: false
        },
        {
          userId,
          name: 'Herman Miller Ergonomic Lumbar Chair',
          category: 'Home & Kitchen',
          price: 850.00,
          quantity: 1,
          priority: 'Medium',
          expectedDate: `${currentYear}-${pad(currentMonth + 1 > 12 ? 1 : currentMonth + 1)}-15`,
          productUrl: 'https://store.hermanmiller.com',
          notes: 'Post-holiday office posture upgrade',
          isPurchased: false
        },
        {
          userId,
          name: 'Keychron Q1 Pro Mechanical Keyboard',
          category: 'Electronics',
          price: 199.00,
          quantity: 1,
          priority: 'Medium',
          expectedDate: `${currentYear}-${pad(currentMonth)}-28`,
          productUrl: 'https://keychron.com/products/keychron-q1-pro',
          notes: 'Custom wireless mechanical keyboard',
          isPurchased: false
        },
        {
          userId,
          name: 'Nike Pegasus 41 Running Shoes',
          category: 'Fitness & Sports',
          price: 130.00,
          quantity: 1,
          priority: 'Low',
          expectedDate: `${currentYear}-${pad(currentMonth + 1 > 12 ? 1 : currentMonth + 1)}-05`,
          productUrl: 'https://www.nike.com',
          notes: 'Morning marathon training shoes',
          isPurchased: false
        },
        {
          userId,
          name: 'Designing Data-Intensive Applications Book',
          category: 'Books & Media',
          price: 44.50,
          quantity: 1,
          priority: 'High',
          expectedDate: `${currentYear}-${pad(currentMonth)}-05`,
          productUrl: 'https://www.oreilly.com',
          notes: 'System architecture study material',
          isPurchased: true
        }
      ];
      await ShoppingItem.insertMany(sampleShopping);

      if (!quiet) console.log('✅ Pre-populated realistic financial records, budgets, savings goals, and shopping planner!');
    }

    return {
      success: true,
      user: 'demo@smartspend.com',
      password: 'password123'
    };
  } catch (error) {
    if (!quiet) console.error('❌ Error seeding database:', error.message);
    throw error;
  }
};

// Allow direct execution via `node seeds/seedData.js`
if (require.main === module) {
  require('dotenv').config();
  const { connectDB } = require('../config/db');
  (async () => {
    await connectDB();
    await seedDatabase({ quiet: false });
    process.exit(0);
  })();
}

module.exports = { seedDatabase };

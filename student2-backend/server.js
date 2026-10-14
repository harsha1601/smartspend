require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, getStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { seedDatabase } = require('./seeds/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for development ease
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'SmartSpend: Personal Finance & E-Commerce Planning Suite',
    version: '1.0.0',
    database: getStatus(),
    timestamp: new Date().toISOString()
  });
});

// Seed endpoint for instant demo setup
app.post('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'Demo dataset populated successfully!',
      result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`====================================================`);
    console.log(`🚀 SmartSpend Backend Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);

    // Automatically ensure realistic seed data is loaded for immediate out-of-the-box demo
    try {
      await seedDatabase({ quiet: true });
    } catch (e) {
      // Seed fallback quiet
    }
  });
}

module.exports = app;

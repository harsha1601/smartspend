const express = require('express');
const router = express.Router();
const { getDashboardOverview, getAnalyticsCharts } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/dashboard', getDashboardOverview);
router.get('/charts', getAnalyticsCharts);

module.exports = router;

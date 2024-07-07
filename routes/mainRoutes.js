const express = require('express');
const {
    initializeDatabase,
    listTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData
} = require('../controllers/mainController');

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChart);
router.get('/pie-chart', getPieChart);
router.get('/combined-data', getCombinedData);

module.exports = router;

const axios = require('axios');
const Transaction = require('../models/Transaction');

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        res.status(200).send('Database initialized with seed data');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
};

const listTransactions = async (req, res) => {
    console.log("listTransactions");
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1; // Get month index (1-based)

    // Calculate start and end dates for the selected month
    const startDate = new Date(Date.UTC(2021, monthIndex - 1, 1));
    const endDate = new Date(Date.UTC(2021, monthIndex, 0, 23, 59, 59));

    // Build the search query
    const searchQuery = {
        dateOfSale: {
            $gte: startDate,
            $lte: endDate
        },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            // { price: { $regex: search, $options: 'i' } }  // Handle price search as a string
        ]
    };

    try {
        const transactions = await Transaction.find(searchQuery)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error fetching transactions');
    }
};



const getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1; // Get month index (1-based)

    try {
        const totalSales = await Transaction.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: '$dateOfSale' }, monthIndex] }, // Match month of dateOfSale
                    sold: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$price' },
                    totalCount: { $sum: 1 }
                }
            }
        ]);

        const unsoldCount = await Transaction.countDocuments({
            $expr: { $eq: [{ $month: '$dateOfSale' }, monthIndex] }, // Match month of dateOfSale
            sold: false
        });

        res.status(200).json({
            totalSales: totalSales[0]?.totalAmount || 0,
            totalSoldItems: totalSales[0]?.totalCount || 0,
            totalUnsoldItems: unsoldCount
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error fetching statistics');
    }
};

const getBarChart = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1; // Get month index (1-based)

    try {
        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        const barChartData = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                $expr: {
                    $and: [
                        { $eq: [{ $month: '$dateOfSale' }, monthIndex] }, // Match month of dateOfSale
                        { $gte: ['$price', range.min] },
                        { $lt: ['$price', range.max] }
                    ]
                }
            });
            return { range: range.range, count };
        }));

        res.status(200).json(barChartData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error fetching bar chart data');
    }
};


const getPieChart = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2021}`).getMonth();

    try {
        const pieChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $month: monthIndex + 1 } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $project: { _id: 0, category: '$_id', count: 1 } }
        ]);

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
};

const getCombinedData = async (req, res) => {
    const { month } = req.query;

    try {
        const [transactions, statistics, barChartData, pieChartData] = await Promise.all([
            axios.get(`http://localhost:5000/transactions?month=${month}`),
            axios.get(`http://localhost:5000/statistics?month=${month}`),
            axios.get(`http://localhost:5000/bar-chart?month=${month}`),
            axios.get(`http://localhost:5000/pie-chart?month=${month}`)
        ]);

        res.status(200).json({
            transactions: transactions.data,
            statistics: statistics.data,
            barChart: barChartData.data,
            pieChart: pieChartData.data
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).send('Error fetching combined data');
    }
};

module.exports = {
    initializeDatabase,
    listTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData
};

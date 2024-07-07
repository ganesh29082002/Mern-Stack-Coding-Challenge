const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    dateOfSale: Date,
    sold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

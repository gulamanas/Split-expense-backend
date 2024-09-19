const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be positive']
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    amountPerUser: {
        type: Number,
        required: true,
        min: [0, 'Amount per user must be positive']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
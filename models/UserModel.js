const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    // Optionally, you can track transactions per user
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
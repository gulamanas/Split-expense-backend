const express = require('express')
const mongoose = require('mongoose');

const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel');

const router = express.Router();

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/split', async (req, res) => {
    try {
        const { totalAmount, participantsIds, createdBy } = req.body;

        if (totalAmount == null || totalAmount < 0) {
            return res.status(400).json({ error: 'Invalid totalAmount' });
        }

        if (!Array.isArray(participantsIds) || participantsIds.length === 0) {
            return res.status(400).json({ error: 'Participants must be non-empty array' });
        }

        // validate each participants
        for (const id of participantsIds) {
            if (!validateObjectId(id)) {
                return res.status(400).json
            }
        }

        // Optionally validate createdBy ID
        if (createdBy && !validateObjectId(createdBy)) {
            return res.status(400).json({ error: `Invalid createdBy user ID: ${createdBy}` });
        }

        // Check if all users exist
        const users = await User.find({ _id: { $in: participantsIds } });
        if (users.length !== participantsIds.length) {
            return res.status(404).json({ error: 'One or more users not found' });
        }

        // Calculate the split amount
        const numberOfParticipants = participantsIds.length;
        const amountPerUser = totalAmount / numberOfParticipants;

        // Optional: Update each user's balance and add transaction reference
        // This step should be handled carefully to maintain data consistency
        // Using a transaction session to ensure atomicity

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create the Transaction document
            const transaction = new Transaction({
                totalAmount,
                participants: participantsIds,
                amountPerUser,
                createdBy,
            });

            await transaction.save({ session });

            // Update each user's balance and add the transaction reference
            await User.updateMany(
                { _id: { $in: participantsIds } },
                {
                    $inc: { balance: amountPerUser },
                    $push: { transactions: transaction._id },
                },
                { session }
            );

            if (createdBy) {
                await User.findByIdAndUpdate(
                    createdBy,
                    { $push: { transactions: transaction._id } },
                    { session }
                );
            }

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            res.status(201).json({ message: 'Amount split successfully', transaction });
        } catch (err) {
            // If any error occurs, abort the transaction
            await session.abortTransaction();
            session.endSession();
            throw err;
        }

    } catch (error) {
        console.error('Error splitting amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
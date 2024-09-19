const express = require('express');
const connectDB = require('./config/dbConnection');
const cors = require('cors');
const dotenv = require('dotenv').config();

const authRouter = require('./routes/UserRouter');
const transactionRouter = require('./routes/TransactionRouter')

connectDB();
const app = express();

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/transaction', transactionRouter);

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});
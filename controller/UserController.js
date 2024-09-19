const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
        },
    });
});

const signupUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
        throw new Error('All fields are mandatory');
    }

    let user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        phone,
    });

    const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
        },
    });
});

module.exports = {
    loginUser,
    signupUser,
};
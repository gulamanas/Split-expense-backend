const express = require('express');
const router = express.Router();
const { signupUser, loginUser } = require('../controller/UserController');

// router.get('/test', authMiddleware, async (req, res) => {
//   res.json({ message: 'Token is working' });
// });

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.post('/signout', (req, res) => {
  res.json({ message: 'Signout successful' });
});

module.exports = router;
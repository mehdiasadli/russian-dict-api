const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const wordRouter = require('./word.route');

const router = require('express').Router();

router.use('/api/auth', authRouter);
router.use('/api/words', wordRouter);
router.use('/api/users', userRouter);

module.exports = router;

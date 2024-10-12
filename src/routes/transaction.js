const router = require('express').Router();
const {
  balance,
  topup,
  createTransaction,
  getTransactionHistory,
} = require('../controllers/transaction');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, createTransaction);
router.get('/balance', authenticate, balance);
router.post('/topup', authenticate, topup);
router.get('/history', authenticate, getTransactionHistory);

module.exports = router;

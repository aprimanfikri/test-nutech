const router = require('express').Router();
const user = require('./user');
const banner = require('./banner');
const service = require('./service');
const transaction = require('./transaction');

router.use('/api/v1/users', user);
router.use('/api/v1/banners', banner);
router.use('/api/v1/services', service);
router.use('/api/v1/transactions', transaction);

module.exports = router;

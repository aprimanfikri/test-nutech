const router = require('express').Router();
const { getAllBanners } = require('../controllers/banner');

router.get('/', getAllBanners);

module.exports = router;

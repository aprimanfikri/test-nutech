const router = require('express').Router();
const { getAllServices } = require('../controllers/service');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, getAllServices);

module.exports = router;

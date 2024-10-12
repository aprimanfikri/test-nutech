const router = require('express').Router();
const {
  register,
  login,
  profile,
  update,
  image,
} = require('../controllers/user');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, profile);
router.put('/profile/update', authenticate, update);
router.put('/profile/image', authenticate, upload.single('image'), image);

module.exports = router;

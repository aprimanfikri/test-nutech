const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/apiError');

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);

    if (ext !== '.jpg' && ext !== '.png') {
      cb(new ApiError('Format Image tidak sesuai', 400));
      return;
    }

    cb(null, true);
  },
});

module.exports = upload;

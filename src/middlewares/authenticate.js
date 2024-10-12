const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');

const verify = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token has expired', 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token', 401);
    } else {
      throw new ApiError('Failed to authenticate token', 401);
    }
  }
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError('Unauthorized', 401);
    }

    const decoded = verify(token);

    const user = await prisma.$queryRaw`
      SELECT * FROM "User" WHERE "email" = ${decoded.email}
    `;

    if (!user || user.length === 0) {
      throw new ApiError('User not found', 404);
    }

    req.user = user[0];
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;

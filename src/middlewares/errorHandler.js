module.exports = (err, req, res, next) => {
  const error = {
    statusCode: err.statusCode || 500,
    status: err.status || 500,
    message: err.message,
    data: null,
  };

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    data: null,
  });
  next();
};

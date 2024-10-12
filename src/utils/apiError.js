class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    if (statusCode === 400) {
      this.status = 102;
    } else if (statusCode === 401) {
      this.status = 108;
    } else {
      this.status = 500;
    }
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;

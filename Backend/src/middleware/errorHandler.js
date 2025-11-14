function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const payload = {
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
    },
  };
  // Optional: include stack in non-production
  if (process.env.NODE_ENV !== 'production') payload.error.stack = err.stack;
  res.status(status).json(payload);
}
module.exports = errorHandler;

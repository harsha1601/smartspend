const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at endpoint: ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err.stack || err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };

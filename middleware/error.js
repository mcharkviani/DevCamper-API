const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err);

  // Log to console for dev
  console.log(err.stack.red);

  // Mongoose bad object ID
  console.log(err.name);

  if (err.name === 'CastError') {
    const message = `Bootcamp not found with id of ${req.params.id} (It's not formatted ID)`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  //   if (err.name === 'MongoError') {
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Required fields are not filled. We have Array --> (err.errors)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;

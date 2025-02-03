const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    // Log to console for dev
    console.error(err.stack.red);
  
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = `Resource not found with id of ${err.value}`;
      error = new Error(message);
      error.statusCode = 404;
    }
  
    // Mongoose duplicate key
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      error = new Error(message);
      error.statusCode = 400;
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      error = new Error(messages.join(', '));
      error.statusCode = 400;
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      error = new Error('Invalid token');
      error.statusCode = 401;
    }
  
    // Default to generic error
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
  
  export default errorHandler;
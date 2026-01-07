module.exports = function errorHandlerMiddleware(err, req, res, next) {
  console.log("Global error handler middleware triggered");
  
  const formatValidationErrors = (errors) => {
    const formattedErrors = {};
    
    if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
      Object.keys(errors).forEach(field => {
        if (Array.isArray(errors[field])) {
          formattedErrors[field] = errors[field];
        } else {
          formattedErrors[field] = [errors[field]];
        }
      });
      return formattedErrors;
    }
    
    if (typeof errors === 'string') {
      formattedErrors.error = [errors];
      return formattedErrors;
    }
    
    formattedErrors.error = ["An unexpected error occurred"];
    return formattedErrors;
  };

  if (err && err.name === 'SequelizeValidationError') {
    const formattedErrors = {};
    err.errors.forEach(error => {
      const field = error.path;
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(error.message);
    });
    return res.status(422).json(formattedErrors);
  }
  
  if (err && err.name === 'SequelizeUniqueConstraintError') {
    const formattedErrors = {};
    err.errors.forEach(error => {
      const field = error.path;
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(`${field} must be unique`);
    });
    return res.status(422).json(formattedErrors);
  }

  if (err && err.name === 'ValidationError' && err.errors) {
    return res.status(422).json(formatValidationErrors(err.errors));
  }

  if (err && (err.statusCode || err.status)) {
    const statusCode = err.statusCode || err.status;
    if (statusCode === 422 && err.errors) {
      return res.status(422).json(formatValidationErrors(err.errors));
    }
    return res.status(statusCode).json(formatValidationErrors(err.message || "An error occurred"));
  }

  if (err && err.status === 404) {
    return res.status(404).json({
      error: [err.message || "Resource not found"]
    });
  }

  if (err && err.name && err.name.startsWith('Sequelize')) {
    return res.status(422).json({
      error: [err.message || "Database error occurred"]
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: ["Internal server error"]
  });
};

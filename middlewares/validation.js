module.exports = function validationMiddleware(req, res, next) {
  console.log("Validation middleware");
  
  res.validate = function(data, rules) {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = data[field];
      
      if (rule.required && (value === undefined || value === null || value === '')) {
        if (!errors[field]) errors[field] = [];
        errors[field].push(`${field} is required`);
      }
      
      if (value !== undefined && value !== null && value !== '') {
        if (rule.type === 'string' && typeof value !== 'string') {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`${field} must be a string`);
        }
        
        if (rule.type === 'number' && isNaN(Number(value))) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`${field} must be a number`);
        }
        
        if (rule.type === 'integer' && (!Number.isInteger(Number(value)) || isNaN(Number(value)))) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`${field} must be an integer`);
        }
        
        if (rule.type === 'date' && value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            if (!errors[field]) errors[field] = [];
            errors[field].push(`${field} must be a valid date`);
          } else if (rule.futureDate === false && date > new Date()) {
            if (!errors[field]) errors[field] = [];
            errors[field].push(`${field} cannot be in the future`);
          }
        }
        
        if (rule.minLength && String(value).length < rule.minLength) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`${field} must be at least ${rule.minLength} characters long`);
        }
        
        if (rule.min && String(value).length < rule.min) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`${field} must be at least ${rule.min} characters long`);
        }
        
        if (rule.max && String(value).length > rule.max) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`${field} must be no more than ${rule.max} characters long`);
        }
        
        if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`${field} must be a valid email address`);
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`${field} format is invalid`);
        }
      }
    });
    
    if (Object.keys(errors).length > 0) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = errors;
      validationError.statusCode = 422;
      throw validationError;
    }
    return false; 
  };
  
  res.validateAndReturn422 = function(data, rules) {
    try {
      const hasErrors = res.validate(data, rules);
      return false; 
    } catch (error) {
      throw error;
    }
  };
  
  next();
};

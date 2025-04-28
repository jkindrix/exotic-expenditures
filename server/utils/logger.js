/**
 * Logger utility for server operations
 * Safely logs actions without exposing sensitive information
 */

const winston = require('winston');
const path = require('path');

// Create a custom format for log output
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create a logger with file and console transports
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: customFormat,
  defaultMeta: { service: 'payment-api' },
  transports: [
    // Write logs to file in production
    ...(process.env.NODE_ENV === 'production' 
      ? [
          new winston.transports.File({ 
            filename: path.join(__dirname, '../../logs/error.log'), 
            level: 'error' 
          }),
          new winston.transports.File({ 
            filename: path.join(__dirname, '../../logs/combined.log') 
          })
        ] 
      : []),
    // Always log to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Create a sanitization function to remove sensitive data
const sanitizeData = (data) => {
  if (!data) return data;
  
  let sanitized = JSON.parse(JSON.stringify(data));
  
  // List of fields to redact (expand as needed)
  const sensitiveFields = [
    'password', 'token', 'secret', 'key', 'card', 'account_number', 
    'routing_number', 'ssn', 'access_token', 'public_token'
  ];
  
  // Recursive function to redact sensitive fields
  const redact = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;
    
    Object.keys(obj).forEach(key => {
      // Check if the key contains any sensitive terms
      const isSensitive = sensitiveFields.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      );
      
      if (isSensitive) {
        // Redact the value but hint at the original type
        if (typeof obj[key] === 'string') {
          obj[key] = '[REDACTED STRING]';
        } else if (typeof obj[key] === 'number') {
          obj[key] = '[REDACTED NUMBER]';
        } else if (typeof obj[key] === 'object') {
          obj[key] = '[REDACTED OBJECT]';
        } else {
          obj[key] = '[REDACTED]';
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively check nested objects
        redact(obj[key]);
      }
    });
  };
  
  redact(sanitized);
  return sanitized;
};

// Create wrapped logging functions that sanitize data
const wrappedLogger = {
  error: (message, data) => {
    logger.error(message, sanitizeData(data));
  },
  warn: (message, data) => {
    logger.warn(message, sanitizeData(data));
  },
  info: (message, data) => {
    logger.info(message, sanitizeData(data));
  },
  debug: (message, data) => {
    logger.debug(message, sanitizeData(data));
  }
};

module.exports = wrappedLogger;
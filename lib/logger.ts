import pino from 'pino';

// Define paths to redact from logs
const redactPaths = [
  'headers.authorization',
  'headers.cookie',
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers.cookie', // If you log responses and they set cookies
  '*.password', // Redact 'password' field at any nesting level
  '*.apiKey',   // Redact 'apiKey' field at any nesting level
  '*.secret',   // Redact 'secret' field at any nesting level
  '*.token',    // Redact 'token' field at any nesting level (if not a general, non-sensitive token)
  // Add any application-specific sensitive paths, for example:
  // 'body.creditCard.cvv',
  // 'user.personalInfo.socialSecurityNumber'
];

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]' // Optional: custom censor message
  },
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          // pino-pretty also has a messageFormat option that can be useful
          // messageFormat: '{levelLabel} - {pid} - {hostname} - {req.method} {req.url} - {msg}'
        }
      }
    : undefined // In production, logs will be JSON, typically to stdout
});

// Example of how this logger might be used (especially in API routes):
// logger.info({ req, res, data }, 'Request completed');
// logger.error({ err, req }, 'Error processing request');

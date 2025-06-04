import { AppError } from './AppError';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  details?: any;
}

/**
 * Send a log entry to the monitoring endpoint. Falls back to console logging
 * during development.
 */
export async function logEvent(
  level: LogLevel,
  message: string,
  details?: any
) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    details
  };

  if (process.env.NODE_ENV !== 'production') {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn(entry);
  }

  if (typeof fetch === 'function') {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch {
      // Ignore network errors when sending logs
    }
  }
}

export function logError(error: Error | AppError) {
  logEvent('error', error.message, {
    code: (error as AppError).code,
    stack: error.stack
  });
}

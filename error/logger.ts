import { AppError } from './AppError';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  details?: any;
}

const MAX_LOG_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sendLogToServer(entry: LogEntry, attempt = 1): Promise<void> {
  if (typeof fetch !== 'function') {
    // Not in an environment with fetch (e.g., some Node.js scripts pre-Next.js init)
    return;
  }

  try {
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
      // Add a timeout to prevent hanging indefinitely
      signal: AbortSignal.timeout(5000) // 5-second timeout
    });

    if (!response.ok) {
      // Optionally log a message to console if server returned an error, but don't retry for server errors here.
      // Retries are mainly for transient network issues.
      console.warn(`Failed to send log to server (status: ${response.status}), attempt ${attempt}`);
      if (attempt < MAX_LOG_RETRIES && response.status >= 500) { // Retry only on server errors (5xx)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
        return sendLogToServer(entry, attempt + 1);
      }
    }
  } catch (error) {
    // This catches network errors, AbortError (timeout), etc.
    console.warn(`Error sending log to server (attempt ${attempt}):`, error);
    if (attempt < MAX_LOG_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
      return sendLogToServer(entry, attempt + 1);
    } else {
      console.error('Failed to send log to server after multiple retries:', entry);
    }
  }
}

/**
 * Send a log entry to the monitoring endpoint. Falls back to console logging
 * during development or if server logging fails.
 */
export async function logEvent(
  level: LogLevel,
  message: string,
  details?: any
): Promise<void> {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    details
  };

  if (process.env.NODE_ENV !== 'production') {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn('DEV_LOG:', entry); // Prefix to distinguish from potential console warnings from sendLogToServer
  }

  // Asynchronously send to server without awaiting in the main path of logEvent,
  // unless critical logs require ensuring they are sent.
  // For most cases, logging should not block application flow.
  sendLogToServer(entry).catch(err => {
    // This catch is for unexpected errors from sendLogToServer itself, though it's designed to handle its own errors.
    console.error("Unexpected error in sendLogToServer:", err);
  });
}

export function logError(error: Error | AppError): void {
  logEvent('error', error.message, {
    code: (error as AppError).code,
    stack: error.stack
  });
}

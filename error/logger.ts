import { AppError } from './AppError';

export function logError(error: Error | AppError) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // In real apps we could send the error to a monitoring service
    console.error(error);
  }
}

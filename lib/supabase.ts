import { createClient } from '@supabase/supabase-js';

// Get environment variables (required in all environments)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not defined');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not defined');
}

// Enum for error types to better categorize different failures
export enum SupabaseErrorType {
  NETWORK_ERROR = 'network_error',
  AUTH_ERROR = 'auth_error',
  SERVER_ERROR = 'server_error',
  RATE_LIMIT = 'rate_limit',
  DATABASE_ERROR = 'database_error',
  UNKNOWN_ERROR = 'unknown_error'
}

// Detailed connection status for monitoring
export interface ConnectionStatus {
  online: boolean;
  lastChecked: Date;
  errorCount: number;
  consecutiveErrors: number;
  lastError?: {
    type: SupabaseErrorType;
    message: string;
    timestamp: Date;
    details?: any;
  };
  retryAttempt: number;
}

// Global connection status object - set default to true without checking navigator
export let connectionStatus: ConnectionStatus = {
  online: true, // Fixed: Removed navigator?.onLine reference
  lastChecked: new Date(),
  errorCount: 0,
  consecutiveErrors: 0,
  retryAttempt: 0
};

// Only access browser APIs if running in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    connectionStatus.online = true;
    // Trigger reconnection logic
    checkConnection();
  });
  
  window.addEventListener('offline', () => {
    connectionStatus.online = false;
    connectionStatus.lastError = {
      type: SupabaseErrorType.NETWORK_ERROR,
      message: "Device is offline",
      timestamp: new Date()
    };
  });
}

// Function to classify error types based on response and error details
const classifyError = (error: any): SupabaseErrorType => {
  // Check for browser environment before accessing navigator
  const isOffline = typeof window !== 'undefined' && typeof navigator !== 'undefined' && !navigator.onLine;
  
  if (isOffline) {
    return SupabaseErrorType.NETWORK_ERROR;
  }
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return SupabaseErrorType.NETWORK_ERROR;
  }
  
  if (error?.status === 401 || error?.message?.includes('auth')) {
    return SupabaseErrorType.AUTH_ERROR;
  }
  
  if (error?.status === 429) {
    return SupabaseErrorType.RATE_LIMIT;
  }
  
  if (error?.status >= 500) {
    return SupabaseErrorType.SERVER_ERROR;
  }
  
  if (error?.code === 'PGRST') {
    return SupabaseErrorType.DATABASE_ERROR;
  }
  
  return SupabaseErrorType.UNKNOWN_ERROR;
};

// Enhanced fetch wrapper with detailed error handling and timeout
const enhancedFetch = async (...args: Parameters<typeof fetch>) => {
  try {
    // If we're offline, fail fast
    if (!connectionStatus.online) {
      throw new TypeError('Network connection unavailable');
    }
    
    // Create an AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Add the signal to the fetch options if it's an object
    let fetchArgs = [...args];
    if (fetchArgs.length > 1 && typeof fetchArgs[1] === 'object') {
      fetchArgs[1] = { ...fetchArgs[1], signal: controller.signal };
    } else if (fetchArgs.length === 1) {
      fetchArgs.push({ signal: controller.signal });
    }
    
    try {
      const response = await fetch(...fetchArgs);
      clearTimeout(timeoutId); // Clear the timeout
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        error['status'] = response.status;
        error['data'] = errorData;
        throw error;
      }
      
      // Reset consecutive errors counter on success
      if (connectionStatus.consecutiveErrors > 0) {
        connectionStatus.consecutiveErrors = 0;
        connectionStatus.retryAttempt = 0;
      }
      
      connectionStatus.online = true;
      connectionStatus.lastChecked = new Date();
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId); // Ensure timeout is cleared
      
      // Re-throw the error to be handled by the outer catch
      throw error;
    }
  } catch (error) {
    // Handle AbortController timeout errors
    if (error.name === 'AbortError') {
      error = new TypeError('Request timeout: Failed to fetch (network may be slow or unavailable)');
    }
    
    // Update error stats
    connectionStatus.errorCount++;
    connectionStatus.consecutiveErrors++;
    connectionStatus.lastChecked = new Date();
    
    // Classify the error
    const errorType = classifyError(error);
    
    // Store error details
    connectionStatus.lastError = {
      type: errorType,
      message: error.message || 'Unknown error occurred',
      timestamp: new Date(),
      details: error
    };
    
    console.warn(`Supabase ${errorType} error:`, error);
    
    // For network errors, set online status to false
    if (errorType === SupabaseErrorType.NETWORK_ERROR) {
      connectionStatus.online = false;
    }
    
    // Mocked response data for offline mode or when Supabase is unreachable
    if (errorType === SupabaseErrorType.NETWORK_ERROR && args[0].toString().includes('/coupons')) {
      return new Response(
        JSON.stringify({ 
          data: [], // Return empty array for coupons in offline mode
          count: 0 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return a controlled error response
    return new Response(
      JSON.stringify({ 
        error: { 
          message: connectionStatus.lastError.message,
          code: errorType,
          details: process.env.NODE_ENV === 'development' ? error : undefined
        },
        data: [] // Always include empty data array to prevent undefined errors
      }),
      {
        status: errorType === SupabaseErrorType.NETWORK_ERROR ? 503 : 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Retry strategy with exponential backoff
const withRetry = async (fn, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      connectionStatus.retryAttempt = attempt;
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry for certain error types
      const errorType = classifyError(error);
      if (
        errorType === SupabaseErrorType.AUTH_ERROR || 
        errorType === SupabaseErrorType.RATE_LIMIT
      ) {
        break;
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Connection check function
export const checkConnection = async () => {
  try {
    // Simple health check with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const isOnline = response.ok;
    connectionStatus.online = isOnline;
    connectionStatus.lastChecked = new Date();
    
    if (isOnline) {
      connectionStatus.consecutiveErrors = 0;
      connectionStatus.retryAttempt = 0;
      return { online: true };
    } else {
      throw new Error(`API responded with status ${response.status}`);
    }
  } catch (error) {
    // Handle timeout errors specifically
    if (error.name === 'AbortError') {
      error = new Error('Connection check timed out');
    }
    
    connectionStatus.online = false;
    connectionStatus.lastChecked = new Date();
    connectionStatus.consecutiveErrors++;
    
    connectionStatus.lastError = {
      type: classifyError(error),
      message: error.message || 'Failed to check connection',
      timestamp: new Date(),
      details: error
    };
    
    return { 
      online: false, 
      error: connectionStatus.lastError
    };
  }
};

// Improved client options with advanced error handling
const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: enhancedFetch
  }
};

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Detailed connection test function
export const testSupabaseConnection = async () => {
  try {
    const connectionCheck = await checkConnection();
    if (!connectionCheck.online) {
      return {
        success: false,
        message: 'Failed to connect to Supabase API',
        error: connectionCheck.error,
        diagnostics: {
          url: supabaseUrl,
          hasAnonKey: !!supabaseAnonKey,
          browserOnline: typeof navigator !== 'undefined' ? navigator.onLine : null,
          connectionStatus
        }
      };
    }
    
    // Try a simple query to test database access
    const { data, error, status } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      return {
        success: false,
        message: 'Connected to API but database query failed',
        error,
        status,
        diagnostics: {
          url: supabaseUrl,
          hasAnonKey: !!supabaseAnonKey,
          error: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
          connectionStatus
        }
      };
    }
    
    return {
      success: true,
      message: 'Connected to Supabase successfully',
      diagnostics: {
        url: supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        connectionStatus
      }
    };
  } catch (error) {
    console.warn('Comprehensive Supabase connection test failed:', error);
    
    return {
      success: false,
      message: 'Failed to connect to Supabase',
      error,
      diagnostics: {
        url: supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        errorName: error.name,
        errorMessage: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        connectionStatus
      }
    };
  }
};

// Run an initial connection check only in browser environment
if (typeof window !== 'undefined') {
  checkConnection().catch(console.warn);
}
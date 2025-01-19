import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

// Create axios instance with secure defaults
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable secure cookie handling
  timeout: 30000, // 30 second timeout
  maxContentLength: 5 * 1024 * 1024, // 5MB max content size
});

// Add security headers to all requests
apiClient.interceptors.request.use((config) => {
  // Never send sensitive tokens in headers
  delete config.headers['Authorization'];
  
  // Add CSRF token if available
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  // Add request ID for tracing
  config.headers['X-Request-ID'] = crypto.randomUUID();

  return config;
});

// Handle errors securely
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Add rate limiting
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 60;
const requestTimestamps: number[] = [];

apiClient.interceptors.request.use((config) => {
  const now = Date.now();
  requestTimestamps.push(now);
  
  // Remove timestamps older than 1 minute
  const oneMinuteAgo = now - 60000;
  while (requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length > MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit exceeded');
  }

  return config;
});
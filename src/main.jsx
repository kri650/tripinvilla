import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Polyfill for crypto.randomUUID (not available in older browsers)
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  crypto.randomUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c === 'x' ? 0 : 3)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
  }
}

// Global Fetch Interceptor for Token Expiration (401 Unauthorized)
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    try {
      const clonedResponse = response.clone();
      const errorData = await clonedResponse.json();
      const msg = errorData?.message || '';
      if (msg.includes('invalid token') || msg.includes('missing token') || msg.includes('expired')) {
        // Prevent multiple alerts if multiple concurrent requests fail
        if (!window.__tokenExpiredAlerted) {
          window.__tokenExpiredAlerted = true;
          alert('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user_token');
          localStorage.removeItem('user_role');
          
          // Determine where to redirect based on current path
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else if (window.location.pathname.startsWith('/owner')) {
            window.location.href = '/owner/login';
          } else {
            window.location.href = '/';
          }
        }
      }
    } catch (e) {
      // Ignore JSON parse errors for non-JSON 401 responses
    }
  }
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

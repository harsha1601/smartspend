const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:5000/api'
  : '/api';

class ApiService {
  getToken() {
    return localStorage.getItem('smartspend_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('smartspend_token', token);
    } else {
      localStorage.removeItem('smartspend_token');
    }
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(path, options = {}) {
    const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
    const headers = this.getHeaders(options.headers);

    const config = {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.setToken(null);
          localStorage.removeItem('smartspend_user');
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
            window.location.href = '/login?expired=true';
          }
        }
        const error = new Error(data?.message || `Request failed with status ${response.status}`);
        error.response = { status: response.status, data };
        throw error;
      }

      return { data, status: response.status };
    } catch (err) {
      throw err;
    }
  }

  get(path, headers) {
    return this.request(path, { method: 'GET', headers });
  }

  post(path, body, headers) {
    return this.request(path, { method: 'POST', body, headers });
  }

  put(path, body, headers) {
    return this.request(path, { method: 'PUT', body, headers });
  }

  patch(path, body, headers) {
    return this.request(path, { method: 'PATCH', body, headers });
  }

  delete(path, headers) {
    return this.request(path, { method: 'DELETE', headers });
  }
}

export const api = new ApiService();

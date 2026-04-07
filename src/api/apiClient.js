/**
 * API Client for VitalityTracker Backend
 * Handles all communication with Express API
 * Manages JWT tokens and authenticated requests
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    console.log('[APIClient] Initialized with token:', this.token ? this.token.substring(0, 20) + '...' : 'none');
    this.entities = {
      User: new EntityAPI('auth', this),
      DailyReport: new EntityAPI('daily-reports', this),
      Measurement: new EntityAPI('measurements', this),
      FoodItem: new EntityAPI('foods', this),
    };
  }

  setToken(token) {
    this.token = token;
    console.log('[APIClient] setToken called with:', token ? token.substring(0, 20) + '...' : 'none');
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async submitFeedback(message, rating = null) {
    return this.request('POST', '/feedback', { message, rating });
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(method, endpoint, data = null) {
    try {
      const options = {
        method,
        headers: this.getHeaders(),
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_URL}${endpoint}`, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }
}

class EntityAPI {
  constructor(endpoint, client) {
    this.endpoint = endpoint;
    this.client = client;
  }

  async list(sortBy = '-date', limit = 100) {
    return this.client.request('GET', `/${this.endpoint}?limit=${limit}`);
  }

  async filter(query) {
    // Convert query object to URL params
    const params = new URLSearchParams(query).toString();
    const response = await this.client.request('GET', `/${this.endpoint}?${params}`);
    return Array.isArray(response) ? response : [];
  }

  async create(data) {
    return this.client.request('POST', `/${this.endpoint}`, data);
  }

  async update(id, data) {
    return this.client.request('PUT', `/${this.endpoint}/${id}`, data);
  }

  async delete(id) {
    return this.client.request('DELETE', `/${this.endpoint}/${id}`);
  }

  // Auth-specific methods
  async register(email, password, name) {
    const data = await this.client.request('POST', '/auth/register', { email, password, name }, false);
    if (data.token) {
      this.client.setToken(data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.client.request('POST', '/auth/login', { email, password }, false);
    if (data.token) {
      this.client.setToken(data.token);
    }
    return data;
  }

  async forgotPassword(email) {
    return this.client.request('POST', '/auth/forgot-password', { email }, false);
  }

  async resetPassword(token, newPassword) {
    return this.client.request('POST', '/auth/reset-password', { token, newPassword }, false);
  }
}

// Override request method for auth to not require token
const originalRequest = APIClient.prototype.request;
APIClient.prototype.request = async function(method, endpoint, data = null, includeAuth = true) {
  try {
    const headers = this.getHeaders(includeAuth);
    console.log(`[API] ${method} ${endpoint}`, {
      hasToken: !!this.token,
      auth: headers.Authorization ? headers.Authorization.substring(0, 20) + '...' : 'none',
      data
    });

    const options = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${method} ${endpoint}`, error);
    throw error;
  }
};

export const apiClient = new APIClient();

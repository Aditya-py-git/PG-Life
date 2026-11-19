const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('pglife_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok) {
      const errorMsg = json.message || 'Request failed';
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = json;
      throw error;
    }

    return json;
  } catch (err) {
    if (err.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem('pglife_token');
    }
    throw err;
  }
}

export const api = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    me: () => request('/auth/me'),
    updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) })
  },

  // Properties
  properties: {
    getAll: (params = {}) => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== '' && v !== 'all')
      );
      const query = new URLSearchParams(cleanParams).toString();
      return request(`/properties${query ? `?${query}` : ''}`);
    },
    getFeatured: () => request('/properties/featured'),
    getCities: () => request('/properties/cities'),
    getById: (id) => request(`/properties/${id}`),
    getMyProperties: () => request('/properties/my'),
    create: (data) => request('/properties', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/properties/${id}`, { method: 'DELETE' }),
    addRoom: (propertyId, roomData) => request(`/properties/${propertyId}/rooms`, { method: 'POST', body: JSON.stringify(roomData) })
  },

  // Bookings
  bookings: {
    create: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
    getMyBookings: () => request('/bookings/my'),
    getOwnerBookings: () => request('/bookings/owner'),
    updateStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
  },

  // Visits
  visits: {
    create: (visitData) => request('/visits', { method: 'POST', body: JSON.stringify(visitData) }),
    getMyVisits: () => request('/visits/my'),
    getOwnerVisits: () => request('/visits/owner'),
    updateStatus: (id, status) => request(`/visits/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
  },

  // Reviews
  reviews: {
    getByProperty: (propertyId) => request(`/reviews/property/${propertyId}`),
    create: (reviewData) => request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) })
  },

  // Wishlist
  wishlist: {
    getAll: () => request('/wishlist'),
    toggle: (propertyId) => request('/wishlist/toggle', { method: 'POST', body: JSON.stringify({ property_id: propertyId }) })
  },

  // Complaints / Maintenance Desk
  complaints: {
    getMyComplaints: () => request('/complaints/my'),
    getOwnerComplaints: () => request('/complaints/owner'),
    create: (complaintData) => request('/complaints', { method: 'POST', body: JSON.stringify(complaintData) }),
    updateStatus: (id, status) => request(`/complaints/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
  },

  // Analytics & Stats
  stats: {
    getOwnerDashboard: () => request('/stats/owner')
  }
};

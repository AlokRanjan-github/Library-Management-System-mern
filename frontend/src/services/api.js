import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  registerUser: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('name', response.data.name);
    }
    return response.data;
  },

  loginUser: async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('name', response.data.name);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  },

  getUserProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }
};

export const bookService = {
  getBooks: async (keyword = '', pageNumber = '') => {
    const response = await api.get(`/books?keyword=${keyword}&pageNumber=${pageNumber}`);
    return response.data;
  },

  borrowBook: async (bookId) => {
    const response = await api.post('/books/borrow', { bookId });
    return response.data;
  },

  returnBook: async (borrowId) => {
    const response = await api.post('/books/return', { borrowId });
    return response.data;
  }
};

export const studentService = {
  getBorrowedBooks: async () => {
    const response = await api.get('/student/borrowed');
    return response.data;
  },

  getAvailableBooks: async () => {
    const response = await api.get('/student/books');
    return response.data;
  },

  getFines: async () => {
    const response = await api.get('/student/fines');
    return response.data;
  }
};

export const adminService = {
  getAllStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  getAllBorrowedBooks: async () => {
    const response = await api.get('/admin/borrowed-books');
    return response.data;
  },

  getOverdueBooks: async () => {
    const response = await api.get('/admin/overdue');
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  getAllCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    const response = await api.put(`/admin/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  getPendingReturns: async () => {
    const response = await api.get('/admin/returns/pending');
    return response.data;
  },

  approveReturn: async (id) => {
    const response = await api.post(`/admin/returns/approve/${id}`);
    return response.data;
  }
};

export const publicService = {
  getLibraryStats: async () => {
    const response = await api.get('/public/stats');
    return response.data;
  }
};

export default api;

import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
    preferredLanguage?: string;
  }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(updates: any) {
    const response = await this.api.put('/auth/profile', updates);
    return response.data;
  }

  // Course endpoints
  async getCourses(params?: { 
    language?: string; 
    category?: string; 
    difficulty?: string; 
  }) {
    const response = await this.api.get('/courses', { params });
    return response.data;
  }

  async getCourse(id: string, language?: string) {
    const response = await this.api.get(`/courses/${id}`, { 
      params: { language } 
    });
    return response.data;
  }

  async markLessonComplete(courseId: string, lessonIndex: number) {
    const response = await this.api.post('/courses/complete-lesson', {
      courseId,
      lessonIndex
    });
    return response.data;
  }

  async getProgress() {
    const response = await this.api.get('/courses/progress');
    return response.data;
  }

  async submitQuiz(courseId: string, answers: number[], timeTaken: number) {
    const response = await this.api.post('/quiz/submit', {
      courseId,
      answers,
      timeTaken
    });
    return response.data;
  }

  // Trading endpoints
  async getPortfolio() {
    const response = await this.api.get('/trading/portfolio');
    return response.data;
  }

  async buyStock(symbol: string, quantity: number) {
    const response = await this.api.post('/trading/buy', { symbol, quantity });
    return response.data;
  }

  async sellStock(symbol: string, quantity: number) {
    const response = await this.api.post('/trading/sell', { symbol, quantity });
    return response.data;
  }

  async getMarketData(symbol?: string) {
    const url = symbol ? `/trading/market/${symbol}` : '/trading/market';
    const response = await this.api.get(url);
    return response.data;
  }

  async getWatchlist() {
    const response = await this.api.get('/trading/watchlist');
    return response.data;
  }

  // Translation endpoints
  async translateText(
    text: string, 
    targetLanguage: string, 
    sourceLanguage?: string
  ) {
    const response = await this.api.post('/translation/translate', {
      text,
      targetLanguage,
      sourceLanguage
    });
    return response.data;
  }
}

export default new ApiService();

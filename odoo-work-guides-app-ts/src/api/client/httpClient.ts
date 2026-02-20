/**
 * HTTP Client
 * Cliente HTTP con manejo de errores, retry y interceptores
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/api.config';
import type { RequestConfig } from '../../types/api.types';

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Obtiene los headers con la cookie de sesión
   */
  private async getHeaders(customHeaders?: Record<string, string>): Promise<Record<string, string>> {
    const sessionCookie = await AsyncStorage.getItem('sessionCookie');
    
    const headers = {
      ...this.defaultHeaders,
      ...customHeaders,
    };

    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }

    return headers;
  }

  /**
   * Maneja los errores de las peticiones
   */
  private handleError(error: any): never {
    if (error.response) {
      // Error de respuesta del servidor
      const message = error.response.data?.message || error.response.data?.error || 'Error del servidor';
      throw new Error(message);
    } else if (error.request) {
      // Error de red
      throw new Error('Error de conexión. Verifica tu red.');
    } else {
      // Error desconocido
      throw new Error(error.message || 'Error desconocido');
    }
  }

  /**
   * Realiza un fetch con timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = this.timeout
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado');
      }
      throw error;
    }
  }

  /**
   * Implementa retry logic
   */
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retries: number = API_CONFIG.MAX_RETRIES
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= retries; i++) {
      try {
        const response = await this.fetchWithTimeout(url, options);
        
        // Si la respuesta no es OK, lanzar error
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        lastError = error;
        
        // No reintentar en ciertos errores
        if (
          error.message.includes('401') ||
          error.message.includes('403') ||
          error.message.includes('404')
        ) {
          throw error;
        }

        // Esperar antes de reintentar
        if (i < retries) {
          await new Promise(resolve => 
            setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1))
          );
        }
      }
    }

    throw lastError!;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    try {
      const headers = await this.getHeaders(config?.headers);
      const url = `${this.baseURL}${endpoint}`;

      return await this.fetchWithRetry<T>(url, {
        method: 'GET',
        headers,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const headers = await this.getHeaders(config?.headers);
      const url = `${this.baseURL}${endpoint}`;

      return await this.fetchWithRetry<T>(url, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const headers = await this.getHeaders(config?.headers);
      const url = `${this.baseURL}${endpoint}`;

      return await this.fetchWithRetry<T>(url, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    try {
      const headers = await this.getHeaders(config?.headers);
      const url = `${this.baseURL}${endpoint}`;

      return await this.fetchWithRetry<T>(url, {
        method: 'DELETE',
        headers,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Guarda la cookie de sesión
   */
  async saveSessionCookie(cookie: string): Promise<void> {
    await AsyncStorage.setItem('sessionCookie', cookie);
  }

  /**
   * Limpia la cookie de sesión
   */
  async clearSessionCookie(): Promise<void> {
    await AsyncStorage.removeItem('sessionCookie');
  }
}

export default new HttpClient();

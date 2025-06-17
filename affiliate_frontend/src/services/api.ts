import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response; 
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {_retry?: boolean};
    
    console.error(`❌ API Error: 
      url: ${error.config?.url},
      method: ${error.config?.method},
      status: ${error.response?.status},
      message: ${error.message},
      data: ${JSON.stringify(error.response?.data, null, 2)}
    `)

    /*HANDLE AUTHENTICATION ISSUES SOON */
    /*NOTIFICATIONS ISSUES */

    return Promise.reject(error)
  
  } 
)

export default api;
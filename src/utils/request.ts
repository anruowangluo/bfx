// 封装 axios 请求
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { generateRequestId, retry } from './network';

// 创建 axios 实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: 'http://w33299s260.zicp.vip/api/v1/prompt',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 生成请求 ID
      config.headers['X-Request-ID'] = generateRequestId();
      // 可以在这里添加 token 等认证信息
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return response.data;
    },
    (error) => {
      console.error('API 请求错误:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

// 创建 axios 实例
const apiClient = createAxiosInstance();

/**
 * 封装 GET 请求
 * @param url 请求 URL
 * @param params 查询参数
 * @param config 配置选项
 * @returns Promise
 */
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return retry(() => apiClient.get(url, { params, ...config }));
};

/**
 * 封装 POST 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param config 配置选项
 * @returns Promise
 */
export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return retry(() => apiClient.post(url, data, config));
};

/**
 * 封装 PUT 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param config 配置选项
 * @returns Promise
 */
export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return retry(() => apiClient.put(url, data, config));
};

/**
 * 封装 DELETE 请求
 * @param url 请求 URL
 * @param config 配置选项
 * @returns Promise
 */
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return retry(() => apiClient.delete(url, config));
};

export default {
  get,
  post,
  put,
  delete: del,
  apiClient,
};

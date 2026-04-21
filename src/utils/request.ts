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
 * 统一请求方法
 * @param config 请求配置
 * @returns Promise
 */
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const {
    url,
    method = 'get',
    params,
    data,
    ...restConfig
  } = config;

  if (!url) {
    throw new Error('URL is required');
  }

  const requestFn = async () => {
    switch (method.toLowerCase()) {
      case 'get':
        return apiClient.get(url, { params, ...restConfig });
      case 'post':
        return apiClient.post(url, data, restConfig);
      case 'put':
        return apiClient.put(url, data, restConfig);
      case 'delete':
        return apiClient.delete(url, { params, data, ...restConfig });
      default:
        return apiClient.request({ url, method, params, data, ...restConfig });
    }
  };

  return retry(requestFn);
};

/**
 * 封装 GET 请求
 * @param url 请求 URL
 * @param params 查询参数
 * @param config 配置选项
 * @returns Promise
 */
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ url, method: 'get', params, ...config });
};

/**
 * 封装 POST 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param config 配置选项
 * @returns Promise
 */
export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ url, method: 'post', data, ...config });
};

/**
 * 封装 PUT 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param config 配置选项
 * @returns Promise
 */
export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ url, method: 'put', data, ...config });
};

/**
 * 封装 DELETE 请求
 * @param url 请求 URL
 * @param config 配置选项
 * @returns Promise
 */
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ url, method: 'delete', ...config });
};

export default request;

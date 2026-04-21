// 封装 axios 请求
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { generateRequestId, retry } from './network';

// 错误码
const errorCode: Record<number, string> = {
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求地址出错',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  default: '网络连接异常，请检查您的网络' 
};

// 是否显示重新登录
export let isRelogin = {
  show: false,
};

// 创建 axios 实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: 'http://w33299s260.zicp.vip/api/v1/prompt',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 防止重复提交
  const cache: Record<string, { data: string; time: number }> = {};

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 生成请求 ID
      config.headers['X-Request-ID'] = generateRequestId();
      
      // 是否需要设置 token
      const isToken = (config.headers || {}).isToken === false;
      // 是否需要防止数据重复提交
      const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
      
      // 这里可以添加 token 处理
      // const token = store.getters.token;
      // if (token && !isToken) {
      //   config.headers['Authorization'] = 'Bearer ' + token;
      // }
      
      // get请求映射params参数
      if (config.method === 'get' && config.params) {
        let url = config.url + '?' + new URLSearchParams(config.params).toString();
        config.params = {};
        config.url = url;
      }
      
      // 防止重复提交
      if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
        const requestObj = {
          url: config.url,
          data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
          time: new Date().getTime(),
        };
        
        const key = `${requestObj.url}_${requestObj.data}`;
        const sessionObj = cache[key];
        
        if (sessionObj) {
          const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
          if (requestObj.time - sessionObj.time < interval) {
            console.warn('数据正在处理，请勿重复提交');
            return Promise.reject(new Error('数据正在处理，请勿重复提交'));
          }
        }
        
        cache[key] = requestObj;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('API 请求成功:', response.config.url, response.status);
      
      // 未设置状态码则默认成功状态
      const code = response.data && response.data.code !== undefined && response.data.code !== null 
        ? Number(response.data.code) 
        : 200;
      
      // 获取错误信息
      const msg = errorCode[code] || response.data.msg || errorCode.default;
      
      // 二进制数据则直接返回
      if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
        return response.data;
      }
      
      if (code === 401) {
        if (!isRelogin.show) {
          isRelogin.show = true;
          // 这里可以添加重新登录的逻辑
          console.warn('登录状态已过期，请重新登录');
        }
        return Promise.reject(new Error('无效的会话，或者会话已过期，请重新登录。'));
      } else if (code === 500) {
        console.error(msg);
        return Promise.reject(new Error(msg));
      } else if (code !== 200) {
        console.error(msg);
        return Promise.reject(new Error(msg));
      } else {
        if (response.data && response.data.success) {
          return response.data.data;
        }
        return response.data;
      }
    },
    (error) => {
      console.error('API 请求错误:', error.config?.url, error.message, error.response?.status);
      console.error('错误详情:', error);
      
      let message = error.response && error.response.data && (error.response.data.msg || error.response.data.message) ||
                   error.message ||
                   errorCode.default;
      
      if (message === 'Network Error') {
        message = '后端接口连接异常';
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时';
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常';
      }
      
      console.error(message);
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

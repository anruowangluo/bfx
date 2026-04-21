// 存储工具函数

/**
 * 保存数据到本地存储
 * @param key 存储键名
 * @param value 存储值
 */
export const setStorage = (key: string, value: any): void => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * 从本地存储获取数据
 * @param key 存储键名
 * @returns 存储的值，如果不存在或解析失败则返回 null
 */
export const getStorage = <T>(key: string): T | null => {
  try {
    const jsonValue = localStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * 从本地存储删除数据
 * @param key 存储键名
 */
export const removeStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * 清空本地存储
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * 保存数据到会话存储
 * @param key 存储键名
 * @param value 存储值
 */
export const setSessionStorage = (key: string, value: any): void => {
  try {
    const jsonValue = JSON.stringify(value);
    sessionStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
  }
};

/**
 * 从会话存储获取数据
 * @param key 存储键名
 * @returns 存储的值，如果不存在或解析失败则返回 null
 */
export const getSessionStorage = <T>(key: string): T | null => {
  try {
    const jsonValue = sessionStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return null;
  }
};

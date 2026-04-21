import request from '../utils/request.ts';

// Types
export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  category_id: string;
  category_name: string;
  category_color: string;
  tags: string[];
  likes_count: number;
  saves_count: number;
  created_at: string;
  updated_at?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Comment {
  id: string;
  prompt_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

// 提示词相关接口
export function getPrompts(categoryId?: string) {
  const params: any = {};
  if (categoryId && categoryId !== 'all') {
    params.category_id = categoryId;
  }
  return request({
    url: '/prompts',
    method: 'get',
    params: params
  });
}

export function getPromptById(id: string) {
  return request({
    url: `/prompts/${id}`,
    method: 'get'
  });
}

export function createPrompt(data: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'saves_count'>) {
  return request({
    url: '/prompts',
    method: 'post',
    data: data
  });
}

export function likePrompt(promptId: string) {
  return request({
    url: `/prompts/${promptId}/like`,
    method: 'post'
  });
}

export function savePrompt(promptId: string) {
  return request({
    url: `/prompts/${promptId}/save`,
    method: 'post'
  });
}

// 分类相关接口
export function getCategories() {
  return request({
    url: '/categories',
    method: 'get'
  });
}

// 评论相关接口
export function getComments(promptId: string) {
  return request({
    url: `/prompts/${promptId}/comments`,
    method: 'get'
  });
}

export function createComment(data: { prompt_id: string; content: string }) {
  return request({
    url: `/prompts/${data.prompt_id}/comments`,
    method: 'post',
    data: {
      content: data.content
    }
  });
}

// 用户相关接口
export function getUserById(userId: string) {
  return request({
    url: `/users/${userId}`,
    method: 'get'
  });
}

// 登录注册相关接口
export function login(username?: string, password?: string, code?: string, uuid?: string) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  });
}

export function register(data: any) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  });
}

export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  });
}

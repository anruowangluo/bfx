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
export async function getPrompts(categoryId?: string) {
  const params: any = {};
  if (categoryId && categoryId !== 'all') {
    params.category_id = categoryId;
  }
  return request({
    url: '/api/v1/prompt/prompts',
    method: 'get',
    params: params
  });
}

export async function getPromptById(id: string) {
  return request({
    url: `/api/v1/prompt/prompts/${id}`,
    method: 'get'
  });
}

export async function createPrompt(data: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'saves_count'>) {
  return request({
    url: '/api/v1/prompt/prompts',
    method: 'post',
    data: data
  });
}

export async function likePrompt(promptId: string) {
  return request({
    url: `/api/v1/prompt/prompts/${promptId}/like`,
    method: 'post'
  });
}

export async function savePrompt(promptId: string) {
  return request({
    url: `/api/v1/prompt/prompts/${promptId}/save`,
    method: 'post'
  });
}

// 分类相关接口
export async function getCategories() {
  return request({
    url: '/api/v1/prompt/categories',
    method: 'get'
  });
}

// 评论相关接口
export async function getComments(promptId: string) {
  return request({
    url: `/api/v1/prompt/prompts/${promptId}/comments`,
    method: 'get'
  });
}

export async function createComment(data: { prompt_id: string; content: string }) {
  return request({
    url: `/api/v1/prompt/prompts/${data.prompt_id}/comments`,
    method: 'post',
    data: {
      content: data.content
    }
  });
}

// 用户相关接口
export async function getUserById(userId: string) {
  return request({
    url: `/api/v1/prompt/users/${userId}`,
    method: 'get'
  });
}

// 登录注册相关接口
export async function login(username?: string, password?: string, code?: string, uuid?: string) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return request({
    url: '/api/v1/prompt/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  });
}

export async function register(data: any) {
  return request({
    url: '/api/v1/prompt/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  });
}

export async function getCodeImg() {
  return request({
    url: '/api/v1/prompt/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  });
}

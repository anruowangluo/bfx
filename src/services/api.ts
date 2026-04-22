import request from '../utils/request.ts';

// 开关：是否使用模拟数据
export const useMockData = true;

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

// Mock数据
const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "逼真肖像",
    description: "创建具有细致特征的逼真人物肖像",
    content: "创建一幅 [年龄] 岁的 [性别] 逼真肖像，拥有 [发色] 头发和 [眼睛颜色] 眼睛。肖像应该采用 [风格] 风格，搭配 [光线] 光线。",
    author_id: "user1",
    author_name: "艺术家123",
    author_avatar: "https://via.placeholder.com/40",
    category_id: "1",
    category_name: "艺术",
    category_color: "#F43F5E",
    tags: ["肖像", "逼真", "人物", "艺术", "绘画"],
    likes_count: 120,
    saves_count: 85,
    created_at: "2026-04-21T13:48:05Z",
    updated_at: "2026-04-21T13:48:05Z",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=realistic%20portrait%20painting%20of%20a%20person%20with%20detailed%20features&image_size=landscape_4_3"
  },
  {
    id: "2",
    title: "博客文章大纲",
    description: "生成吸引人的博客文章大纲",
    content: "为一篇关于 [主题] 的博客文章创建详细大纲。大纲应包含引言、[数量] 个带有子要点的主要章节，以及结语。每个章节应该有一个吸引人的标题和 2-3 个需要讨论的关键点。",
    author_id: "user2",
    author_name: "作家456",
    author_avatar: "https://via.placeholder.com/40",
    category_id: "2",
    category_name: "写作",
    category_color: "#6366F1",
    tags: ["博客", "写作", "大纲"],
    likes_count: 95,
    saves_count: 62,
    created_at: "2026-04-21T13:48:05Z",
    updated_at: "2026-04-21T13:48:05Z",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blog%20article%20outline%20with%20topics%20and%20structure&image_size=landscape_4_3"
  },
  {
    id: "3",
    title: "JavaScript 调试器",
    description: "调试 JavaScript 代码并查找错误",
    content: "分析以下 JavaScript 代码，识别任何错误或潜在问题。解释代码的功能、问题所在，以及如何修复。\n\n```javascript\n[代码]\n```",
    author_id: "user3",
    author_name: "程序员789",
    author_avatar: "https://via.placeholder.com/40",
    category_id: "3",
    category_name: "编程",
    category_color: "#10B981",
    tags: ["javascript", "调试", "代码"],
    likes_count: 150,
    saves_count: 110,
    created_at: "2026-04-21T13:48:05Z",
    updated_at: "2026-04-21T13:48:05Z",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=javascript%20code%20debugging%20with%20errors%20highlighted&image_size=landscape_4_3"
  },
  {
    id: "4",
    title: "Logo 设计",
    description: "创建专业的 logo 设计",
    content: "为一个名为 [公司名称] 的 [业务类型] 公司设计一个 logo。logo 应采用 [风格] 风格，配色方案为 [配色方案]。它应该简洁、易记且可缩放。包含 2-3 种 logo 变体。",
    author_id: "user4",
    author_name: "设计师321",
    author_avatar: "https://via.placeholder.com/40",
    category_id: "4",
    category_name: "设计",
    category_color: "#F59E0B",
    tags: ["logo", "设计", "品牌"],
    likes_count: 88,
    saves_count: 55,
    created_at: "2026-04-21T13:48:05Z",
    updated_at: "2026-04-21T13:48:05Z",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20logo%20design%20with%20multiple%20variations&image_size=landscape_4_3"
  },
  {
    id: "5",
    title: "商业计划书",
    description: "创建全面的商业计划书",
    content: "为一家 [业务类型] 企业创建详细的商业计划书。包含执行摘要、市场分析、竞争分析、营销策略、运营计划、财务预测和附录。该计划应该专业且可执行。",
    author_id: "user5",
    author_name: "创业者654",
    author_avatar: "https://via.placeholder.com/40",
    category_id: "5",
    category_name: "商业",
    category_color: "#8B5CF6",
    tags: ["商业", "计划", "创业"],
    likes_count: 135,
    saves_count: 98,
    created_at: "2026-04-21T13:48:05Z",
    updated_at: "2026-04-21T13:48:05Z",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20plan%20document%20with%20charts%20and%20graphs&image_size=landscape_4_3"
  }
];

const mockCategories: Category[] = [
  { id: "1", name: "艺术", slug: "art", color: "#F43F5E" },
  { id: "2", name: "写作", slug: "writing", color: "#6366F1" },
  { id: "3", name: "编程", slug: "coding", color: "#10B981" },
  { id: "4", name: "设计", slug: "design", color: "#F59E0B" },
  { id: "5", name: "商业", slug: "business", color: "#8B5CF6" }
];

const mockComments: Comment[] = [
  {
    id: "1",
    prompt_id: "1",
    author_id: "user6",
    author_name: "评论者1",
    author_avatar: "https://via.placeholder.com/40",
    content: "这个提示词非常有用，我用它生成了很多优秀的肖像作品！",
    created_at: "2026-04-21T14:00:00Z"
  },
  {
    id: "2",
    prompt_id: "1",
    author_id: "user7",
    author_name: "评论者2",
    author_avatar: "https://via.placeholder.com/40",
    content: "感谢分享，这个提示词的结构很清晰，易于使用。",
    created_at: "2026-04-21T14:30:00Z"
  }
];

const mockUsers: User[] = [
  { id: "user1", name: "艺术家123", avatar: "https://via.placeholder.com/40" },
  { id: "user2", name: "作家456", avatar: "https://via.placeholder.com/40" },
  { id: "user3", name: "程序员789", avatar: "https://via.placeholder.com/40" }
];

// 提示词相关接口
export async function getPrompts(categoryId?: string) {
  if (useMockData) {
    // 使用模拟数据
    let filteredPrompts = mockPrompts;
    if (categoryId && categoryId !== 'all') {
      filteredPrompts = mockPrompts.filter(p => p.category_id === categoryId);
    }
    return filteredPrompts;
  }
  
  // 使用API数据
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

export async function getPromptById(id: string) {
  if (useMockData) {
    // 使用模拟数据
    return mockPrompts.find(p => p.id === id) || mockPrompts[0];
  }
  
  // 使用API数据
  return request({
    url: `/prompts/${id}`,
    method: 'get'
  });
}

export async function createPrompt(data: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'saves_count'>) {
  if (useMockData) {
    // 使用模拟数据
    const newPrompt: Prompt = {
      ...data,
      id: (mockPrompts.length + 1).toString(),
      likes_count: 0,
      saves_count: 0,
      created_at: new Date().toISOString()
    };
    mockPrompts.push(newPrompt);
    return newPrompt;
  }
  
  // 使用API数据
  return request({
    url: '/prompts',
    method: 'post',
    data: data
  });
}

export async function likePrompt(promptId: string) {
  if (useMockData) {
    // 使用模拟数据
    const prompt = mockPrompts.find(p => p.id === promptId);
    if (prompt) {
      prompt.likes_count += 1;
    }
    return { success: true };
  }
  
  // 使用API数据
  return request({
    url: `/prompts/${promptId}/like`,
    method: 'post'
  });
}

export async function savePrompt(promptId: string) {
  if (useMockData) {
    // 使用模拟数据
    const prompt = mockPrompts.find(p => p.id === promptId);
    if (prompt) {
      prompt.saves_count += 1;
    }
    return { success: true };
  }
  
  // 使用API数据
  return request({
    url: `/prompts/${promptId}/save`,
    method: 'post'
  });
}

// 分类相关接口
export async function getCategories() {
  if (useMockData) {
    // 使用模拟数据
    return mockCategories;
  }
  
  // 使用API数据
  return request({
    url: '/categories',
    method: 'get'
  });
}

// 评论相关接口
export async function getComments(promptId: string) {
  if (useMockData) {
    // 使用模拟数据
    return mockComments.filter(c => c.prompt_id === promptId);
  }
  
  // 使用API数据
  return request({
    url: `/prompts/${promptId}/comments`,
    method: 'get'
  });
}

export async function createComment(data: { prompt_id: string; content: string }) {
  if (useMockData) {
    // 使用模拟数据
    const newComment: Comment = {
      id: (mockComments.length + 1).toString(),
      prompt_id: data.prompt_id,
      author_id: "current_user",
      author_name: "当前用户",
      author_avatar: "https://via.placeholder.com/40",
      content: data.content,
      created_at: new Date().toISOString()
    };
    mockComments.push(newComment);
    return newComment;
  }
  
  // 使用API数据
  return request({
    url: `/prompts/${data.prompt_id}/comments`,
    method: 'post',
    data: {
      content: data.content
    }
  });
}

// 用户相关接口
export async function getUserById(userId: string) {
  if (useMockData) {
    // 使用模拟数据
    return mockUsers.find(u => u.id === userId) || mockUsers[0];
  }
  
  // 使用API数据
  return request({
    url: `/users/${userId}`,
    method: 'get'
  });
}

// 登录注册相关接口
export async function login(username?: string, password?: string, code?: string, uuid?: string) {
  if (useMockData) {
    // 使用模拟数据
    return {
      token: "mock_token",
      user: {
        id: "user1",
        name: username || "测试用户",
        avatar: "https://via.placeholder.com/40"
      }
    };
  }
  
  // 使用API数据
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

export async function register(data: any) {
  if (useMockData) {
    // 使用模拟数据
    return {
      success: true,
      message: "注册成功"
    };
  }
  
  // 使用API数据
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  });
}

export async function getCodeImg() {
  if (useMockData) {
    // 使用模拟数据
    return {
      uuid: "mock_uuid",
      img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    };
  }
  
  // 使用API数据
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  });
}

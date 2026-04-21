import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api/v1/prompt',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

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

// API service
class ApiService {
  // Prompts
  async getPrompts(categoryId?: string): Promise<Prompt[]> {
    try {
      const params: any = {};
      if (categoryId && categoryId !== 'all') {
        params.category_id = categoryId;
      }
      
      const response = await apiClient.get('/prompts', { params });
      return response as unknown as Prompt[];
    } catch (error) {
      console.error('获取提示词列表失败:', error);
      // 返回mock数据作为fallback
      return this.getMockPrompts(categoryId);
    }
  }

  async getPromptById(id: string): Promise<Prompt | null> {
    try {
      const response = await apiClient.get(`/prompts/${id}`);
      return response as unknown as Prompt;
    } catch (error) {
      console.error('获取提示词详情失败:', error);
      // 返回mock数据作为fallback
      return this.getMockPrompts().find(p => p.id === id) || null;
    }
  }

  async createPrompt(prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'saves_count'>): Promise<Prompt | null> {
    try {
      const response = await apiClient.post('/prompts', prompt);
      return response as unknown as Prompt;
    } catch (error) {
      console.error('创建提示词失败:', error);
      return null;
    }
  }

  async likePrompt(promptId: string): Promise<boolean> {
    try {
      await apiClient.post(`/prompts/${promptId}/like`);
      return true;
    } catch (error) {
      console.error('点赞提示词失败:', error);
      return false;
    }
  }

  async savePrompt(promptId: string): Promise<boolean> {
    try {
      await apiClient.post(`/prompts/${promptId}/save`);
      return true;
    } catch (error) {
      console.error('保存提示词失败:', error);
      return false;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get('/categories');
      return response as unknown as Category[];
    } catch (error) {
      console.error('获取分类列表失败:', error);
      // 返回mock数据作为fallback
      return this.getMockCategories();
    }
  }

  // Comments
  async getComments(promptId: string): Promise<Comment[]> {
    try {
      const response = await apiClient.get(`/prompts/${promptId}/comments`);
      return response as unknown as Comment[];
    } catch (error) {
      console.error('获取评论列表失败:', error);
      // 返回mock数据作为fallback
      return this.getMockComments(promptId);
    }
  }

  async createComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment | null> {
    try {
      const response = await apiClient.post(`/prompts/${comment.prompt_id}/comments`, {
        content: comment.content,
      });
      return response as unknown as Comment;
    } catch (error) {
      console.error('创建评论失败:', error);
      return null;
    }
  }

  // Users
  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response as unknown as User;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  // Mock data for fallback
  private getMockPrompts(categoryId?: string): Prompt[] {
    const mockPrompts: Prompt[] = [
      {
        id: '1',
        title: '逼真肖像',
        description: '创建具有细致特征的逼真人物肖像',
        content: '创建一幅 [年龄] 岁的 [性别] 逼真肖像，拥有 [发色] 头发和 [眼睛颜色] 眼睛。肖像应该采用 [风格] 风格，搭配 [光线] 光线。',
        author_id: 'user1',
        author_name: '艺术家123',
        author_avatar: 'https://via.placeholder.com/40',
        category_id: '1',
        category_name: '艺术',
        category_color: '#F43F5E',
        tags: ['肖像', '逼真', '人物', '艺术', '绘画'],
        likes_count: 120,
        saves_count: 85,
        created_at: '2026-04-01T10:00:00Z',
        updated_at: '2026-04-01T10:00:00Z',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=realistic%20portrait%20painting%20of%20a%20person%20with%20detailed%20features&image_size=landscape_4_3'
      },
      {
        id: '2',
        title: '博客文章大纲',
        description: '生成吸引人的博客文章大纲',
        content: '为一篇关于 [主题] 的博客文章创建详细大纲。大纲应包含引言、[数量] 个带有子要点的主要章节，以及结语。每个章节应该有一个吸引人的标题和 2-3 个需要讨论的关键点。',
        author_id: 'user2',
        author_name: '作家456',
        author_avatar: 'https://via.placeholder.com/40',
        category_id: '2',
        category_name: '写作',
        category_color: '#6366F1',
        tags: ['博客', '写作', '大纲'],
        likes_count: 95,
        saves_count: 62,
        created_at: '2026-04-02T14:30:00Z',
        updated_at: '2026-04-02T14:30:00Z',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blog%20article%20outline%20with%20topics%20and%20structure&image_size=landscape_4_3'
      },
      {
        id: '3',
        title: 'JavaScript 调试器',
        description: '调试 JavaScript 代码并查找错误',
        content: '分析以下 JavaScript 代码，识别任何错误或潜在问题。解释代码的功能、问题所在，以及如何修复。\n\n```javascript\n[代码]\n```',
        author_id: 'user3',
        author_name: '程序员789',
        author_avatar: 'https://via.placeholder.com/40',
        category_id: '3',
        category_name: '编程',
        category_color: '#10B981',
        tags: ['javascript', '调试', '代码'],
        likes_count: 150,
        saves_count: 110,
        created_at: '2026-04-03T09:15:00Z',
        updated_at: '2026-04-03T09:15:00Z',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=javascript%20code%20debugging%20with%20errors%20highlighted&image_size=landscape_4_3'
      },
      {
        id: '4',
        title: 'Logo 设计',
        description: '创建专业的 logo 设计',
        content: '为一个名为 [公司名称] 的 [业务类型] 公司设计一个 logo。logo 应采用 [风格] 风格，配色方案为 [配色方案]。它应该简洁、易记且可缩放。包含 2-3 种 logo 变体。',
        author_id: 'user4',
        author_name: '设计师321',
        author_avatar: 'https://via.placeholder.com/40',
        category_id: '4',
        category_name: '设计',
        category_color: '#F59E0B',
        tags: ['logo', '设计', '品牌'],
        likes_count: 88,
        saves_count: 55,
        created_at: '2026-04-04T11:45:00Z',
        updated_at: '2026-04-04T11:45:00Z',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20logo%20design%20with%20multiple%20variations&image_size=landscape_4_3'
      },
      {
        id: '5',
        title: '商业计划书',
        description: '创建全面的商业计划书',
        content: '为一家 [业务类型] 企业创建详细的商业计划书。包含执行摘要、市场分析、竞争分析、营销策略、运营计划、财务预测和附录。该计划应该专业且可执行。',
        author_id: 'user5',
        author_name: '创业者654',
        author_avatar: 'https://via.placeholder.com/40',
        category_id: '5',
        category_name: '商业',
        category_color: '#8B5CF6',
        tags: ['商业', '计划', '创业'],
        likes_count: 135,
        saves_count: 98,
        created_at: '2026-04-05T16:20:00Z',
        updated_at: '2026-04-05T16:20:00Z',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20plan%20document%20with%20charts%20and%20graphs&image_size=landscape_4_3'
      }
    ];

    if (categoryId && categoryId !== 'all') {
      return mockPrompts.filter(p => p.category_id === categoryId);
    }

    return mockPrompts;
  }

  private getMockCategories(): Category[] {
    return [
      { id: '1', name: '艺术', slug: 'art', color: '#F43F5E' },
      { id: '2', name: '写作', slug: 'writing', color: '#6366F1' },
      { id: '3', name: '编程', slug: 'coding', color: '#10B981' },
      { id: '4', name: '设计', slug: 'design', color: '#F59E0B' },
      { id: '5', name: '商业', slug: 'business', color: '#8B5CF6' }
    ];
  }

  private getMockComments(promptId: string): Comment[] {
    const mockComments: Record<string, Comment[]> = {
      '1': [
        {
          id: '1',
          prompt_id: '1',
          author_id: 'user2',
          author_name: '作家456',
          author_avatar: 'https://via.placeholder.com/40',
          content: '这个提示词真的很棒！我用它创作了一幅油画风格的 30 岁女性肖像，棕色头发，绿色眼睛。',
          created_at: '2026-04-02T14:30:00Z'
        },
        {
          id: '2',
          prompt_id: '1',
          author_id: 'user3',
          author_name: '程序员789',
          author_avatar: 'https://via.placeholder.com/40',
          content: '很棒的提示词！我添加了一些关于背景和构图的额外细节，让它更加具体。',
          created_at: '2026-04-03T09:15:00Z'
        }
      ],
      '2': [
        {
          id: '3',
          prompt_id: '2',
          author_id: 'user4',
          author_name: '设计师321',
          author_avatar: 'https://via.placeholder.com/40',
          content: '这个大纲模板非常实用，帮我节省了很多时间！',
          created_at: '2026-04-05T10:00:00Z'
        }
      ],
      '3': [
        {
          id: '4',
          prompt_id: '3',
          author_id: 'user5',
          author_name: '创业者654',
          author_avatar: 'https://via.placeholder.com/40',
          content: '作为一名前端开发者，这个调试提示词对我帮助很大！',
          created_at: '2026-04-06T14:20:00Z'
        }
      ],
      '4': [
        {
          id: '5',
          prompt_id: '4',
          author_id: 'user1',
          author_name: '艺术家123',
          author_avatar: 'https://via.placeholder.com/40',
          content: '这个 logo 设计提示词非常全面，包含了所有必要的元素。',
          created_at: '2026-04-07T09:30:00Z'
        }
      ],
      '5': [
        {
          id: '6',
          prompt_id: '5',
          author_id: 'user2',
          author_name: '作家456',
          author_avatar: 'https://via.placeholder.com/40',
          content: '这份商业计划书模板非常专业，帮我理清了很多思路。',
          created_at: '2026-04-08T16:45:00Z'
        }
      ]
    };

    return mockComments[promptId] || [];
  }
}

export const api = new ApiService();
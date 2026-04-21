-- 建表SQL

-- 用户表
CREATE TABLE prompt_users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE prompt_categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 提示词表
CREATE TABLE prompt_prompts (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_avatar VARCHAR(255),
  category_id VARCHAR(255) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  category_color VARCHAR(20) NOT NULL,
  tags JSONB NOT NULL,
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES prompt_users(id),
  FOREIGN KEY (category_id) REFERENCES prompt_categories(id)
);

-- 评论表
CREATE TABLE prompt_comments (
  id VARCHAR(255) PRIMARY KEY,
  prompt_id VARCHAR(255) NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_avatar VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prompt_id) REFERENCES prompt_prompts(id),
  FOREIGN KEY (author_id) REFERENCES prompt_users(id)
);

-- 点赞表
CREATE TABLE prompt_likes (
  id VARCHAR(255) PRIMARY KEY,
  prompt_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(prompt_id, user_id),
  FOREIGN KEY (prompt_id) REFERENCES prompt_prompts(id),
  FOREIGN KEY (user_id) REFERENCES prompt_users(id)
);

-- 保存表
CREATE TABLE prompt_saves (
  id VARCHAR(255) PRIMARY KEY,
  prompt_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(prompt_id, user_id),
  FOREIGN KEY (prompt_id) REFERENCES prompt_prompts(id),
  FOREIGN KEY (user_id) REFERENCES prompt_users(id)
);

-- 索引
CREATE INDEX idx_prompt_prompts_category_id ON prompt_prompts(category_id);
CREATE INDEX idx_prompt_prompts_author_id ON prompt_prompts(author_id);
CREATE INDEX idx_prompt_comments_prompt_id ON prompt_comments(prompt_id);
CREATE INDEX idx_prompt_likes_prompt_id ON prompt_likes(prompt_id);
CREATE INDEX idx_prompt_likes_user_id ON prompt_likes(user_id);
CREATE INDEX idx_prompt_saves_prompt_id ON prompt_saves(prompt_id);
CREATE INDEX idx_prompt_saves_user_id ON prompt_saves(user_id);

-- 函数：点赞提示词
CREATE OR REPLACE FUNCTION like_prompt(prompt_id_param VARCHAR(255))
RETURNS INTEGER AS $$
BEGIN
  UPDATE prompt_prompts
  SET likes_count = likes_count + 1
  WHERE id = prompt_id_param;
  
  RETURN (SELECT likes_count FROM prompt_prompts WHERE id = prompt_id_param);
END;
$$ LANGUAGE plpgsql;

-- 函数：保存提示词
CREATE OR REPLACE FUNCTION save_prompt(prompt_id_param VARCHAR(255))
RETURNS INTEGER AS $$
BEGIN
  UPDATE prompt_prompts
  SET saves_count = saves_count + 1
  WHERE id = prompt_id_param;
  
  RETURN (SELECT saves_count FROM prompt_prompts WHERE id = prompt_id_param);
END;
$$ LANGUAGE plpgsql;

-- 初始数据
INSERT INTO prompt_users (id, name, avatar, email) VALUES
('user1', '艺术家123', 'https://via.placeholder.com/40', 'artist123@example.com'),
('user2', '作家456', 'https://via.placeholder.com/40', 'writer456@example.com'),
('user3', '程序员789', 'https://via.placeholder.com/40', 'programmer789@example.com'),
('user4', '设计师321', 'https://via.placeholder.com/40', 'designer321@example.com'),
('user5', '创业者654', 'https://via.placeholder.com/40', 'entrepreneur654@example.com');

INSERT INTO prompt_categories (id, name, slug, color) VALUES
('1', '艺术', 'art', '#F43F5E'),
('2', '写作', 'writing', '#6366F1'),
('3', '编程', 'coding', '#10B981'),
('4', '设计', 'design', '#F59E0B'),
('5', '商业', 'business', '#8B5CF6');

INSERT INTO prompt_prompts (id, title, description, content, author_id, author_name, author_avatar, category_id, category_name, category_color, tags, likes_count, saves_count, image) VALUES
('1', '逼真肖像', '创建具有细致特征的逼真人物肖像', '创建一幅 [年龄] 岁的 [性别] 逼真肖像，拥有 [发色] 头发和 [眼睛颜色] 眼睛。肖像应该采用 [风格] 风格，搭配 [光线] 光线。', 'user1', '艺术家123', 'https://via.placeholder.com/40', '1', '艺术', '#F43F5E', '["肖像", "逼真", "人物", "艺术", "绘画"]', 120, 85, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=realistic%20portrait%20painting%20of%20a%20person%20with%20detailed%20features&image_size=landscape_4_3'),
('2', '博客文章大纲', '生成吸引人的博客文章大纲', '为一篇关于 [主题] 的博客文章创建详细大纲。大纲应包含引言、[数量] 个带有子要点的主要章节，以及结语。每个章节应该有一个吸引人的标题和 2-3 个需要讨论的关键点。', 'user2', '作家456', 'https://via.placeholder.com/40', '2', '写作', '#6366F1', '["博客", "写作", "大纲"]', 95, 62, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blog%20article%20outline%20with%20topics%20and%20structure&image_size=landscape_4_3'),
('3', 'JavaScript 调试器', '调试 JavaScript 代码并查找错误', '分析以下 JavaScript 代码，识别任何错误或潜在问题。解释代码的功能、问题所在，以及如何修复。\n\n```javascript\n[代码]\n```', 'user3', '程序员789', 'https://via.placeholder.com/40', '3', '编程', '#10B981', '["javascript", "调试", "代码"]', 150, 110, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=javascript%20code%20debugging%20with%20errors%20highlighted&image_size=landscape_4_3'),
('4', 'Logo 设计', '创建专业的 logo 设计', '为一个名为 [公司名称] 的 [业务类型] 公司设计一个 logo。logo 应采用 [风格] 风格，配色方案为 [配色方案]。它应该简洁、易记且可缩放。包含 2-3 种 logo 变体。', 'user4', '设计师321', 'https://via.placeholder.com/40', '4', '设计', '#F59E0B', '["logo", "设计", "品牌"]', 88, 55, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20logo%20design%20with%20multiple%20variations&image_size=landscape_4_3'),
('5', '商业计划书', '创建全面的商业计划书', '为一家 [业务类型] 企业创建详细的商业计划书。包含执行摘要、市场分析、竞争分析、营销策略、运营计划、财务预测和附录。该计划应该专业且可执行。', 'user5', '创业者654', 'https://via.placeholder.com/40', '5', '商业', '#8B5CF6', '["商业", "计划", "创业"]', 135, 98, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20plan%20document%20with%20charts%20and%20graphs&image_size=landscape_4_3');

INSERT INTO prompt_comments (id, prompt_id, author_id, author_name, author_avatar, content) VALUES
('1', '1', 'user2', '作家456', 'https://via.placeholder.com/40', '这个提示词真的很棒！我用它创作了一幅油画风格的 30 岁女性肖像，棕色头发，绿色眼睛。'),
('2', '1', 'user3', '程序员789', 'https://via.placeholder.com/40', '很棒的提示词！我添加了一些关于背景和构图的额外细节，让它更加具体。'),
('3', '2', 'user4', '设计师321', 'https://via.placeholder.com/40', '这个大纲模板非常实用，帮我节省了很多时间！'),
('4', '3', 'user5', '创业者654', 'https://via.placeholder.com/40', '作为一名前端开发者，这个调试提示词对我帮助很大！'),
('5', '4', 'user1', '艺术家123', 'https://via.placeholder.com/40', '这个 logo 设计提示词非常全面，包含了所有必要的元素。'),
('6', '5', 'user2', '作家456', 'https://via.placeholder.com/40', '这份商业计划书模板非常专业，帮我理清了很多思路。');
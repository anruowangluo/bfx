# API 接口文档

## 1. 基础信息

- **API 基础路径**: `/api/v1`
- **认证方式**: JWT Token (可选)
- **响应格式**: JSON

## 2. 接口列表

### 2.1 提示词 (Prompts)

#### 2.1.1 获取提示词列表

- **URL**: `/prompts`
- **方法**: `GET`
- **参数**:
  - `category_id` (可选): 分类ID，不传则获取所有分类
  - `search` (可选): 搜索关键词
  - `page` (可选): 页码，默认1
  - `limit` (可选): 每页数量，默认10

- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "1",
        "title": "逼真肖像",
        "description": "创建具有细致特征的逼真人物肖像",
        "content": "创建一幅 [年龄] 岁的 [性别] 逼真肖像，拥有 [发色] 头发和 [眼睛颜色] 眼睛。肖像应该采用 [风格] 风格，搭配 [光线] 光线。",
        "author_id": "user1",
        "author_name": "艺术家123",
        "author_avatar": "https://via.placeholder.com/40",
        "category_id": "1",
        "category_name": "艺术",
        "category_color": "#F43F5E",
        "tags": ["肖像", "逼真", "人物"],
        "likes_count": 120,
        "saves_count": 85,
        "created_at": "2026-04-01T10:00:00Z",
        "updated_at": "2026-04-01T10:00:00Z",
        "image": "https://example.com/image.jpg"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10
  }
  ```

#### 2.1.2 获取提示词详情

- **URL**: `/prompts/{id}`
- **方法**: `GET`
- **参数**:
  - `id`: 提示词ID

- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "1",
      "title": "逼真肖像",
      "description": "创建具有细致特征的逼真人物肖像",
      "content": "创建一幅 [年龄] 岁的 [性别] 逼真肖像，拥有 [发色] 头发和 [眼睛颜色] 眼睛。肖像应该采用 [风格] 风格，搭配 [光线] 光线。",
      "author_id": "user1",
      "author_name": "艺术家123",
      "author_avatar": "https://via.placeholder.com/40",
      "category_id": "1",
      "category_name": "艺术",
      "category_color": "#F43F5E",
      "tags": ["肖像", "逼真", "人物"],
      "likes_count": 120,
      "saves_count": 85,
      "created_at": "2026-04-01T10:00:00Z",
      "updated_at": "2026-04-01T10:00:00Z",
      "image": "https://example.com/image.jpg"
    }
  }
  ```

#### 2.1.3 创建提示词

- **URL**: `/prompts`
- **方法**: `POST`
- **参数**:
  - `title`: 标题 (必填)
  - `description`: 描述 (必填)
  - `content`: 内容 (必填)
  - `category_id`: 分类ID (必填)
  - `tags`: 标签数组 (必填)
  - `image`: 图片URL (可选)

- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "6",
      "title": "新提示词",
      "description": "新提示词描述",
      "content": "新提示词内容",
      "author_id": "current-user",
      "author_name": "当前用户",
      "category_id": "1",
      "category_name": "艺术",
      "category_color": "#F43F5E",
      "tags": ["新标签"],
      "likes_count": 0,
      "saves_count": 0,
      "created_at": "2026-04-21T10:00:00Z",
      "updated_at": "2026-04-21T10:00:00Z",
      "image": "https://example.com/image.jpg"
    }
  }
  ```

#### 2.1.4 点赞提示词

- **URL**: `/prompts/{id}/like`
- **方法**: `POST`
- **参数**:
  - `id`: 提示词ID

- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "likes_count": 121
    }
  }
  ```

#### 2.1.5 保存提示词

- **URL**: `/prompts/{id}/save`
- **方法**: `POST`
- **参数**:
  - `id`: 提示词ID

- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "saves_count": 86
    }
  }
  ```

### 2.2 分类 (Categories)

#### 2.2.1 获取分类列表

- **URL**: `/categories`
- **方法**: `GET`

- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "1",
        "name": "艺术",
        "slug": "art",
        "color": "#F43F5E"
      }
    ]
  }
  ```

### 2.3 评论 (Comments)

#### 2.3.1 获取提示词评论

- **URL**: `/prompts/{id}/comments`
- **方法**: `GET`
- **参数**:
  - `id`: 提示词ID
  - `page` (可选): 页码，默认1
  - `limit` (可选): 每页数量，默认20

- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "1",
        "prompt_id": "1",
        "author_id": "user2",
        "author_name": "作家456",
        "author_avatar": "https://via.placeholder.com/40",
        "content": "这个提示词真的很棒！",
        "created_at": "2026-04-02T14:30:00Z"
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 20
  }
  ```

#### 2.3.2 添加评论

- **URL**: `/prompts/{id}/comments`
- **方法**: `POST`
- **参数**:
  - `id`: 提示词ID
  - `content`: 评论内容 (必填)

- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "7",
      "prompt_id": "1",
      "author_id": "current-user",
      "author_name": "当前用户",
      "author_avatar": "https://via.placeholder.com/40",
      "content": "新评论内容",
      "created_at": "2026-04-21T10:00:00Z"
    }
  }
  ```

### 2.4 用户 (Users)

#### 2.4.1 获取用户信息

- **URL**: `/users/{id}`
- **方法**: `GET`
- **参数**:
  - `id`: 用户ID

- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user1",
      "name": "艺术家123",
      "avatar": "https://via.placeholder.com/40",
      "email": "artist123@example.com"
    }
  }
  ```

## 3. 错误响应

所有API接口在失败时返回统一的错误格式：

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "错误信息"
  }
}
```

常见错误代码：
- 400: 请求参数错误
- 401: 未授权
- 404: 资源不存在
- 500: 服务器内部错误
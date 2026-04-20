import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Mock data for prompts
const mockPrompts = [
  {
    id: '1',
    title: '逼真肖像',
    description: '创建具有细致特征的逼真人物肖像',
    content: '创建一幅 [年龄] 岁的 [性别] 逼真肖像，拥有 [发色] 头发和 [眼睛颜色] 眼睛。肖像应该采用 [风格] 风格，搭配 [光线] 光线。',
    author_id: 'user1',
    author_name: '艺术家123',
    category_id: '1',
    category_name: '艺术',
    category_color: '#F43F5E',
    tags: ['肖像', '逼真', '人物'],
    likes_count: 120,
    saves_count: 85,
    created_at: '2026-04-01T10:00:00Z',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=realistic%20portrait%20painting%20of%20a%20person%20with%20detailed%20features&image_size=landscape_4_3'
  },
  {
    id: '2',
    title: '博客文章大纲',
    description: '生成吸引人的博客文章大纲',
    content: '为一篇关于 [主题] 的博客文章创建详细大纲。大纲应包含引言、[数量] 个带有子要点的主要章节，以及结语。每个章节应该有一个吸引人的标题和 2-3 个需要讨论的关键点。',
    author_id: 'user2',
    author_name: '作家456',
    category_id: '2',
    category_name: '写作',
    category_color: '#6366F1',
    tags: ['博客', '写作', '大纲'],
    likes_count: 95,
    saves_count: 62,
    created_at: '2026-04-02T14:30:00Z',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blog%20article%20outline%20with%20topics%20and%20structure&image_size=landscape_4_3'
  },
  {
    id: '3',
    title: 'JavaScript 调试器',
    description: '调试 JavaScript 代码并查找错误',
    content: '分析以下 JavaScript 代码，识别任何错误或潜在问题。解释代码的功能、问题所在，以及如何修复。\n\n```javascript\n[代码]\n```',
    author_id: 'user3',
    author_name: '程序员789',
    category_id: '3',
    category_name: '编程',
    category_color: '#10B981',
    tags: ['javascript', '调试', '代码'],
    likes_count: 150,
    saves_count: 110,
    created_at: '2026-04-03T09:15:00Z',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=javascript%20code%20debugging%20with%20errors%20highlighted&image_size=landscape_4_3'
  },
  {
    id: '4',
    title: 'Logo 设计',
    description: '创建专业的 logo 设计',
    content: '为一个名为 [公司名称] 的 [业务类型] 公司设计一个 logo。logo 应采用 [风格] 风格，配色方案为 [配色方案]。它应该简洁、易记且可缩放。包含 2-3 种 logo 变体。',
    author_id: 'user4',
    author_name: '设计师321',
    category_id: '4',
    category_name: '设计',
    category_color: '#F59E0B',
    tags: ['logo', '设计', '品牌'],
    likes_count: 88,
    saves_count: 55,
    created_at: '2026-04-04T11:45:00Z',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20logo%20design%20with%20multiple%20variations&image_size=landscape_4_3'
  },
  {
    id: '5',
    title: '商业计划书',
    description: '创建全面的商业计划书',
    content: '为一家 [业务类型] 企业创建详细的商业计划书。包含执行摘要、市场分析、竞争分析、营销策略、运营计划、财务预测和附录。该计划应该专业且可执行。',
    author_id: 'user5',
    author_name: '创业者654',
    category_id: '5',
    category_name: '商业',
    category_color: '#8B5CF6',
    tags: ['商业', '计划', '创业'],
    likes_count: 135,
    saves_count: 98,
    created_at: '2026-04-05T16:20:00Z',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20plan%20document%20with%20charts%20and%20graphs&image_size=landscape_4_3'
  }
]

// Mock data for categories
const mockCategories = [
  { id: '1', name: '艺术', slug: 'art', color: '#F43F5E' },
  { id: '2', name: '写作', slug: 'writing', color: '#6366F1' },
  { id: '3', name: '编程', slug: 'coding', color: '#10B981' },
  { id: '4', name: '设计', slug: 'design', color: '#F59E0B' },
  { id: '5', name: '商业', slug: 'business', color: '#8B5CF6' }
]

const Home = () => {
  const [prompts, setPrompts] = useState(mockPrompts)
  const [categories, setCategories] = useState(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter prompts based on selected category and search term
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory = selectedCategory === 'all' || prompt.category_id === selectedCategory
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Categories */}
      <div className="mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category.id ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              style={{ backgroundColor: selectedCategory === category.id ? category.color : 'transparent' }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts List */}
      <div className="grid grid-cols-2 gap-3">
        {filteredPrompts.map((prompt) => (
          <Link
            key={prompt.id}
            to={`/prompt/${prompt.id}`}
            className="block group"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 active:scale-[0.98] h-full flex flex-col">
              {prompt.image && (
                <div className="w-full h-32 overflow-hidden">
                  <img 
                    src={prompt.image} 
                    alt={prompt.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-3 flex-grow">
                <div className="flex items-center mb-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${prompt.category_color}20`, color: prompt.category_color }}
                  >
                    {prompt.category_name}
                  </span>
                  <div className="ml-auto flex items-center text-gray-500 text-xs">
                    <span className="mr-1.5">❤️ {prompt.likes_count}</span>
                    <span>💾 {prompt.saves_count}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {prompt.title}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-2 text-xs">
                  {prompt.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {prompt.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                      +{prompt.tags.length - 2}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="line-clamp-1">作者：{prompt.author_name}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No results message */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">未找到提示词</p>
          <p className="text-gray-400 text-sm">请尝试其他搜索或分类</p>
        </div>
      )}
    </div>
  )
}

export default Home
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Mock data for user
const mockUser = {
  id: 'user1',
  name: '当前用户',
  email: 'user@example.com',
  avatar: 'https://via.placeholder.com/100'
}

// Mock data for user's created prompts
const mockCreatedPrompts = [
  {
    id: '1',
    title: '逼真肖像',
    description: '创建具有细致特征的逼真人物肖像',
    category_id: '1',
    category_name: '艺术',
    category_color: '#F43F5E',
    likes_count: 120,
    saves_count: 85,
    created_at: '2026-04-01T10:00:00Z'
  },
  {
    id: '2',
    title: '博客文章大纲',
    description: '生成吸引人的博客文章大纲',
    category_id: '2',
    category_name: '写作',
    category_color: '#6366F1',
    likes_count: 95,
    saves_count: 62,
    created_at: '2026-04-02T14:30:00Z'
  }
]

// Mock data for user's saved prompts
const mockSavedPrompts = [
  {
    id: '3',
    title: 'JavaScript 调试器',
    description: '调试 JavaScript 代码并查找错误',
    category_id: '3',
    category_name: '编程',
    category_color: '#10B981',
    likes_count: 150,
    saves_count: 110,
    created_at: '2026-04-03T09:15:00Z'
  },
  {
    id: '4',
    title: 'Logo 设计',
    description: '创建专业的 logo 设计',
    category_id: '4',
    category_name: '设计',
    category_color: '#F59E0B',
    likes_count: 88,
    saves_count: 55,
    created_at: '2026-04-04T11:45:00Z'
  },
  {
    id: '5',
    title: '商业计划书',
    description: '创建全面的商业计划书',
    category_id: '5',
    category_name: '商业',
    category_color: '#8B5CF6',
    likes_count: 135,
    saves_count: 98,
    created_at: '2026-04-05T16:20:00Z'
  }
]

const Profile = () => {
  const [activeTab, setActiveTab] = useState('created')
  const [user] = useState(mockUser)
  const [createdPrompts] = useState(mockCreatedPrompts)
  const [savedPrompts] = useState(mockSavedPrompts)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* User profile header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex-shrink-0 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
          <div className="w-full">
            <h1 className="text-xl font-bold mb-1">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold">{createdPrompts.length}</p>
                <p className="text-sm text-gray-600">提示词</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{savedPrompts.length}</p>
                <p className="text-sm text-gray-600">已收藏</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('created')}
            className={`flex-1 py-4 text-center font-medium transition-all ${activeTab === 'created' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            创建的提示词
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-4 text-center font-medium transition-all ${activeTab === 'saved' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            收藏的提示词
          </button>
        </div>

        {/* Tab content */}
        <div className="p-5">
          {/* Created prompts */}
          {activeTab === 'created' && (
            <div>
              {createdPrompts.length > 0 ? (
                <div className="space-y-4">
                  {createdPrompts.map(prompt => (
                    <Link
                      key={prompt.id}
                      to={`/prompt/${prompt.id}`}
                      className="block group"
                    >
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${prompt.category_color}20`, color: prompt.category_color }}
                          >
                            {prompt.category_name}
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <span className="mr-3">❤️ {prompt.likes_count}</span>
                            <span>💾 {prompt.saves_count}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                          {prompt.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {prompt.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          创建于 {new Date(prompt.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">您还没有创建任何提示词</p>
                  <Link
                    to="/create"
                    className="inline-block px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    创建您的第一个提示词
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Saved prompts */}
          {activeTab === 'saved' && (
            <div>
              {savedPrompts.length > 0 ? (
                <div className="space-y-4">
                  {savedPrompts.map(prompt => (
                    <Link
                      key={prompt.id}
                      to={`/prompt/${prompt.id}`}
                      className="block group"
                    >
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${prompt.category_color}20`, color: prompt.category_color }}
                          >
                            {prompt.category_name}
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <span className="mr-3">❤️ {prompt.likes_count}</span>
                            <span>💾 {prompt.saves_count}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                          {prompt.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {prompt.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          收藏于 {new Date(prompt.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">您还没有收藏任何提示词</p>
                  <Link
                    to="/"
                    className="inline-block px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    浏览提示词
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
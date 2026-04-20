import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Mock data for categories
const mockCategories = [
  { id: '1', name: '艺术', slug: 'art', color: '#F43F5E' },
  { id: '2', name: '写作', slug: 'writing', color: '#6366F1' },
  { id: '3', name: '编程', slug: 'coding', color: '#10B981' },
  { id: '4', name: '设计', slug: 'design', color: '#F59E0B' },
  { id: '5', name: '商业', slug: 'business', color: '#8B5CF6' }
]

const CreatePrompt = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category_id: '',
    tags: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = '请输入标题'
    }
    if (!formData.content.trim()) {
      newErrors.content = '请输入提示词内容'
    }
    if (!formData.category_id) {
      newErrors.category_id = '请选择分类'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        // In a real app, you would call an API to create the prompt
        // For now, we'll just simulate a successful submission
        console.log('创建提示词:', formData)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Navigate back to home page
        navigate('/')
      } catch (error) {
        console.error('创建提示词错误:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-6">创建新提示词</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          {/* Title */}
          <div className="mb-5">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              标题
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
              placeholder="请输入提示词标题"
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-5">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              描述
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              rows={4}
              placeholder="描述您的提示词功能"
            />
          </div>

          {/* Content */}
          <div className="mb-5">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              提示词内容
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
              rows={6}
              placeholder="在此编写您的提示词。使用 [占位符] 表示变量。"
            />
            {errors.content && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.content}</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-5">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
            >
              <option value="">请选择分类</option>
              {mockCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.category_id}</p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              标签（用逗号分隔）
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="例如：肖像, 逼真, 艺术"
            />
          </div>

          {/* Submit button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? '创建中...' : '创建提示词'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePrompt
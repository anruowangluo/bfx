import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Mock data for prompts
const mockPrompts = [
  {
    id: '1',
    title: 'Realistic Portraits',
    description: 'Create realistic human portraits with detailed features',
    content: 'Create a realistic portrait of a [age] year old [gender] with [hair color] hair and [eye color] eyes. The portrait should be in [style] style with [lighting] lighting.',
    author_id: 'user1',
    author_name: 'Artist123',
    category_id: '1',
    category_name: 'Art',
    category_color: '#F43F5E',
    tags: ['portrait', 'realistic', 'human'],
    likes_count: 120,
    saves_count: 85,
    created_at: '2026-04-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Blog Post Outline',
    description: 'Generate outlines for engaging blog posts',
    content: 'Create a detailed outline for a blog post about [topic]. The outline should include an introduction, [number] main sections with subpoints, and a conclusion. Each section should have a catchy heading and 2-3 key points to discuss.',
    author_id: 'user2',
    author_name: 'Writer456',
    category_id: '2',
    category_name: 'Writing',
    category_color: '#6366F1',
    tags: ['blog', 'writing', 'outline'],
    likes_count: 95,
    saves_count: 62,
    created_at: '2026-04-02T14:30:00Z'
  },
  {
    id: '3',
    title: 'JavaScript Debugger',
    description: 'Debug JavaScript code and find errors',
    content: 'Analyze the following JavaScript code and identify any errors or potential issues. Explain what the code is supposed to do, whats going wrong, and how to fix it.\n\n```javascript\n[code]\n```',
    author_id: 'user3',
    author_name: 'Coder789',
    category_id: '3',
    category_name: 'Coding',
    category_color: '#10B981',
    tags: ['javascript', 'debugging', 'code'],
    likes_count: 150,
    saves_count: 110,
    created_at: '2026-04-03T09:15:00Z'
  },
  {
    id: '4',
    title: 'Logo Design',
    description: 'Create professional logo designs',
    content: 'Design a logo for a [type of business] called [business name]. The logo should be [style] style, with [color scheme] colors. It should be simple, memorable, and scalable. Include 2-3 variations of the logo.',
    author_id: 'user4',
    author_name: 'Designer321',
    category_id: '4',
    category_name: 'Design',
    category_color: '#F59E0B',
    tags: ['logo', 'design', 'branding'],
    likes_count: 88,
    saves_count: 55,
    created_at: '2026-04-04T11:45:00Z'
  },
  {
    id: '5',
    title: 'Business Plan',
    description: 'Create comprehensive business plans',
    content: 'Create a detailed business plan for a [type of business] business. Include sections for executive summary, market analysis, competitive analysis, marketing strategy, operational plan, financial projections, and appendix. The plan should be professional and actionable.',
    author_id: 'user5',
    author_name: 'Entrepreneur654',
    category_id: '5',
    category_name: 'Business',
    category_color: '#8B5CF6',
    tags: ['business', 'plan', 'startup'],
    likes_count: 135,
    saves_count: 98,
    created_at: '2026-04-05T16:20:00Z'
  }
]

// Mock data for categories
const mockCategories = [
  { id: '1', name: 'Art', slug: 'art', color: '#F43F5E' },
  { id: '2', name: 'Writing', slug: 'writing', color: '#6366F1' },
  { id: '3', name: 'Coding', slug: 'coding', color: '#10B981' },
  { id: '4', name: 'Design', slug: 'design', color: '#F59E0B' },
  { id: '5', name: 'Business', slug: 'business', color: '#8B5CF6' }
]

const Home = () => {
  const [prompts, setPrompts] = useState(mockPrompts)
  const [categories, setCategories] = useState(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter prompts based on selected category and search term
  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'all' || prompt.category_id === selectedCategory
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search prompts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              style={{ backgroundColor: selectedCategory === category.id ? category.color : 'transparent' }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map(prompt => (
          <Link
            key={prompt.id}
            to={`/prompt/${prompt.id}`}
            className="block group"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-md">
              <div
                className="h-2"
                style={{ backgroundColor: prompt.category_color }}
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${prompt.category_color}20`, color: prompt.category_color }}
                  >
                    {prompt.category_name}
                  </span>
                  <div className="ml-auto flex items-center text-gray-500 text-sm">
                    <span className="mr-3">❤️ {prompt.likes_count}</span>
                    <span>💾 {prompt.saves_count}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {prompt.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {prompt.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      +{prompt.tags.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>by {prompt.author_name}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No results message */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No prompts found. Try a different search or category.</p>
        </div>
      )}
    </div>
  )
}

export default Home
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { getPrompts, getCategories, Prompt, Category } from '../services/api'

const Home = () => {
  const location = useLocation()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef(0)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [promptsData, categoriesData] = await Promise.all([
          getPrompts(),
          getCategories()
        ])
        setPrompts(promptsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch prompts when category changes
  useEffect(() => {
    const fetchPromptsByCategory = async () => {
      setLoading(true)
      try {
        const promptsData = await getPrompts(selectedCategory)
        setPrompts(promptsData)
      } catch (error) {
        console.error('Error fetching prompts by category:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromptsByCategory()
  }, [selectedCategory])

  // Filter prompts based on selected category and search term
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory = selectedCategory === 'all' || prompt.category_id === selectedCategory
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // 保存滚动位置
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        scrollPositionRef.current = scrollRef.current.scrollTop
        // 同时保存到sessionStorage，确保页面刷新后也能恢复
        sessionStorage.setItem('homeScrollPosition', scrollPositionRef.current.toString())
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // 恢复滚动位置
  useEffect(() => {
    if (scrollRef.current && location.pathname === '/') {
      // 从sessionStorage中获取保存的滚动位置
      const savedPosition = sessionStorage.getItem('homeScrollPosition')
      const position = savedPosition ? parseInt(savedPosition, 10) : 0
      
      // 直接设置滚动位置，不使用动画效果
      if (scrollRef.current) {
        scrollRef.current.scrollTop = position
      }
    }
  }, [location.pathname])

  return (
    <div className="container mx-auto px-4 py-4" ref={scrollRef} style={{ maxHeight: 'calc(100vh - 10rem)', overflowY: 'auto' }}>
      {/* Categories */}
      <div className="mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 mb-2">加载中...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default Home
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ArrowLeft, User, LogIn } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    // 检查用户登录状态
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsLoggedIn(true)
        setUser(session.user)
      }
    }
    checkAuth()
  }, [])

  // 根据当前路由判断显示什么内容
  const isHomePage = location.pathname === '/'
  const isPromptDetailPage = location.pathname.startsWith('/prompt')
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register'
  const isCreatePage = location.pathname === '/create'
  const isProfilePage = location.pathname === '/profile'
  const isTabbarPage = isHomePage || isCreatePage || isProfilePage

  const getPageTitle = () => {
    if (isHomePage) return '提示词分享'
    if (isPromptDetailPage) return '提示词详情'
    if (isCreatePage) return '创建提示词'
    if (isProfilePage) return '我的'
    if (location.pathname === '/login') return '登录'
    if (location.pathname === '/register') return '注册'
    return '提示词分享'
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 safe-area-top">
      <div className="flex items-center h-14 px-4">
        {/* 左侧 - 返回按钮或居中显示的内容 */}
        <div className="flex items-center flex-1 justify-center">
          {!isTabbarPage ? (
            <div className="w-full flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          ) : isHomePage ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-lg font-bold text-gray-900">提示词分享</h1>
            </div>
          ) : (
            <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
          )}
        </div>

        {/* 右侧 - 操作按钮 */}
        <div className="flex items-center gap-2 absolute right-4">
          {isHomePage && (
            <>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <LogIn className="h-5 w-5 text-gray-700" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* 搜索栏 - 只在首页显示 */}
      {isHomePage && showSearch && (
        <div className="px-4 pb-3 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索提示词..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
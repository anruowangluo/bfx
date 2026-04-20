import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, User, LogIn, LogOut, Plus, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          提示词分享
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索提示词..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Link to="/create" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4" />
            创建
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2">
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-600" />
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
                退出登录
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600">
              <LogIn className="h-5 w-5" />
              登录
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索提示词..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <Link
              to="/create"
              className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              创建提示词
            </Link>
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="User avatar" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-600" />
                    )}
                    <span className="font-medium">个人中心</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span>退出登录</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogIn className="h-5 w-5 text-gray-600" />
                    <span>登录</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span>注册</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
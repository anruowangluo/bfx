import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useHistory } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Home from './pages/Home'
import PromptDetail from './pages/PromptDetail'
import CreatePrompt from './pages/CreatePrompt'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Tabbar from './components/Tabbar'

const AppContent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const hideTabbar = location.pathname === '/login' || location.pathname === '/register'
  const [homeScrollPosition, setHomeScrollPosition] = useState(0)
  const [previousPath, setPreviousPath] = useState('')

  // 监听路由变化，保存和恢复滚动位置
  useEffect(() => {
    // 当从首页进入详情页时，保存首页的滚动位置并滚动到顶部
    if (previousPath === '/' && location.pathname.startsWith('/prompt/')) {
      setHomeScrollPosition(window.scrollY)
      window.scrollTo(0, 0) // 进入详情页时滚动到顶部
    }
    // 当从详情页返回首页时，恢复之前的滚动位置
    else if (previousPath.startsWith('/prompt/') && location.pathname === '/') {
      setTimeout(() => {
        window.scrollTo(0, homeScrollPosition)
      }, 100)
    }
    // 其他路由切换时滚动到顶部
    else if (!location.pathname.startsWith('/prompt/')) {
      window.scrollTo(0, 0)
    }
    
    // 更新前一个路径
    setPreviousPath(location.pathname)
  }, [location.pathname, previousPath, homeScrollPosition])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className={`flex-grow ${!hideTabbar ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prompt/:id" element={<PromptDetail />} />
          <Route path="/create" element={<CreatePrompt />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {!hideTabbar && <Tabbar />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
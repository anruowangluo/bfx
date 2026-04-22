import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { KeepAlive, AliveScope } from 'react-activation'
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
  const hideTabbar = location.pathname === '/login' || location.pathname === '/register'

  // 当路由切换到非首页和非详情页时，滚动到顶部
  useEffect(() => {
    if (!location.pathname.startsWith('/prompt/') && location.pathname !== '/') {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className={`flex-grow ${!hideTabbar ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/" element={
            <KeepAlive name="home" saveScrollPosition={true}>
              <Home />
            </KeepAlive>
          } />
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
      <AliveScope>
        <AppContent />
      </AliveScope>
    </Router>
  )
}

export default App
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, User } from 'lucide-react'

const Tabbar = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.pathname)

  const tabs = [
    {
      path: '/',
      icon: Home,
      label: '首页'
    },
    {
      path: '/create',
      icon: Plus,
      label: '创建'
    },
    {
      path: '/profile',
      icon: User,
      label: '我的'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || 
                          (tab.path === '/' && location.pathname.startsWith('/prompt'))
          return (
            <Link
              key={tab.path}
              to={tab.path}
              onClick={() => setActiveTab(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className={`h-6 w-6 mb-1 ${isActive ? 'fill-indigo-100' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Tabbar
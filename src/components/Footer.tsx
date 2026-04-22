import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              提示词分享
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              分享和发现 AI 提示词
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">
              首页
            </Link>
            <Link to="/create" className="text-sm text-gray-600 hover:text-indigo-600">
              创建
            </Link>
            <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600">
              登录
            </Link>
            <Link to="/register" className="text-sm text-gray-600 hover:text-indigo-600">
              注册
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          © 2026 提示词分享. 保留所有权利.
        </div>
      </div>
    </footer>
  )
}

export default Footer
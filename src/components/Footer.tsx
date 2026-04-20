import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              PromptShare
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              Share and discover AI prompts
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">
              Home
            </Link>
            <Link to="/create" className="text-sm text-gray-600 hover:text-indigo-600">
              Create
            </Link>
            <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600">
              Login
            </Link>
            <Link to="/register" className="text-sm text-gray-600 hover:text-indigo-600">
              Register
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          © 2026 PromptShare. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Copy, Heart, Save, Share2, MessageCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Mock data for the prompt
const mockPrompt = {
  id: '1',
  title: '逼真肖像',
  description: '创建具有细致特征的逼真人物肖像',
  content: '创建一幅 [年龄] 岁的 [性别] 逼真肖像，拥有 [发色] 头发和 [眼睛颜色] 眼睛。肖像应该采用 [风格] 风格，搭配 [光线] 光线。',
  author_id: 'user1',
  author_name: '艺术家123',
  author_avatar: 'https://via.placeholder.com/40',
  category_id: '1',
  category_name: '艺术',
  category_color: '#F43F5E',
  tags: ['肖像', '逼真', '人物', '艺术', '绘画'],
  likes_count: 120,
  saves_count: 85,
  created_at: '2026-04-01T10:00:00Z',
  updated_at: '2026-04-01T10:00:00Z'
}

// Mock data for comments
const mockComments = [
  {
    id: '1',
    prompt_id: '1',
    author_id: 'user2',
    author_name: '作家456',
    author_avatar: 'https://via.placeholder.com/40',
    content: '这个提示词真的很棒！我用它创作了一幅油画风格的 30 岁女性肖像，棕色头发，绿色眼睛。',
    created_at: '2026-04-02T14:30:00Z'
  },
  {
    id: '2',
    prompt_id: '1',
    author_id: 'user3',
    author_name: '程序员789',
    author_avatar: 'https://via.placeholder.com/40',
    content: '很棒的提示词！我添加了一些关于背景和构图的额外细节，让它更加具体。',
    created_at: '2026-04-03T09:15:00Z'
  }
]

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState(mockPrompt)
  const [comments, setComments] = useState(mockComments)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)

  // Copy prompt content to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      setShowCopiedMessage(true)
      setTimeout(() => setShowCopiedMessage(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement('textarea')
      textArea.value = prompt.content
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        setShowCopiedMessage(true)
        setTimeout(() => setShowCopiedMessage(false), 2000)
      } catch (err) {
        console.error('降级复制失败:', err)
      } finally {
        document.body.removeChild(textArea)
      }
    }
  }

  // Handle like prompt
  const handleLike = () => {
    setIsLiked(!isLiked)
    // In a real app, you would call an API to update the like count
  }

  // Handle save prompt
  const handleSave = () => {
    setIsSaved(!isSaved)
    // In a real app, you would call an API to save the prompt
  }

  // Handle share prompt
  const handleShare = () => {
    // In a real app, you would implement sharing functionality
    alert('分享功能将在此实现')
  }

  // Handle submit comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      // In a real app, you would call an API to add the comment
      const newComment = {
        id: `comment-${Date.now()}`,
        prompt_id: prompt.id,
        author_id: 'current-user',
        author_name: '当前用户',
        author_avatar: 'https://via.placeholder.com/40',
        content: commentText,
        created_at: new Date().toISOString()
      }
      setComments([...comments, newComment])
      setCommentText('')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">


      {/* Prompt content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={prompt.author_avatar}
                alt={prompt.author_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium">{prompt.author_name}</h4>
                <p className="text-sm text-gray-500">{new Date(prompt.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${prompt.category_color}20`, color: prompt.category_color }}
            >
              {prompt.category_name}
            </span>
          </div>

          <h1 className="text-xl font-bold mb-3">{prompt.title}</h1>
          <p className="text-gray-600 mb-5">{prompt.description}</p>

          <div className="relative mb-5">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap">
              <code>{prompt.content}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-colors"
              title="复制到剪贴板"
            >
              <Copy className="h-5 w-5 text-gray-600" />
            </button>
            {showCopiedMessage && (
              <div className="absolute top-2 right-12 bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-medium">
                已复制！
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {prompt.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
                {isLiked ? prompt.likes_count + 1 : prompt.likes_count}
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isSaved ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Save className={`h-5 w-5 ${isSaved ? 'fill-indigo-500' : ''}`} />
                {isSaved ? prompt.saves_count + 1 : prompt.saves_count}
              </button>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              分享
            </button>
          </div>
        </div>
      </div>



      {/* Comments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            评论 ({comments.length})
          </h2>

          {/* Comment form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="添加您的评论..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={!commentText.trim()}
              >
                发表评论
              </button>
            </div>
          </form>

          {/* Comments list */}
          <div className="space-y-5">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.author_avatar}
                  alt={comment.author_name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{comment.author_name}</h4>
                    <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptDetail
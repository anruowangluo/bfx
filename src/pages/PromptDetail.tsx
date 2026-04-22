import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Copy, Heart, Save, Share2, MessageCircle, ArrowLeft } from 'lucide-react'
import { getPromptById, getComments, likePrompt, savePrompt, createComment, Prompt, Comment } from '../services/api'

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [loading, setLoading] = useState(true)

  // 根据 URL 参数获取对应的提示词数据
  useEffect(() => {
    const fetchPromptData = async () => {
      if (id) {
        setLoading(true)
        try {
          const [promptData, commentsData] = await Promise.all([
            getPromptById(id),
            getComments(id)
          ])
          if (promptData) {
            setPrompt(promptData as Prompt)
            setComments(commentsData as Comment[])
          }
        } catch (error) {
          console.error('Error fetching prompt data:', error)
        } finally {
          setLoading(false)
        }
      }
      // 进入详情页面时滚动到顶部
      window.scrollTo(0, 0)
    }

    fetchPromptData()
  }, [id])

  // Copy prompt content to clipboard
  const handleCopy = async () => {
    // 直接使用降级方案，因为现代剪贴板 API 在很多环境中被阻止
    try {
      const textArea = document.createElement('textarea')
      textArea.value = prompt.content
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.style.fontSize = '16px' // 确保文本被正确选择
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.background = 'transparent'
      document.body.appendChild(textArea)
      
      // 确保元素被正确添加到DOM
      setTimeout(() => {
        try {
          // 尝试不同的选择方法
          textArea.focus()
          textArea.select()
          
          // 对于移动设备，使用不同的选择方法
          if (window.getSelection) {
            textArea.setSelectionRange(0, textArea.value.length)
          } else {
            // 兼容旧浏览器
            textArea.select()
          }
          
          // 执行复制命令
          const successful = document.execCommand('copy')
          
          if (successful) {
            setShowCopiedMessage(true)
            setTimeout(() => setShowCopiedMessage(false), 2000)
          } else {
            // 如果复制失败，显示提示信息
            alert('复制失败，请手动选择并复制内容')
          }
        } catch (err) {
          console.error('复制失败:', err)
          // 所有方法都失败时，显示提示信息
          alert('复制失败，请手动选择并复制内容')
        } finally {
          // 确保移除临时元素
          setTimeout(() => {
            const textArea = document.querySelector('textarea[style*="-999999px"]')
            if (textArea) {
              document.body.removeChild(textArea)
            }
          }, 100)
        }
      }, 10)
    } catch (error) {
      console.error('复制失败:', error)
      // 所有方法都失败时，显示提示信息
      alert('复制失败，请手动选择并复制内容')
    }
  }

  // Handle like prompt
  const handleLike = async () => {
    if (prompt) {
      try {
        await likePrompt(prompt.id)
        setIsLiked(!isLiked)
        // Update local state for immediate feedback
        setPrompt({
          ...prompt,
          likes_count: isLiked ? prompt.likes_count - 1 : prompt.likes_count + 1
        })
      } catch (error) {
        console.error('Error liking prompt:', error)
      }
    }
  }

  // Handle save prompt
  const handleSave = async () => {
    if (prompt) {
      try {
        await savePrompt(prompt.id)
        setIsSaved(!isSaved)
        // Update local state for immediate feedback
        setPrompt({
          ...prompt,
          saves_count: isSaved ? prompt.saves_count - 1 : prompt.saves_count + 1
        })
      } catch (error) {
        console.error('Error saving prompt:', error)
      }
    }
  }

  // Handle share prompt
  const handleShare = () => {
    // In a real app, you would implement sharing functionality
    alert('分享功能将在此实现')
  }

  // Handle submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim() && prompt) {
      try {
        const newComment = await createComment({
          prompt_id: prompt.id,
          content: commentText
        })
        
        if (newComment) {
          setComments([...comments, newComment as Comment])
          setCommentText('')
        }
      } catch (error) {
        console.error('Error creating comment:', error)
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 mb-2">加载中...</p>
      </div>
    )
  }

  // Prompt not found
  if (!prompt) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <ArrowLeft className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-gray-500 mb-2">提示词不存在</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">


      {/* Prompt content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={prompt.author_avatar || 'https://via.placeholder.com/40'}
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

          {/* 效果图 */}
          {prompt.image && (
            <div className="mb-5">
              <div className="w-full rounded-lg overflow-hidden">
                <img 
                  src={prompt.image} 
                  alt={prompt.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          <div className="mb-5">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-colors text-sm"
                title="复制到剪贴板"
              >
                <Copy className="h-4 w-4 text-gray-600" />
                <span>复制内容</span>
              </button>
              {showCopiedMessage && (
                <div className="ml-2 px-3 py-1.5 bg-green-100 text-green-800 rounded text-xs font-medium flex items-center">
                  已复制！
                </div>
              )}
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap">
              <code>{prompt.content}</code>
            </pre>
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
                  src={comment.author_avatar || 'https://via.placeholder.com/40'}
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
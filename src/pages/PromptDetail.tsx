import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Copy, Heart, Save, Share2, MessageCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Mock data for the prompt
const mockPrompt = {
  id: '1',
  title: 'Realistic Portraits',
  description: 'Create realistic human portraits with detailed features',
  content: 'Create a realistic portrait of a [age] year old [gender] with [hair color] hair and [eye color] eyes. The portrait should be in [style] style with [lighting] lighting.',
  author_id: 'user1',
  author_name: 'Artist123',
  author_avatar: 'https://via.placeholder.com/40',
  category_id: '1',
  category_name: 'Art',
  category_color: '#F43F5E',
  tags: ['portrait', 'realistic', 'human', 'art', 'painting'],
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
    author_name: 'Writer456',
    author_avatar: 'https://via.placeholder.com/40',
    content: 'This prompt works really well! I used it to create a portrait of a 30-year-old woman with brown hair and green eyes in oil painting style.',
    created_at: '2026-04-02T14:30:00Z'
  },
  {
    id: '2',
    prompt_id: '1',
    author_id: 'user3',
    author_name: 'Coder789',
    author_avatar: 'https://via.placeholder.com/40',
    content: 'Great prompt! I added some additional details about background and composition to make it even more specific.',
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
    await navigator.clipboard.writeText(prompt.content)
    setShowCopiedMessage(true)
    setTimeout(() => setShowCopiedMessage(false), 2000)
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
    alert('Share functionality would be implemented here')
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
        author_name: 'Current User',
        author_avatar: 'https://via.placeholder.com/40',
        content: commentText,
        created_at: new Date().toISOString()
      }
      setComments([...comments, newComment])
      setCommentText('')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to prompts
      </button>

      {/* Prompt content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div
          className="h-2"
          style={{ backgroundColor: prompt.category_color }}
        />
        <div className="p-6">
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

          <h1 className="text-2xl font-bold mb-2">{prompt.title}</h1>
          <p className="text-gray-600 mb-6">{prompt.description}</p>

          <div className="relative mb-6">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{prompt.content}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4 text-gray-600" />
            </button>
            {showCopiedMessage && (
              <div className="absolute top-2 right-10 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Copied!
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {prompt.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} />
                {isLiked ? prompt.likes_count + 1 : prompt.likes_count}
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isSaved ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Save className={`h-4 w-4 ${isSaved ? 'fill-indigo-500' : ''}`} />
                {isSaved ? prompt.saves_count + 1 : prompt.saves_count}
              </button>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Usage examples */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <h3 className="font-medium mb-2">Example 1: Oil Painting Style</h3>
              <p className="text-gray-600">Create a realistic portrait of a 30 year old woman with brown hair and green eyes. The portrait should be in oil painting style with natural lighting.</p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <h3 className="font-medium mb-2">Example 2: Digital Art Style</h3>
              <p className="text-gray-600">Create a realistic portrait of a 25 year old man with black hair and blue eyes. The portrait should be in digital art style with studio lighting.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </h2>

          {/* Comment form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={!commentText.trim()}
              >
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments list */}
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.author_avatar}
                  alt={comment.author_name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{comment.author_name}</h4>
                    <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{comment.content}</p>
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
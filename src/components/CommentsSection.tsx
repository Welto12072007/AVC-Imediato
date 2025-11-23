import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatCircle, Trash, PencilSimple, X } from '@phosphor-icons/react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'

interface Comment {
  id: string
  text: string
  username: string
  userId: string
  createdAt: string
}

interface CommentsSectionProps {
  projectName: string
}

export function CommentsSection({ projectName }: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/comments/${encodeURIComponent(projectName)}`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [projectName])

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      toast.error('Faça login para comentar!')
      return
    }

    if (!newComment.trim()) {
      toast.error('Escreva algo antes de comentar!')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId,
          projectName,
          text: newComment
        })
      })

      if (response.ok) {
        toast.success('Comentário adicionado!')
        setNewComment('')
        fetchComments()
      } else {
        toast.error('Erro ao adicionar comentário')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Erro ao adicionar comentário')
    } finally {
      setLoading(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) {
      toast.error('Comentário não pode estar vazio!')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId,
          text: editText
        })
      })

      if (response.ok) {
        toast.success('Comentário atualizado!')
        setEditingId(null)
        setEditText('')
        fetchComments()
      } else {
        toast.error('Erro ao atualizar comentário')
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error('Erro ao atualizar comentário')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.userId })
      })

      if (response.ok) {
        toast.success('Comentário deletado!')
        fetchComments()
      } else {
        toast.error('Erro ao deletar comentário')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Erro ao deletar comentário')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditText(comment.text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChatCircle size={24} />
          Comentários ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Comment Form */}
        {isAuthenticated && (
          <div className="space-y-2">
            <Textarea
              placeholder="Escreva seu comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
              rows={3}
            />
            <Button 
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              size="sm"
            >
              Comentar
            </Button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                {editingId === comment.id ? (
                  // Edit Mode
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      disabled={loading}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleEditComment(comment.id)}
                        disabled={loading}
                      >
                        Salvar
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={loading}
                      >
                        <X size={16} />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{comment.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      {user?.userId === comment.userId && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(comment)}
                            disabled={loading}
                          >
                            <PencilSimple size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={loading}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-muted-foreground">
            Faça login para comentar e interagir com os projetos.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

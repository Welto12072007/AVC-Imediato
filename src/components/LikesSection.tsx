import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from '@phosphor-icons/react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'

interface Like {
  username: string
  userId: string
  createdAt: string
}

interface LikesSectionProps {
  projectName: string
}

export function LikesSection({ projectName }: LikesSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [likes, setLikes] = useState<Like[]>([])
  const [userLiked, setUserLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchLikes = async () => {
    try {
      const response = await fetch(`${API_URL}/likes/${encodeURIComponent(projectName)}`)
      const data = await response.json()
      setLikes(data.likes || [])
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }

  const checkUserLike = async () => {
    if (!user) return
    try {
      const response = await fetch(`${API_URL}/likes/${encodeURIComponent(projectName)}/${user.userId}`)
      const data = await response.json()
      setUserLiked(data.liked)
    } catch (error) {
      console.error('Error checking like:', error)
    }
  }

  useEffect(() => {
    fetchLikes()
    if (isAuthenticated) {
      checkUserLike()
    }
  }, [projectName, isAuthenticated])

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Faça login para curtir!')
      return
    }

    setLoading(true)
    try {
      if (userLiked) {
        await fetch(`${API_URL}/likes`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.userId, projectName })
        })
        toast.success('Curtida removida!')
        setUserLiked(false)
      } else {
        await fetch(`${API_URL}/likes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.userId, projectName })
        })
        toast.success('Projeto curtido!')
        setUserLiked(true)
      }
      fetchLikes()
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Erro ao processar curtida')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Heart size={24} weight={userLiked ? 'fill' : 'regular'} className={userLiked ? 'text-red-500' : ''} />
            Curtidas ({likes.length})
          </span>
          <Button 
            onClick={handleLike}
            disabled={loading || !isAuthenticated}
            variant={userLiked ? 'destructive' : 'default'}
            size="sm"
          >
            {userLiked ? 'Descurtir' : 'Curtir'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {likes.length === 0 ? (
          <p className="text-muted-foreground text-sm">Seja o primeiro a curtir este projeto!</p>
        ) : (
          <div className="space-y-2">
            {likes.slice(0, 5).map((like, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Heart size={16} weight="fill" className="text-red-500" />
                <span className="font-medium">{like.username}</span>
                <span className="text-muted-foreground">curtiu</span>
              </div>
            ))}
            {likes.length > 5 && (
              <p className="text-xs text-muted-foreground">
                + {likes.length - 5} outras pessoas curtiram
              </p>
            )}
          </div>
        )}
        
        {!isAuthenticated && (
          <p className="text-xs text-muted-foreground mt-4">
            Faça login para curtir e interagir com os projetos.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

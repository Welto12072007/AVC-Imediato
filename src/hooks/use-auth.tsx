import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserSession } from '@/lib/auth'
import { toast } from 'sonner'

const API_URL = '/api'

interface AuthContextType {
  user: UserSession | null
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user-session')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error loading user session:', error)
      }
    }
  }, [])

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Erro ao criar conta')
        return false
      }

      setUser(data.user)
      localStorage.setItem('user-session', JSON.stringify(data.user))
      toast.success(data.message)
      return true
    } catch (error) {
      console.error('Register error:', error)
      toast.error('Erro ao conectar com o servidor')
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Erro ao fazer login')
        return false
      }

      setUser(data.user)
      localStorage.setItem('user-session', JSON.stringify(data.user))
      toast.success(data.message)
      return true
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Erro ao conectar com o servidor')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user-session')
    toast.info('Você saiu da sua conta')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: user !== null 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

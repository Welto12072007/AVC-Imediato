import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserSession, hashPassword, verifyPassword, validateEmail, validatePassword, validateUsername } from '@/lib/auth'
import { toast } from 'sonner'

interface AuthContextType {
  user: UserSession | null
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useKV<UserSession | null>('user-session', null)
  const [users, setUsers] = useKV<User[]>('users-db', [])
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    if (session !== undefined) {
      setUser(session)
    }
  }, [session])

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      toast.error(usernameValidation.message)
      return false
    }

    if (!validateEmail(email)) {
      toast.error('Email inválido')
      return false
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message)
      return false
    }

    const currentUsers = users || []
    const emailExists = currentUsers.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      toast.error('Este email já está registrado')
      return false
    }

    const usernameExists = currentUsers.some(u => u.username.toLowerCase() === username.toLowerCase())
    if (usernameExists) {
      toast.error('Este nome de usuário já está em uso')
      return false
    }

    const passwordHash = await hashPassword(password)
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    }

    setUsers((currentUsers) => [...(currentUsers || []), newUser])

    const userSession: UserSession = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email
    }

    setSession(userSession)
    toast.success('Conta criada com sucesso!')
    return true
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!validateEmail(email)) {
      toast.error('Email inválido')
      return false
    }

    const currentUsers = users || []
    const user = currentUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      toast.error('Email ou senha incorretos')
      return false
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      toast.error('Email ou senha incorretos')
      return false
    }

    const userSession: UserSession = {
      userId: user.id,
      username: user.username,
      email: user.email
    }

    setSession(userSession)
    toast.success(`Bem-vindo, ${user.username}!`)
    return true
  }

  const logout = () => {
    setSession(null)
    setUser(null)
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

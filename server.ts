import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { neo4jService } from './src/lib/neo4j'
import { hashPassword, verifyPassword, validateEmail, validatePassword, validateUsername } from './src/lib/auth'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Neo4j connection
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687'
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j'
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password'

neo4jService.connect(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)

// Initialize demo users
neo4jService.initializeDemoUsers().catch(console.error)

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Register endpoint
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    let { username, email, password } = req.body
    
    // Trim whitespace from inputs
    username = username?.trim()
    email = email?.trim()
    
    console.log('📝 Register attempt:', { username, email, passwordLength: password?.length })

    // Validate inputs
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      console.log('❌ Username validation failed:', usernameValidation.message)
      return res.status(400).json({ error: usernameValidation.message })
    }

    if (!validateEmail(email)) {
      console.log('❌ Email validation failed')
      return res.status(400).json({ error: 'Email inválido' })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      console.log('❌ Password validation failed:', passwordValidation.message)
      return res.status(400).json({ error: passwordValidation.message })
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists...')
    const existingUserByEmail = await neo4jService.findUserByEmail(email.toLowerCase())
    if (existingUserByEmail) {
      console.log('❌ Email already registered')
      return res.status(400).json({ error: 'Este email já está registrado' })
    }

    const existingUserByUsername = await neo4jService.findUserByUsername(username.toLowerCase())
    if (existingUserByUsername) {
      console.log('❌ Username already in use')
      return res.status(400).json({ error: 'Este nome de usuário já está em uso' })
    }

    // Create user
    console.log('✅ Creating user...')
    const passwordHash = await hashPassword(password)
    const user = await neo4jService.createUser(username.toLowerCase(), email.toLowerCase(), passwordHash)

    // Return user session
    const userSession = {
      userId: user.id,
      username: user.username,
      email: user.email
    }

    console.log('✅ User created successfully:', username)
    res.status(201).json({ user: userSession, message: 'Conta criada com sucesso!' })
  } catch (error) {
    console.error('❌ Register error:', error)
    res.status(500).json({ error: 'Erro ao criar conta' })
  }
})

// Login endpoint
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validate inputs
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' })
    }

    // Find user
    const user = await neo4jService.findUserByEmail(email.toLowerCase())
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' })
    }

    // Return user session
    const userSession = {
      userId: user.id,
      username: user.username,
      email: user.email
    }

    res.json({ user: userSession, message: `Bem-vindo, ${user.username}!` })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
})

// Get user by ID
app.get('/api/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const user = await neo4jService.findUserById(userId)
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const userSession = {
      userId: user.id,
      username: user.username,
      email: user.email
    }

    res.json({ user: userSession })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Neo4j connected to ${NEO4J_URI}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...')
  await neo4jService.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...')
  await neo4jService.close()
  process.exit(0)
})

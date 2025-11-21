import neo4j, { Driver, Session } from 'neo4j-driver'

class Neo4jService {
  private driver: Driver | null = null

  connect(uri: string, username: string, password: string) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
    return this.driver
  }

  getSession(): Session {
    if (!this.driver) {
      throw new Error('Neo4j driver not initialized. Call connect() first.')
    }
    return this.driver.session()
  }

  async close() {
    if (this.driver) {
      await this.driver.close()
    }
  }

  // Create user
  async createUser(username: string, email: string, passwordHash: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        `CREATE (u:User {
          id: randomUUID(),
          username: $username,
          email: $email,
          passwordHash: $passwordHash,
          createdAt: datetime()
        })
        RETURN u`,
        { username, email, passwordHash }
      )
      return result.records[0]?.get('u').properties
    } finally {
      await session.close()
    }
  }

  // Find user by email
  async findUserByEmail(email: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        'MATCH (u:User {email: $email}) RETURN u',
        { email }
      )
      if (result.records.length === 0) return null
      return result.records[0].get('u').properties
    } finally {
      await session.close()
    }
  }

  // Find user by username
  async findUserByUsername(username: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        'MATCH (u:User {username: $username}) RETURN u',
        { username }
      )
      if (result.records.length === 0) return null
      return result.records[0].get('u').properties
    } finally {
      await session.close()
    }
  }

  // Find user by ID
  async findUserById(userId: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        'MATCH (u:User {id: $userId}) RETURN u',
        { userId }
      )
      if (result.records.length === 0) return null
      return result.records[0].get('u').properties
    } finally {
      await session.close()
    }
  }

  // Initialize database with demo users
  async initializeDemoUsers() {
    const session = this.getSession()
    try {
      // Check if users already exist
      const checkResult = await session.run('MATCH (u:User) RETURN count(u) as count')
      const count = checkResult.records[0].get('count').toNumber()
      
      if (count === 0) {
        // Create demo users
        await session.run(`
          CREATE (u1:User {
            id: randomUUID(),
            username: 'demo',
            email: 'demo@tcc-saude.com',
            passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
            createdAt: datetime()
          })
          CREATE (u2:User {
            id: randomUUID(),
            username: 'test',
            email: 'test@example.com',
            passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
            createdAt: datetime()
          })
        `)
        console.log('✅ Demo users created in Neo4j')
      }
    } finally {
      await session.close()
    }
  }
}

export const neo4jService = new Neo4jService()

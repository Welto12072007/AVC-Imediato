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

  // ==================== LIKES CRUD ====================
  
  // Create a like relationship
  async createLike(userId: string, projectName: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
         MERGE (p:Project {name: $projectName})
         MERGE (u)-[l:LIKES {createdAt: datetime()}]->(p)
         RETURN l, u.username as username`,
        { userId, projectName }
      )
      return {
        username: result.records[0]?.get('username'),
        createdAt: result.records[0]?.get('l').properties.createdAt
      }
    } finally {
      await session.close()
    }
  }

  // Remove a like
  async removeLike(userId: string, projectName: string) {
    const session = this.getSession()
    try {
      await session.run(
        `MATCH (u:User {id: $userId})-[l:LIKES]->(p:Project {name: $projectName})
         DELETE l`,
        { userId, projectName }
      )
      return true
    } finally {
      await session.close()
    }
  }

  // Get all likes for a project
  async getLikesByProject(projectName: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        `MATCH (u:User)-[l:LIKES]->(p:Project {name: $projectName})
         RETURN u.username as username, u.id as userId, l.createdAt as createdAt
         ORDER BY l.createdAt DESC`,
        { projectName }
      )
      return result.records.map(record => ({
        username: record.get('username'),
        userId: record.get('userId'),
        createdAt: record.get('createdAt')
      }))
    } finally {
      await session.close()
    }
  }

  // Check if user liked a project
  async checkUserLike(userId: string, projectName: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[l:LIKES]->(p:Project {name: $projectName})
         RETURN l`,
        { userId, projectName }
      )
      return result.records.length > 0
    } finally {
      await session.close()
    }
  }

  // ==================== COMMENTS CRUD ====================
  
  // Create a comment
  async createComment(userId: string, projectName: string, text: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
         MERGE (p:Project {name: $projectName})
         CREATE (c:Comment {
           id: randomUUID(),
           text: $text,
           createdAt: datetime()
         })
         CREATE (u)-[:WROTE]->(c)
         CREATE (c)-[:ABOUT]->(p)
         RETURN c, u.username as username`,
        { userId, projectName, text }
      )
      const comment = result.records[0]?.get('c').properties
      return {
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        username: result.records[0]?.get('username')
      }
    } finally {
      await session.close()
    }
  }

  // Get all comments for a project
  async getCommentsByProject(projectName: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        `MATCH (u:User)-[:WROTE]->(c:Comment)-[:ABOUT]->(p:Project {name: $projectName})
         RETURN c.id as id, c.text as text, c.createdAt as createdAt, 
                u.username as username, u.id as userId
         ORDER BY c.createdAt DESC`,
        { projectName }
      )
      return result.records.map(record => ({
        id: record.get('id'),
        text: record.get('text'),
        createdAt: record.get('createdAt'),
        username: record.get('username'),
        userId: record.get('userId')
      }))
    } finally {
      await session.close()
    }
  }

  // Delete a comment
  async deleteComment(commentId: string, userId: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:WROTE]->(c:Comment {id: $commentId})
         DETACH DELETE c
         RETURN count(c) as deleted`,
        { commentId, userId }
      )
      return result.records[0]?.get('deleted').toNumber() > 0
    } finally {
      await session.close()
    }
  }

  // Update a comment
  async updateComment(commentId: string, userId: string, newText: string) {
    const session = this.getSession()
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:WROTE]->(c:Comment {id: $commentId})
         SET c.text = $newText, c.updatedAt = datetime()
         RETURN c`,
        { commentId, userId, newText }
      )
      return result.records.length > 0
    } finally {
      await session.close()
    }
  }
}

export const neo4jService = new Neo4jService()

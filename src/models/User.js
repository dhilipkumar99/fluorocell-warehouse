import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

/**
 * User model with helper methods for user operations
 */
export const User = {
  /**
   * Find a user by email
   * @param {string} email User's email address
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async findByEmail(email) {
    return db.user.findUnique({
      where: { email },
    });
  },

  /**
   * Find a user by ID
   * @param {string} id User's ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async findById(id) {
    return db.user.findUnique({
      where: { id },
    });
  },

  /**
   * Create a new user with a hashed password
   * @param {Object} userData User data including name, email, password
   * @returns {Promise<Object>} Created user object (without password)
   */
  async create({ name, email, password }) {
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in database
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  },

  /**
   * Verify a user's password
   * @param {string} providedPassword Password to verify
   * @param {string} storedPassword Stored hashed password
   * @returns {Promise<boolean>} Whether password matches
   */
  async verifyPassword(providedPassword, storedPassword) {
    return bcrypt.compare(providedPassword, storedPassword);
  },

  /**
   * Update a user's profile
   * @param {string} id User ID
   * @param {Object} data Fields to update
   * @returns {Promise<Object>} Updated user (without password)
   */
  async update(id, data) {
    // Don't allow updating email to one that's already in use
    if (data.email) {
      const existingUser = await this.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already in use by another account');
      }
    }
    
    // Hash password if it's being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    // Update user in database
    const user = await db.user.update({
      where: { id },
      data,
    });
    
    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  },

  /**
   * Get a user's submissions
   * @param {string} userId User ID
   * @returns {Promise<Array>} List of user's submissions
   */
  async getSubmissions(userId) {
    return db.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },
};

export default User;
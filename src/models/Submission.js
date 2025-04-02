import { db } from '@/lib/db';
import { listFiles } from '@/lib/storage';

/**
 * Submission model with helper methods for submission operations
 */
export const Submission = {
  /**
   * Find a submission by ID
   * @param {string} id Submission ID
   * @param {boolean} includeUser Whether to include user data
   * @returns {Promise<Object|null>} Submission object or null if not found
   */
  async findById(id, includeUser = false) {
    return db.submission.findUnique({
      where: { id },
      include: {
        user: includeUser,
      },
    });
  },

  /**
   * Find submissions by user ID
   * @param {string} userId User ID
   * @param {Object} options Query options
   * @returns {Promise<Array>} List of submissions
   */
  async findByUser(userId, options = {}) {
    const { limit, offset, orderBy = { createdAt: 'desc' } } = options;
    
    return db.submission.findMany({
      where: { userId },
      orderBy,
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
    });
  },

  /**
   * Create a new submission
   * @param {Object} data Submission data
   * @returns {Promise<Object>} Created submission object
   */
  async create(data) {
    return db.submission.create({
      data,
    });
  },

  /**
   * Update a submission
   * @param {string} id Submission ID
   * @param {Object} data Fields to update
   * @returns {Promise<Object>} Updated submission
   */
  async update(id, data) {
    return db.submission.update({
      where: { id },
      data,
    });
  },

  /**
   * Update submission status
   * @param {string} id Submission ID
   * @param {string} status New status ('pending', 'processing', 'completed', 'failed')
   * @returns {Promise<Object>} Updated submission
   */
  async updateStatus(id, status) {
    return this.update(id, { 
      status,
      ...(status === 'completed' ? { completedAt: new Date() } : {})
    });
  },

  /**
   * Get files for a submission
   * @param {Object} submission Submission object with inputFolderId/outputFolderId
   * @param {string} fileType 'input' or 'output'
   * @returns {Promise<Array>} List of file metadata
   */
  async getFiles(submission, fileType = 'input') {
    const folderId = fileType === 'input' 
      ? submission.inputFolderId 
      : submission.outputFolderId;
    
    if (!folderId) {
      return [];
    }
    
    try {
      return await listFiles(folderId);
    } catch (error) {
      console.error(`Error listing ${fileType} files:`, error);
      return [];
    }
  },

  /**
   * Get submissions with a specific status
   * @param {string} status Status to filter by
   * @param {Object} options Query options
   * @returns {Promise<Array>} List of submissions
   */
  async findByStatus(status, options = {}) {
    const { limit, offset, includeUser = false } = options;
    
    return db.submission.findMany({
      where: { status },
      orderBy: { createdAt: 'asc' },
      include: {
        user: includeUser,
      },
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
    });
  },
  
  /**
   * Set output folder for a submission
   * @param {string} id Submission ID
   * @param {string} outputFolderId Output folder ID
   * @returns {Promise<Object>} Updated submission
   */
  async setOutputFolder(id, outputFolderId) {
    return this.update(id, { outputFolderId });
  },
};

export default Submission;
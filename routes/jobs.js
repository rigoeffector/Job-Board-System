const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { runQuery, getRow, getAll } = require('../config/database');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const jobValidation = [
  body('title').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('company').optional().trim().isLength({ min: 2, max: 100 }),
  body('location').optional().trim().isLength({ min: 2, max: 100 }),
  body('salary_min').optional().isInt({ min: 0 }),
  body('salary_max').optional().isInt({ min: 0 }),
  body('type').optional().isIn(['full-time', 'part-time', 'contract', 'internship']),
  body('status').optional().isIn(['active', 'inactive', 'closed'])
];

// Get all jobs (public, with optional filtering)
router.get('/', optionalAuth, [
  query('title').optional().trim(),
  query('location').optional().trim(),
  query('type').optional().isIn(['full-time', 'part-time', 'contract', 'internship']),
  query('status').optional().isIn(['active', 'inactive', 'closed']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, location, type, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const whereConditions = [];
    const params = [];

    if (title) {
      whereConditions.push('title LIKE ?');
      params.push(`%${title}%`);
    }

    if (location) {
      whereConditions.push('location LIKE ?');
      params.push(`%${location}%`);
    }

    if (type) {
      whereConditions.push('type = ?');
      params.push(type);
    }

    if (status) {
      whereConditions.push('status = ?');
      params.push(status);
    } else if (!req.user || req.user.role !== 'admin') {
      // Non-admin users only see active jobs
      whereConditions.push('status = ?');
      params.push('active');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await getRow(
      `SELECT COUNT(*) as total FROM jobs ${whereClause}`,
      params
    );

    // Get jobs with pagination
    const jobs = await getAll(
      `SELECT j.*, u.name as posted_by_name 
       FROM jobs j 
       LEFT JOIN users u ON j.posted_by = u.id 
       ${whereClause} 
       ORDER BY j.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get single job by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const job = await getRow(
      `SELECT j.*, u.name as posted_by_name 
       FROM jobs j 
       LEFT JOIN users u ON j.posted_by = u.id 
       WHERE j.id = ?`,
      [id]
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user can view this job (admin can view all, users only active)
    if (!req.user || req.user.role !== 'admin') {
      if (job.status !== 'active') {
        return res.status(404).json({ error: 'Job not found' });
      }
    }

    res.json({ job });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Create new job (admin only)
router.post('/', authenticateToken, requireAdmin, jobValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      company,
      location,
      salary_min,
      salary_max,
      type = 'full-time',
      status = 'active'
    } = req.body;

    // Check if job with same title already exists
    const existingJob = await getRow(
      'SELECT id, title FROM jobs WHERE title = ? AND status != ?',
      [title, 'closed']
    );

    if (existingJob) {
      return res.status(400).json({ 
        error: 'A job with this title already exists',
        existingJob: {
          id: existingJob.id,
          title: existingJob.title
        }
      });
    }

    // Validate salary range
    if (salary_min && salary_max && salary_min > salary_max) {
      return res.status(400).json({ error: 'Minimum salary cannot be greater than maximum salary' });
    }

    const result = await runQuery(
      `INSERT INTO jobs (title, description, company, location, salary_min, salary_max, type, status, posted_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, company, location, salary_min, salary_max, type, status, req.user.id]
    );

    const newJob = await getRow(
      `SELECT j.*, u.name as posted_by_name 
       FROM jobs j 
       LEFT JOIN users u ON j.posted_by = u.id 
       WHERE j.id = ?`,
      [result.id]
    );

    res.status(201).json({
      message: 'Job created successfully',
      job: newJob
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job (admin only)
router.put('/:id', authenticateToken, requireAdmin, jobValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      title,
      description,
      company,
      location,
      salary_min,
      salary_max,
      type,
      status
    } = req.body;

    // Check if job exists
    const existingJob = await getRow('SELECT id FROM jobs WHERE id = ?', [id]);
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if job with same title already exists (excluding current job)
    if (title) {
      const duplicateJob = await getRow(
        'SELECT id, title FROM jobs WHERE title = ? AND id != ? AND status != ?',
        [title, id, 'closed']
      );

      if (duplicateJob) {
        return res.status(400).json({ 
          error: 'A job with this title already exists',
          existingJob: {
            id: duplicateJob.id,
            title: duplicateJob.title
          }
        });
      }
    }

    // Validate salary range
    if (salary_min && salary_max && salary_min > salary_max) {
      return res.status(400).json({ error: 'Minimum salary cannot be greater than maximum salary' });
    }

    // Build update query
    const updates = [];
    const params = [];

    if (title !== undefined && title !== null) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined && description !== null) {
      updates.push('description = ?');
      params.push(description);
    }
    if (company !== undefined && company !== null) {
      updates.push('company = ?');
      params.push(company);
    }
    if (location !== undefined && location !== null) {
      updates.push('location = ?');
      params.push(location);
    }
    if (salary_min !== undefined && salary_min !== null) {
      updates.push('salary_min = ?');
      params.push(salary_min);
    }
    if (salary_max !== undefined && salary_max !== null) {
      updates.push('salary_max = ?');
      params.push(salary_max);
    }
    if (type !== undefined && type !== null) {
      updates.push('type = ?');
      params.push(type);
    }
    if (status !== undefined && status !== null) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await runQuery(
      `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updatedJob = await getRow(
      `SELECT j.*, u.name as posted_by_name 
       FROM jobs j 
       LEFT JOIN users u ON j.posted_by = u.id 
       WHERE j.id = ?`,
      [id]
    );

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists
    const existingJob = await getRow('SELECT id FROM jobs WHERE id = ?', [id]);
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if there are applications for this job
    const applications = await getAll('SELECT id FROM applications WHERE job_id = ?', [id]);
    if (applications.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete job with existing applications. Consider setting status to "closed" instead.' 
      });
    }

    await runQuery('DELETE FROM jobs WHERE id = ?', [id]);

    res.json({ message: 'Job deleted successfully' });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router; 
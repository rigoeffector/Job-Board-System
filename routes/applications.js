const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { runQuery, getRow, getAll } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const applicationValidation = [
  body('cover_letter').trim().isLength({ min: 10, max: 2000 }),
  body('cv_link').optional().isURL()
];

// Get applications (admin can see all, users can see their own)
router.get('/', authenticateToken, [
  query('job_id').optional().isInt({ min: 1 }),
  query('status').optional().isIn(['pending', 'reviewed', 'accepted', 'rejected']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { job_id, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const whereConditions = [];
    const params = [];

    if (job_id) {
      whereConditions.push('a.job_id = ?');
      params.push(job_id);
    }

    if (status) {
      whereConditions.push('a.status = ?');
      params.push(status);
    }

    // Users can only see their own applications, admins can see all
    if (req.user.role !== 'admin') {
      whereConditions.push('a.user_id = ?');
      params.push(req.user.id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await getRow(
      `SELECT COUNT(*) as total FROM applications a ${whereClause}`,
      params
    );

    // Get applications with pagination
    const applications = await getAll(
      `SELECT a.*, 
              j.title as job_title, 
              j.company as job_company,
              u.name as applicant_name,
              u.email as applicant_email
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get single application
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const application = await getRow(
      `SELECT a.*, 
              j.title as job_title, 
              j.company as job_company,
              j.description as job_description,
              u.name as applicant_name,
              u.email as applicant_email
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [id]
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user can view this application
    if (req.user.role !== 'admin' && application.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ application });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Submit application for a job
router.post('/', authenticateToken, applicationValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { job_id, cover_letter, cv_link } = req.body;

    // Validate job_id
    if (!job_id || isNaN(job_id)) {
      return res.status(400).json({ error: 'Valid job_id is required' });
    }

    // Check if job exists and is active
    const job = await getRow(
      'SELECT id, title, status FROM jobs WHERE id = ?',
      [job_id]
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ error: 'Cannot apply to inactive job' });
    }

    // Check if user already applied to this job
    const existingApplication = await getRow(
      'SELECT id FROM applications WHERE job_id = ? AND user_id = ?',
      [job_id, req.user.id]
    );

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    // Create application
    const result = await runQuery(
      'INSERT INTO applications (job_id, user_id, cover_letter, cv_link) VALUES (?, ?, ?, ?)',
      [job_id, req.user.id, cover_letter, cv_link]
    );

    const newApplication = await getRow(
      `SELECT a.*, 
              j.title as job_title, 
              j.company as job_company,
              u.name as applicant_name
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [result.id]
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application: newApplication
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Update application status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['pending', 'reviewed', 'accepted', 'rejected'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Check if application exists
    const existingApplication = await getRow(
      'SELECT id FROM applications WHERE id = ?',
      [id]
    );

    if (!existingApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update status
    await runQuery(
      'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    const updatedApplication = await getRow(
      `SELECT a.*, 
              j.title as job_title, 
              j.company as job_company,
              u.name as applicant_name,
              u.email as applicant_email
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [id]
    );

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Delete application (user can delete their own, admin can delete any)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if application exists
    const application = await getRow(
      'SELECT id, user_id FROM applications WHERE id = ?',
      [id]
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user can delete this application
    if (req.user.role !== 'admin' && application.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await runQuery('DELETE FROM applications WHERE id = ?', [id]);

    res.json({ message: 'Application deleted successfully' });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Get applications for a specific job (admin only)
router.get('/job/:jobId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await getRow('SELECT id, title FROM jobs WHERE id = ?', [jobId]);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const applications = await getAll(
      `SELECT a.*, 
              u.name as applicant_name,
              u.email as applicant_email
       FROM applications a
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.job_id = ?
       ORDER BY a.created_at DESC`,
      [jobId]
    );

    res.json({
      job,
      applications
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Failed to fetch job applications' });
  }
});

module.exports = router; 
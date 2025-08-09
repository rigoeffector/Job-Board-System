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
              j.id as job_id,
              j.title as job_title, 
              j.description as job_description,
              j.company as job_company,
              j.location as job_location,
              j.salary_min as job_salary_min,
              j.salary_max as job_salary_max,
              j.type as job_type,
              j.status as job_status,
              j.created_at as job_created_at,
              u.id as user_id,
              u.name as user_name,
              u.email as user_email,
              u.role as user_role,
              u.created_at as user_created_at
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Transform the data to include nested objects
    const transformedApplications = applications.map(app => ({
      id: app.id,
      cover_letter: app.cover_letter,
      cv_link: app.cv_link,
      status: app.status,
      created_at: app.created_at,
      updated_at: app.updated_at,
      job: {
        id: app.job_id,
        title: app.job_title,
        description: app.job_description,
        company: app.job_company,
        location: app.job_location,
        salary_min: app.job_salary_min,
        salary_max: app.job_salary_max,
        type: app.job_type,
        status: app.job_status,
        created_at: app.job_created_at
      },
      user: {
        id: app.user_id,
        name: app.user_name,
        email: app.user_email,
        role: app.user_role,
        created_at: app.user_created_at
      }
    }));

    res.json({
      applications: transformedApplications,
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
              j.id as job_id,
              j.title as job_title, 
              j.description as job_description,
              j.company as job_company,
              j.location as job_location,
              j.salary_min as job_salary_min,
              j.salary_max as job_salary_max,
              j.type as job_type,
              j.status as job_status,
              j.created_at as job_created_at,
              u.id as user_id,
              u.name as user_name,
              u.email as user_email,
              u.role as user_role,
              u.created_at as user_created_at
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

    // Transform the data to include nested objects
    const transformedApplication = {
      id: application.id,
      cover_letter: application.cover_letter,
      cv_link: application.cv_link,
      status: application.status,
      created_at: application.created_at,
      updated_at: application.updated_at,
      job: {
        id: application.job_id,
        title: application.job_title,
        description: application.job_description,
        company: application.job_company,
        location: application.job_location,
        salary_min: application.job_salary_min,
        salary_max: application.job_salary_max,
        type: application.job_type,
        status: application.job_status,
        created_at: application.job_created_at
      },
      user: {
        id: application.user_id,
        name: application.user_name,
        email: application.user_email,
        role: application.user_role,
        created_at: application.user_created_at
      }
    };

    res.json({ application: transformedApplication });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Submit application for a job
router.post('/send', authenticateToken, applicationValidation, async (req, res) => {
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
              j.id as job_id,
              j.title as job_title, 
              j.description as job_description,
              j.company as job_company,
              j.location as job_location,
              j.salary_min as job_salary_min,
              j.salary_max as job_salary_max,
              j.type as job_type,
              j.status as job_status,
              j.created_at as job_created_at,
              u.id as user_id,
              u.name as user_name,
              u.email as user_email,
              u.role as user_role,
              u.created_at as user_created_at
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [result.id]
    );

    // Transform the data to include nested objects
    const transformedApplication = {
      id: newApplication.id,
      cover_letter: newApplication.cover_letter,
      cv_link: newApplication.cv_link,
      status: newApplication.status,
      created_at: newApplication.created_at,
      updated_at: newApplication.updated_at,
      job: {
        id: newApplication.job_id,
        title: newApplication.job_title,
        description: newApplication.job_description,
        company: newApplication.job_company,
        location: newApplication.job_location,
        salary_min: newApplication.job_salary_min,
        salary_max: newApplication.job_salary_max,
        type: newApplication.job_type,
        status: newApplication.job_status,
        created_at: newApplication.job_created_at
      },
      user: {
        id: newApplication.user_id,
        name: newApplication.user_name,
        email: newApplication.user_email,
        role: newApplication.user_role,
        created_at: newApplication.user_created_at
      }
    };

    res.status(201).json({
      message: 'Application submitted successfully',
      application: transformedApplication
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
              j.id as job_id,
              j.title as job_title, 
              j.description as job_description,
              j.company as job_company,
              j.location as job_location,
              j.salary_min as job_salary_min,
              j.salary_max as job_salary_max,
              j.type as job_type,
              j.status as job_status,
              j.created_at as job_created_at,
              u.id as user_id,
              u.name as user_name,
              u.email as user_email,
              u.role as user_role,
              u.created_at as user_created_at
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [id]
    );

    // Transform the data to include nested objects
    const transformedApplication = {
      id: updatedApplication.id,
      cover_letter: updatedApplication.cover_letter,
      cv_link: updatedApplication.cv_link,
      status: updatedApplication.status,
      created_at: updatedApplication.created_at,
      updated_at: updatedApplication.updated_at,
      job: {
        id: updatedApplication.job_id,
        title: updatedApplication.job_title,
        description: updatedApplication.job_description,
        company: updatedApplication.job_company,
        location: updatedApplication.job_location,
        salary_min: updatedApplication.job_salary_min,
        salary_max: updatedApplication.job_salary_max,
        type: updatedApplication.job_type,
        status: updatedApplication.job_status,
        created_at: updatedApplication.job_created_at
      },
      user: {
        id: updatedApplication.user_id,
        name: updatedApplication.user_name,
        email: updatedApplication.user_email,
        role: updatedApplication.user_role,
        created_at: updatedApplication.user_created_at
      }
    };

    res.json({
      message: 'Application status updated successfully',
      application: transformedApplication
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
              j.id as job_id,
              j.title as job_title, 
              j.description as job_description,
              j.company as job_company,
              j.location as job_location,
              j.salary_min as job_salary_min,
              j.salary_max as job_salary_max,
              j.type as job_type,
              j.status as job_status,
              j.created_at as job_created_at,
              u.id as user_id,
              u.name as user_name,
              u.email as user_email,
              u.role as user_role,
              u.created_at as user_created_at
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.job_id = ?
       ORDER BY a.created_at DESC`,
      [jobId]
    );

    // Transform the data to include nested objects
    const transformedApplications = applications.map(app => ({
      id: app.id,
      cover_letter: app.cover_letter,
      cv_link: app.cv_link,
      status: app.status,
      created_at: app.created_at,
      updated_at: app.updated_at,
      job: {
        id: app.job_id,
        title: app.job_title,
        description: app.job_description,
        company: app.job_company,
        location: app.job_location,
        salary_min: app.job_salary_min,
        salary_max: app.job_salary_max,
        type: app.job_type,
        status: app.job_status,
        created_at: app.job_created_at
      },
      user: {
        id: app.user_id,
        name: app.user_name,
        email: app.user_email,
        role: app.user_role,
        created_at: app.user_created_at
      }
    }));

    res.json({
      job,
      applications: transformedApplications
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Failed to fetch job applications' });
  }
});

module.exports = router; 
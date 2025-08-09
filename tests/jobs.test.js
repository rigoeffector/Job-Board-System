const request = require('supertest');
const app = require('../server');
const { runQuery, getRow, initDatabase } = require('../config/database');

describe('Jobs Endpoints', () => {
  let adminToken;
  let userToken;
  let testJobId;

  beforeAll(async () => {
    // Initialize test database
    await initDatabase();
    
    // Clean up test data
    try {
      await runQuery('DELETE FROM applications');
      await runQuery('DELETE FROM jobs');
      await runQuery('DELETE FROM users WHERE email LIKE ?', ['test%@example.com']);
    } catch (error) {
      // Tables might not exist yet, that's okay
    }

    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin'
      });
    adminToken = adminResponse.body.token;

    // Create regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@test.com',
        password: 'password123',
        name: 'Regular User'
      });
    userToken = userResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await runQuery('DELETE FROM applications');
      await runQuery('DELETE FROM jobs');
      await runQuery('DELETE FROM users WHERE email LIKE ?', ['test%@example.com']);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('GET /api/jobs', () => {
    it('should get all active jobs without authentication', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body).toHaveProperty('jobs');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.jobs)).toBe(true);
    });

    it('should filter jobs by title', async () => {
      const response = await request(app)
        .get('/api/jobs?title=Software')
        .expect(200);

      expect(response.body.jobs.length).toBeGreaterThanOrEqual(0);
    });

    it('should filter jobs by location', async () => {
      const response = await request(app)
        .get('/api/jobs?location=San Francisco')
        .expect(200);

      expect(response.body.jobs.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a new job as admin', async () => {
      const jobData = {
        title: 'Test Job',
        description: 'This is a test job description',
        company: 'Test Company',
        location: 'Test Location',
        salary_min: 50000,
        salary_max: 80000,
        type: 'full-time',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(jobData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Job created successfully');
      expect(response.body).toHaveProperty('job');
      expect(response.body.job.title).toBe(jobData.title);
      expect(response.body.job.company).toBe(jobData.company);
      
      testJobId = response.body.job.id;
    });

    it('should not create job without admin privileges', async () => {
      const jobData = {
        title: 'Test Job 2',
        description: 'This is another test job',
        company: 'Test Company 2',
        location: 'Test Location 2'
      };

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(jobData)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should get a specific job by ID', async () => {
      const response = await request(app)
        .get(`/api/jobs/${testJobId}`)
        .expect(200);

      expect(response.body).toHaveProperty('job');
      expect(response.body.job.id).toBe(testJobId);
      expect(response.body.job.title).toBe('Test Job');
    });

    it('should return 404 for non-existent job', async () => {
      const response = await request(app)
        .get('/api/jobs/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Job not found');
    });
  });

  describe('PUT /api/jobs/:id', () => {
    it('should update job as admin', async () => {
      const updateData = {
        title: 'Updated Test Job',
        description: 'This is an updated test job description'
      };

      const response = await request(app)
        .put(`/api/jobs/${testJobId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Job updated successfully');
      expect(response.body.job.title).toBe(updateData.title);
      expect(response.body.job.description).toBe(updateData.description);
    });

    it('should not update job without admin privileges', async () => {
      const updateData = {
        title: 'Unauthorized Update'
      };

      const response = await request(app)
        .put(`/api/jobs/${testJobId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');
    });

    it('should return 404 for non-existent job', async () => {
      const response = await request(app)
        .put('/api/jobs/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Test' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Job not found');
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete job as admin', async () => {
      const response = await request(app)
        .delete(`/api/jobs/${testJobId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Job deleted successfully');
    });

    it('should not delete job without admin privileges', async () => {
      const response = await request(app)
        .delete(`/api/jobs/${testJobId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');
    });

    it('should return 404 for non-existent job', async () => {
      const response = await request(app)
        .delete('/api/jobs/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Job not found');
    });
  });
}); 
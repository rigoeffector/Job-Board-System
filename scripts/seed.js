const bcrypt = require('bcryptjs');
const { runQuery, getRow } = require('../config/database');

async function seed() {
  try {
    console.log('Starting database seeding...');

    // Check if admin user already exists
    const existingAdmin = await getRow('SELECT id FROM users WHERE email = ?', ['admin@jobboard.com']);
    
    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await runQuery(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        ['admin@jobboard.com', hashedPassword, 'Admin User', 'admin']
      );
      console.log('Admin user created: admin@jobboard.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Check if sample jobs exist
    const jobCount = await getRow('SELECT COUNT(*) as count FROM jobs');
    
    if (jobCount.count === 0) {
      // Get admin user ID
      const adminUser = await getRow('SELECT id FROM users WHERE email = ?', ['admin@jobboard.com']);
      
      // Create sample jobs
      const sampleJobs = [
        {
          title: 'Senior Software Engineer',
          description: 'We are looking for a Senior Software Engineer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          salary_min: 120000,
          salary_max: 180000,
          type: 'full-time',
          status: 'active'
        },
        {
          title: 'Frontend Developer',
          description: 'Join our frontend team to build beautiful and responsive user interfaces. Experience with React, Vue.js, or Angular is required.',
          company: 'WebSolutions Ltd.',
          location: 'New York, NY',
          salary_min: 80000,
          salary_max: 120000,
          type: 'full-time',
          status: 'active'
        },
        {
          title: 'DevOps Engineer',
          description: 'We need a DevOps engineer to help us scale our infrastructure and improve our deployment processes.',
          company: 'CloudTech Solutions',
          location: 'Remote',
          salary_min: 90000,
          salary_max: 140000,
          type: 'full-time',
          status: 'active'
        },
        {
          title: 'Marketing Intern',
          description: 'Great opportunity for marketing students to gain real-world experience in digital marketing and social media management.',
          company: 'StartupXYZ',
          location: 'Austin, TX',
          salary_min: 25000,
          salary_max: 35000,
          type: 'internship',
          status: 'active'
        },
        {
          title: 'Product Manager',
          description: 'Lead product development initiatives and work closely with engineering and design teams to deliver exceptional user experiences.',
          company: 'Innovation Labs',
          location: 'Seattle, WA',
          salary_min: 100000,
          salary_max: 150000,
          type: 'full-time',
          status: 'active'
        }
      ];

      for (const job of sampleJobs) {
        await runQuery(
          `INSERT INTO jobs (title, description, company, location, salary_min, salary_max, type, status, posted_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [job.title, job.description, job.company, job.location, job.salary_min, job.salary_max, job.type, job.status, adminUser.id]
        );
      }

      console.log(`${sampleJobs.length} sample jobs created`);
    } else {
      console.log('Sample jobs already exist');
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed(); 
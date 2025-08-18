const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database configuration for different environments
let dbPath;
let useInMemory = false;

if (process.env.NODE_ENV === 'test') {
  dbPath = path.join(__dirname, '..', 'data', 'test.db');
} else if (process.env.VERCEL) {
  // Use in-memory database for Vercel serverless functions
  dbPath = ':memory:';
  useInMemory = true;
} else {
  dbPath = path.join(__dirname, '..', 'data', 'jobboard.db');
}

// Create database instance
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database: ${dbPath}`);
  }
});

// Initialize database tables
async function initDatabase() {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        // Users table
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Jobs table
        db.run(`
          CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT NOT NULL,
            salary_min INTEGER,
            salary_max INTEGER,
            type TEXT DEFAULT 'full-time' CHECK(type IN ('full-time', 'part-time', 'contract', 'internship')),
            status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'closed')),
            posted_by INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (posted_by) REFERENCES users (id)
          )
        `);

        // Applications table
        db.run(`
          CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            cover_letter TEXT NOT NULL,
            cv_link TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'accepted', 'rejected')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs (id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(job_id, user_id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating tables:', err.message);
            reject(err);
          } else {
            console.log('Database tables created successfully');
            
            // Seed initial data if using in-memory database (Vercel)
            if (useInMemory) {
              seedInitialData().then(() => {
                console.log('Initial data seeded for Vercel deployment');
                resolve();
              }).catch((error) => {
                console.error('Error seeding data:', error);
                // Don't reject, just resolve without seeding
                resolve();
              });
            } else {
              resolve();
            }
          }
        });
      });
    } catch (error) {
      console.error('Error in initDatabase:', error);
      reject(error);
    }
  });
}

// Seed initial data for Vercel deployment
async function seedInitialData() {
  try {
    const bcrypt = require('bcryptjs');
    
    // Check if admin user already exists
    const existingAdmin = await getRow('SELECT id FROM users WHERE email = ?', ['admin@example.com']);
    
    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await runQuery(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        ['admin@example.com', hashedPassword, 'Admin User', 'admin']
      );
      console.log('Admin user created: admin@example.com / admin123');
    }

    // Check if sample jobs exist
    const existingJobs = await getAll('SELECT COUNT(*) as count FROM jobs');
    if (existingJobs[0].count === 0) {
      // Create sample jobs
      const sampleJobs = [
        {
          title: 'Senior Software Engineer',
          description: 'We are looking for a talented Senior Software Engineer to join our team...',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          salary_min: 120000,
          salary_max: 180000,
          type: 'full-time',
          status: 'active'
        },
        {
          title: 'Frontend Developer',
          description: 'Join our frontend team to build amazing user experiences...',
          company: 'Web Solutions',
          location: 'Remote',
          salary_min: 80000,
          salary_max: 120000,
          type: 'full-time',
          status: 'active'
        },
        {
          title: 'UX Designer',
          description: 'Help us create beautiful and intuitive user interfaces...',
          company: 'Design Studio',
          location: 'New York, NY',
          salary_min: 70000,
          salary_max: 110000,
          type: 'full-time',
          status: 'active'
        }
      ];

      for (const job of sampleJobs) {
        await runQuery(
          `INSERT INTO jobs (title, description, company, location, salary_min, salary_max, type, status, posted_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [job.title, job.description, job.company, job.location, job.salary_min, job.salary_max, job.type, job.status, 1]
        );
      }
      console.log('Sample jobs created');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
    // Don't throw, just log the error
  }
}

// Helper function to run queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      db.run(sql, params, function(err) {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    } catch (error) {
      console.error('Error in runQuery:', error);
      reject(error);
    }
  });
}

// Helper function to get single row
function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Database getRow error:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    } catch (error) {
      console.error('Error in getRow:', error);
      reject(error);
    }
  });
}

// Helper function to get multiple rows
function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Database getAll error:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      reject(error);
    }
  });
}

module.exports = {
  db,
  initDatabase,
  runQuery,
  getRow,
  getAll
}; 
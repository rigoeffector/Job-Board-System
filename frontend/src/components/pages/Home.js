import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobsRequest } from '../../store/actions';
import JobCard from '../jobs/JobCard';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    dispatch(fetchJobsRequest({ limit: 6, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const featuredJobs = jobs.slice(0, 6);

  const features = [
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'AI-powered job matching with advanced filters and personalized recommendations.',
      color: '#667eea'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Seamless experience across all devices with native-like performance.',
      color: '#764ba2'
    },
    {
      icon: '⚡',
      title: 'Quick Apply',
      description: 'One-click applications with smart form auto-fill and instant tracking.',
      color: '#f093fb'
    },
    {
      icon: '🏢',
      title: 'Top Companies',
      description: 'Direct connections with Fortune 500 companies and innovative startups.',
      color: '#4facfe'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section with Parallax */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-particles"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="hero-title-line">Find Your</span>
                <span className="hero-title-line highlight">Dream Job</span>
              </h1>
              <p className="hero-subtitle">
                Discover thousands of opportunities with AI-powered matching. 
                Your future career starts here.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Active Jobs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Companies</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Hired</span>
                </div>
              </div>
              <div className="hero-actions">
                <Link to="/jobs" className="btn btn-primary btn-hero">
                  <span>Explore Jobs</span>
                  <svg className="btn-icon" viewBox="0 0 24 24">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </Link>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-secondary btn-hero">
                    <span>Get Started</span>
                    <svg className="btn-icon" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </Link>
                )}
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-card">
                <div className="card-header">
                  <div className="card-avatar"></div>
                  <div className="card-info">
                    <h4>Senior Developer</h4>
                    <p>TechCorp Inc.</p>
                  </div>
                  <div className="card-badge">New</div>
                </div>
                <div className="card-tags">
                  <span className="tag">React</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">Remote</span>
                </div>
                <div className="card-salary">$120K - $150K</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-line">Featured</span>
              <span className="title-line highlight">Opportunities</span>
            </h2>
            <p className="section-subtitle">
              Hand-picked jobs from top companies, updated daily
            </p>
          </div>

          {loading ? (
            <div className="jobs-loading">
              <div className="loading-cards">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="loading-card">
                    <div className="loading-shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="jobs-grid">
              {featuredJobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className="job-card-wrapper"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}

          <div className="section-footer">
            <Link to="/jobs" className="btn btn-primary btn-large">
              <span>View All Jobs</span>
              <svg className="btn-icon" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-line">Why Choose</span>
              <span className="title-line highlight">ISCO</span>
            </h2>
            <p className="section-subtitle">
              Built for the modern job seeker with cutting-edge technology
            </p>
          </div>

          <div className="features-showcase">
            <div className="features-content">
              <div className="feature-info">
                <div className="feature-icon" style={{ backgroundColor: features[currentFeature].color }}>
                  {features[currentFeature].icon}
                </div>
                <h3>{features[currentFeature].title}</h3>
                <p>{features[currentFeature].description}</p>
              </div>
              <div className="feature-visual">
                <div className="feature-demo">
                  <div className="demo-screen">
                    <div className="demo-header">
                      <div className="demo-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="demo-content">
                      <div className="demo-search">
                        <div className="search-bar">
                          <span className="search-icon">🔍</span>
                          <span className="search-text">Search jobs...</span>
                        </div>
                      </div>
                      <div className="demo-results">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="demo-result-item">
                            <div className="demo-result-avatar"></div>
                            <div className="demo-result-info">
                              <div className="demo-result-title"></div>
                              <div className="demo-result-company"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="features-nav">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`feature-nav-item ${index === currentFeature ? 'active' : ''}`}
                  onClick={() => setCurrentFeature(index)}
                  style={{ '--feature-color': feature.color }}
                >
                  <span className="nav-icon">{feature.icon}</span>
                  <span className="nav-title">{feature.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of professionals who found their dream jobs with ISCO</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/jobs" className="btn btn-outline btn-large">
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
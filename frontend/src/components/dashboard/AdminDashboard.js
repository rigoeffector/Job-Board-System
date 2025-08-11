import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobsRequest, fetchApplicationsRequest } from '../../store/actions';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { applications, loading: appsLoading } = useSelector((state) => state.applications);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  useEffect(() => {
    dispatch(fetchJobsRequest());
    dispatch(fetchApplicationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (jobs.length > 0 || applications.length > 0) {
      const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length
      };
      setStats(stats);
    }
  }, [jobs, applications]);

  const recentJobs = jobs.slice(0, 5);
  const recentApplications = applications.slice(0, 5);

  const getJobStatusBadge = (status) => {
    const statusMap = {
      active: { class: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { class: 'bg-yellow-100 text-yellow-800', text: 'Inactive' },
      closed: { class: 'bg-red-100 text-red-800', text: 'Closed' }
    };
    return statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: status };
  };

  const getApplicationStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      accepted: { class: 'bg-green-100 text-green-800', text: 'Accepted' },
      rejected: { class: 'bg-red-100 text-red-800', text: 'Rejected' },
      withdrawn: { class: 'bg-gray-100 text-gray-800', text: 'Withdrawn' }
    };
    return statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: status };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard 👨‍💼
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || 'Admin'}. Here's your overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💼</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Job Postings</h2>
                <Link 
                  to="/admin/jobs" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Manage Jobs
                </Link>
              </div>
            </div>
            <div className="p-6">
              {jobsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`badge ${getJobStatusBadge(job.status).class}`}>
                          {getJobStatusBadge(job.status).text}
                        </span>
                        <Link 
                          to={`/admin/jobs/${job.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">💼</span>
                  <p className="text-gray-600 mb-4">No jobs posted yet</p>
                  <Link to="/admin/jobs/create" className="btn btn-primary">
                    Create Job
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                <Link 
                  to="/admin/applications" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Manage Applications
                </Link>
              </div>
            </div>
            <div className="p-6">
              {appsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{application.job_title}</h3>
                        <p className="text-sm text-gray-600">{application.applicant_name}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`badge ${getApplicationStatusBadge(application.status).class}`}>
                          {getApplicationStatusBadge(application.status).text}
                        </span>
                        <Link 
                          to={`/admin/applications/${application.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📝</span>
                  <p className="text-gray-600">No applications received yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/jobs/create" 
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl mb-3 block">➕</span>
              <h3 className="font-medium text-gray-900 mb-2">Create Job</h3>
              <p className="text-sm text-gray-600">Post a new job listing</p>
            </Link>
            
            <Link 
              to="/admin/jobs" 
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl mb-3 block">📋</span>
              <h3 className="font-medium text-gray-900 mb-2">Manage Jobs</h3>
              <p className="text-sm text-gray-600">Edit and manage job postings</p>
            </Link>
            
            <Link 
              to="/admin/applications" 
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl mb-3 block">👥</span>
              <h3 className="font-medium text-gray-900 mb-2">Review Applications</h3>
              <p className="text-sm text-gray-600">Review and manage applications</p>
            </Link>
            
            <Link 
              to="/profile" 
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl mb-3 block">⚙️</span>
              <h3 className="font-medium text-gray-900 mb-2">Settings</h3>
              <p className="text-sm text-gray-600">Manage account settings</p>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">API Server: Online</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Database: Connected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">File Storage: Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobsRequest, fetchApplicationsRequest } from '../../store/actions';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { applications, loading: appsLoading } = useSelector((state) => state.applications);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  });

  useEffect(() => {
    dispatch(fetchJobsRequest({ limit: 5, status: 'active' }));
    dispatch(fetchApplicationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (applications.length > 0) {
      const stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        acceptedApplications: applications.filter(app => app.status === 'accepted').length,
        rejectedApplications: applications.filter(app => app.status === 'rejected').length
      };
      setStats(stats);
    }
  }, [applications]);

  const recentJobs = jobs.slice(0, 3);
  const recentApplications = applications.slice(0, 3);

  const getStatusBadge = (status) => {
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
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.acceptedApplications}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejectedApplications}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                <Link 
                  to="/applications" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
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
                      <div>
                        <h3 className="font-medium text-gray-900">{application.job_title}</h3>
                        <p className="text-sm text-gray-600">{application.company}</p>
                      </div>
                      <span className={`badge ${getStatusBadge(application.status).class}`}>
                        {getStatusBadge(application.status).text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📝</span>
                  <p className="text-gray-600 mb-4">No applications yet</p>
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Job Opportunities */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Job Opportunities</h2>
                <Link 
                  to="/jobs" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
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
                    <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                        </span>
                        <Link 
                          to={`/jobs/${job.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">💼</span>
                  <p className="text-gray-600">No recent jobs available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/jobs" 
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl mb-3 block">🔍</span>
              <h3 className="font-medium text-gray-900 mb-2">Browse Jobs</h3>
              <p className="text-sm text-gray-600">Find new opportunities</p>
            </Link>
            
            <Link 
              to="/applications" 
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl mb-3 block">📋</span>
              <h3 className="font-medium text-gray-900 mb-2">My Applications</h3>
              <p className="text-sm text-gray-600">Track your applications</p>
            </Link>
            
            <Link 
              to="/profile" 
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl mb-3 block">👤</span>
              <h3 className="font-medium text-gray-900 mb-2">Update Profile</h3>
              <p className="text-sm text-gray-600">Manage your information</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 
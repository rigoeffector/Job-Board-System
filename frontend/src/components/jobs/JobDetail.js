import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobRequest } from '../../store/actions';

const JobDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentJob, loading } = useSelector((state) => state.jobs);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobRequest(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💼</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Job Not Found</h3>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { text: 'Active', class: 'bg-green-100 text-green-800', icon: '🟢' },
      inactive: { text: 'Inactive', class: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
      closed: { text: 'Closed', class: 'bg-red-100 text-red-800', icon: '🔴' },
    };
    return statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800', icon: '⚪' };
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      'full-time': { text: 'Full Time', class: 'bg-blue-100 text-blue-800', icon: '💼' },
      'part-time': { text: 'Part Time', class: 'bg-cyan-100 text-cyan-800', icon: '⏰' },
      'contract': { text: 'Contract', class: 'bg-green-100 text-green-800', icon: '📋' },
      'internship': { text: 'Internship', class: 'bg-yellow-100 text-yellow-800', icon: '🎓' },
    };
    return typeMap[type] || { text: type, class: 'bg-gray-100 text-gray-800', icon: '💼' };
  };

  const statusBadge = getStatusBadge(currentJob.status);
  const typeBadge = getTypeBadge(currentJob.type);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/jobs" className="hover:text-primary-600 transition-colors">
                Jobs
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-900">{currentJob.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {currentJob.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {currentJob.title}
                      </h1>
                      <p className="text-lg text-gray-600 font-medium">{currentJob.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.class}`}>
                      <span className="mr-1">{statusBadge.icon}</span>
                      {statusBadge.text}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeBadge.class}`}>
                      <span className="mr-1">{typeBadge.icon}</span>
                      {typeBadge.text}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>{currentJob.location}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                    </svg>
                    <span className="font-medium">{formatSalary(currentJob.salary_min, currentJob.salary_max)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>Posted {new Date(currentJob.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-wrap">{currentJob.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this position</h3>
              
              {currentJob.status === 'active' ? (
                isAuthenticated ? (
                  <Link 
                    to={`/jobs/${currentJob.id}/apply`}
                    className="btn btn-primary w-full mb-4"
                  >
                    Apply Now
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      You need to be signed in to apply for this position.
                    </p>
                    <Link 
                      to="/login"
                      className="btn btn-primary w-full"
                    >
                      Sign In to Apply
                    </Link>
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-2">This position is no longer accepting applications.</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.class}`}>
                    <span className="mr-1">{statusBadge.icon}</span>
                    {statusBadge.text}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Applications received</span>
                  <span className="font-medium">{Math.floor(Math.random() * 50) + 5}</span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About {currentJob.company}</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>{currentJob.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>Posted {new Date(currentJob.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
              <p className="text-sm text-gray-600">
                More opportunities from {currentJob.company} and similar companies coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 
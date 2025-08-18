import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicationRequest } from '../../store/actions';

const ApplicationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentApplication, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationRequest(id));
    }
  }, [dispatch, id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pending', icon: '⏳' },
      accepted: { class: 'bg-green-100 text-green-800', text: 'Accepted', icon: '✅' },
      rejected: { class: 'bg-red-100 text-red-800', text: 'Rejected', icon: '❌' },
      withdrawn: { class: 'bg-gray-100 text-gray-800', text: 'Withdrawn', icon: '↩️' }
    };
    return statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: status, icon: '❓' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} RWF`;
    if (min) return `From ${min.toLocaleString()} RWF`;
    if (max) return `Up to ${max.toLocaleString()} RWF`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!currentApplication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-4 block">❌</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-4">The application you're looking for doesn't exist or has been removed.</p>
          <Link to="/applications" className="btn btn-primary">
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(currentApplication.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
              <p className="text-gray-600 mt-2">
                Application for {currentApplication.job?.title || currentApplication.job_title || 'Unknown Job'} at {currentApplication.job?.company || currentApplication.company || 'Unknown Company'}
              </p>
            </div>
            <Link 
              to="/applications"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
              Back to Applications
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Status Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status</h2>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.class}`}>
                      <span className="mr-2">{statusBadge.icon}</span>
                      {statusBadge.text}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Applied on:</span>
                      <p className="font-medium">{formatDate(currentApplication.created_at)}</p>
                    </div>
                    
                    {currentApplication.updated_at && currentApplication.updated_at !== currentApplication.created_at && (
                      <div>
                        <span className="text-gray-600">Last updated:</span>
                        <p className="font-medium">{formatDate(currentApplication.updated_at)}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-gray-600">Application ID:</span>
                      <p className="font-medium font-mono">#{currentApplication.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Job Details */}
              <div className="card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{currentApplication.job?.title || currentApplication.job_title || 'Unknown Job'}</h3>
                      <p className="text-gray-600">{currentApplication.job?.company || currentApplication.company || 'Unknown Company'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">{currentApplication.job?.location || currentApplication.job_location || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <p className="font-medium capitalize">{currentApplication.job?.type || currentApplication.job_type || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Salary:</span>
                        <p className="font-medium text-green-600">
                          {formatSalary(currentApplication.job?.salary_min || currentApplication.job_salary_min, currentApplication.job?.salary_max || currentApplication.job_salary_max)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Cover Letter</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {currentApplication.cover_letter}
                    </p>
                  </div>
                </div>
              </div>

              {/* CV Link */}
              <div className="card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">CV/Resume</h2>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    </svg>
                    <a 
                      href={currentApplication.cv_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium break-all"
                    >
                      {currentApplication.cv_link}
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                  <div className="flex space-x-3">
                    <Link 
                      to={`/jobs/${currentApplication.job?.id || currentApplication.job_id}`}
                      className="btn btn-primary"
                    >
                      View Job Details
                    </Link>
                    <Link 
                      to="/applications"
                      className="btn btn-secondary"
                    >
                      Back to Applications
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail; 
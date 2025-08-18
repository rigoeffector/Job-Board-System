import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { submitApplicationRequest, fetchJobRequest } from '../../store/actions';
import { useNotification } from '../../contexts/NotificationContext';

const ApplicationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { loading, error } = useSelector((state) => state.applications);
  const { currentJob: job, loading: jobLoading } = useSelector((state) => state.jobs);
  const { applications, loading: appLoading } = useSelector((state) => state.applications);
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    cover_letter: '',
    cv_link: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobRequest(jobId));
    }
  }, [dispatch, jobId]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cover_letter.trim()) {
      newErrors.cover_letter = 'Cover letter is required';
    } else if (formData.cover_letter.trim().length < 50) {
      newErrors.cover_letter = 'Cover letter must be at least 50 characters';
    }
    
    if (!formData.cv_link.trim()) {
      newErrors.cv_link = 'CV link is required';
    } else if (!isValidUrl(formData.cv_link)) {
      newErrors.cv_link = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      const applicationData = {
        job_id: parseInt(jobId),
        cover_letter: formData.cover_letter.trim(),
        cv_link: formData.cv_link.trim()
      };
      
      dispatch(submitApplicationRequest(applicationData));
    }
  };

  // Handle successful submission
  useEffect(() => {
    if (isSubmitting && !appLoading && !error) {
      // Find the newly created application (it will be at the top of the list)
      const newApplication = applications.find(app => 
        app.job?.id === job?.id || app.job_id === job?.id
      );
      
      if (newApplication) {
        showSuccess('Application submitted successfully!');
        navigate(`/applications/${newApplication.id}`);
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting, appLoading, error, applications, job?.id, showSuccess, navigate]);

  // Handle submission error
  useEffect(() => {
    if (isSubmitting && !appLoading && error) {
      setIsSubmitting(false);
    }
  }, [isSubmitting, appLoading, error]);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} RWF`;
    if (min) return `From ${min.toLocaleString()} RWF`;
    if (max) return `Up to ${max.toLocaleString()} RWF`;
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-4 block">❌</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Apply for Position</h1>
              <p className="text-gray-600 mt-2">
                Complete your application for {job.title} at {job.company}
              </p>
            </div>
            <Link 
              to={`/jobs/${job.id}`}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
              Back to Job
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="text-gray-600">{job.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-gray-600 capitalize">{job.type}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-green-600 font-medium">
                        {formatSalary(job.salary_min, job.salary_max)}
                      </span>
                    </div>
                  </div>
                  
                  {job.description && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-4">
                        {job.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Form</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cover Letter */}
                  <div>
                    <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      id="cover_letter"
                      name="cover_letter"
                      rows={8}
                      value={formData.cover_letter}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                        errors.cover_letter ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Write your cover letter here. Explain why you're interested in this position and how your skills match the requirements..."
                      disabled={appLoading || isSubmitting}
                    />
                    {errors.cover_letter && (
                      <p className="mt-1 text-sm text-red-600">{errors.cover_letter}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum 50 characters. Current: {formData.cover_letter.length}
                    </p>
                  </div>

                  {/* CV Link */}
                  <div>
                    <label htmlFor="cv_link" className="block text-sm font-medium text-gray-700 mb-2">
                      CV/Resume Link *
                    </label>
                    <input
                      type="url"
                      id="cv_link"
                      name="cv_link"
                      value={formData.cv_link}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.cv_link ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/your-cv.pdf"
                      disabled={appLoading || isSubmitting}
                    />
                    {errors.cv_link && (
                      <p className="mt-1 text-sm text-red-600">{errors.cv_link}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Provide a direct link to your CV or resume (Google Drive, Dropbox, etc.)
                    </p>
                  </div>

                  {/* Tips Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">💡 Application Tips</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Tailor your cover letter to this specific position</li>
                      <li>• Highlight relevant experience and skills</li>
                      <li>• Keep your CV/resume up to date</li>
                      <li>• Double-check all links before submitting</li>
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={appLoading || isSubmitting}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {appLoading || isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm; 
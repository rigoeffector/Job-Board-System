import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitApplicationRequest } from '../../store/actions';
import { useNotification } from '../../contexts/NotificationContext';

const JobApplicationModal = ({ job, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.applications);
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    cover_letter: '',
    cv_link: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        cover_letter: '',
        cv_link: ''
      });
      setErrors({});
    }
  }, [isOpen]);

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
      const applicationData = {
        job_id: job.id,
        cover_letter: formData.cover_letter.trim(),
        cv_link: formData.cv_link.trim()
      };
      
      dispatch(submitApplicationRequest(applicationData));
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Close modal on successful submission
  useEffect(() => {
    if (!loading && !error) {
      showSuccess('Application submitted successfully!');
      onClose();
    }
  }, [loading, error, showSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
            <p className="text-gray-600 mt-1">{job.title} at {job.company}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Job Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Position:</span>
                <p className="font-medium">{job.title}</p>
              </div>
              <div>
                <span className="text-gray-600">Company:</span>
                <p className="font-medium">{job.company}</p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium">{job.location}</p>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <p className="font-medium capitalize">{job.type}</p>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              id="cover_letter"
              name="cover_letter"
              rows={6}
              value={formData.cover_letter}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                errors.cover_letter ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Write your cover letter here. Explain why you're interested in this position and how your skills match the requirements..."
              disabled={loading}
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
              disabled={loading}
            />
            {errors.cv_link && (
              <p className="mt-1 text-sm text-red-600">{errors.cv_link}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Provide a direct link to your CV or resume (Google Drive, Dropbox, etc.)
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
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
  );
};

export default JobApplicationModal; 
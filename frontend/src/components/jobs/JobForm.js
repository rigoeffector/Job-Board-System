import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createJobRequest, updateJobRequest, fetchJobRequest, clearError } from '../../store/actions';
import { useNotification } from '../../contexts/NotificationContext';

const JobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useNotification();
  
  const { currentJob, loading, error } = useSelector((state) => state.jobs);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary_min: '',
    salary_max: '',
    type: 'full-time',
    status: 'active'
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Fetch job data if editing
  useEffect(() => {
    if (isEditing) {
      dispatch(fetchJobRequest(id));
    }
  }, [dispatch, id, isEditing]);

  // Update form data when job is loaded
  useEffect(() => {
    if (isEditing && currentJob) {
      setFormData({
        title: currentJob.title || '',
        description: currentJob.description || '',
        company: currentJob.company || '',
        location: currentJob.location || '',
        salary_min: currentJob.salary_min || '',
        salary_max: currentJob.salary_max || '',
        type: currentJob.type || 'full-time',
        status: currentJob.status || 'active'
      });
    }
  }, [currentJob, isEditing]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission success
  useEffect(() => {
    if (isSubmitting && !loading && !error) {
      if (isEditing) {
        showSuccess('Job updated successfully!');
      } else {
        showSuccess('Job created successfully!');
      }
      navigate('/admin/jobs');
      setIsSubmitting(false);
    }
  }, [isSubmitting, loading, error, isEditing, showSuccess, navigate]);

  // Handle form submission error
  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearError());
      if (isSubmitting) {
        setIsSubmitting(false);
      }
    }
  }, [error, showError, dispatch, isSubmitting]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Job title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Job description must be at least 10 characters';
    }

    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (formData.salary_min && formData.salary_max) {
      const min = parseInt(formData.salary_min);
      const max = parseInt(formData.salary_max);
      if (min > max) {
        errors.salary_max = 'Maximum salary must be greater than minimum salary';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      const jobData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        type: formData.type,
        status: formData.status
      };

      if (isEditing) {
        dispatch(updateJobRequest(id, jobData));
      } else {
        dispatch(createJobRequest(jobData));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCancel = () => {
    navigate('/admin/jobs');
  };

  if (isEditing && loading && !currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Job' : 'Create New Job'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditing ? 'Update the job details below' : 'Fill in the details to create a new job posting'}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  validationErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Senior Software Engineer"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  validationErrors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Tech Corp Inc."
              />
              {validationErrors.company && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.company}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  validationErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., San Francisco, CA or Remote"
              />
              {validationErrors.location && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
              )}
            </div>

            {/* Job Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="salary_min" className="block text-sm text-gray-600 mb-1">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    id="salary_min"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 50000"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="salary_max" className="block text-sm text-gray-600 mb-1">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    id="salary_max"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      validationErrors.salary_max ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 80000"
                    min="0"
                  />
                  {validationErrors.salary_max && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.salary_max}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={8}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the role, responsibilities, requirements, and benefits..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Job' : 'Create Job'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobForm; 
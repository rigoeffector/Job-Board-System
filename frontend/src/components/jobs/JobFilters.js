import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters, fetchJobsRequest } from '../../store/actions';
import useDebounce from '../../hooks/useDebounce';

const JobFilters = () => {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((state) => state.jobs);
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [locationValue, setLocationValue] = useState(filters.location || '');

  // Debounce the input values
  const debouncedSearch = useDebounce(searchValue, 500);
  const debouncedLocation = useDebounce(locationValue, 500);

  // Update filters when debounced values change
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFilterChange('search', debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedLocation !== filters.location) {
      handleFilterChange('location', debouncedLocation);
    }
  }, [debouncedLocation]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    dispatch(setFilters(newFilters));
    
    // Send API request with updated filters
    const apiParams = {
      page: 1, // Reset to first page when filters change
      limit: pagination.limit,
      ...newFilters
    };
    
    // Map frontend filter names to backend API parameters
    if (apiParams.search) {
      apiParams.title = apiParams.search;
      delete apiParams.search;
    }
    
    // Remove empty filter values
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
        delete apiParams[key];
      }
    });
    
    dispatch(fetchJobsRequest(apiParams));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchValue('');
    setLocationValue('');
    
    // Send API request without filters
    const apiParams = {
      page: 1,
      limit: pagination.limit
    };
    
    dispatch(fetchJobsRequest(apiParams));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Jobs
          </label>
          <input
            type="text"
            placeholder="Job title, company, or keywords..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City, state, or remote..."
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.salary_min || ''}
              onChange={(e) => handleFilterChange('salary_min', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.salary_max || ''}
              onChange={(e) => handleFilterChange('salary_max', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={filters.experience || ''}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        {/* Remote Work */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remote Work
          </label>
          <select
            value={filters.remote || ''}
            onChange={(e) => handleFilterChange('remote', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Options</option>
            <option value="remote">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site Only</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {Object.values(filters).some(value => value && value !== '') && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Search: {filters.search}
                <button
                  onClick={() => {
                    setSearchValue('');
                    handleFilterChange('search', '');
                  }}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Location: {filters.location}
                <button
                  onClick={() => {
                    setLocationValue('');
                    handleFilterChange('location', '');
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Type: {filters.type}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.salary_min || filters.salary_max) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Salary: {filters.salary_min || '0'} - {filters.salary_max || '∞'}
                <button
                  onClick={() => {
                    handleFilterChange('salary_min', '');
                    handleFilterChange('salary_max', '');
                  }}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters; 
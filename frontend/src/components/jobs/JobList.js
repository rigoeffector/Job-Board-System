import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobsRequest, setPage, clearFilters } from '../../store/actions';
import JobCard from './JobCard';
import JobFilters from './JobFilters';
import Pagination from '../common/Pagination';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, loading, pagination, filters } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobsRequest());
  }, [dispatch, pagination.currentPage, filters]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !filters.search || 
      job.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company?.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesLocation = !filters.location || 
      job.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesType = !filters.type || job.type === filters.type;
    const matchesStatus = !filters.status || job.status === filters.status;
    
    const matchesSalary = (!filters.salary_min || job.salary_min >= filters.salary_min) &&
                         (!filters.salary_max || job.salary_max <= filters.salary_max);
    
    return matchesSearch && matchesLocation && matchesType && matchesStatus && matchesSalary;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600">
            Discover thousands of job opportunities with all the information you need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <JobFilters />
            </div>
          </div>

          {/* Jobs Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                  </h2>
                  {filters.search && (
                    <p className="text-sm text-gray-600 mt-1">
                      Showing results for "{filters.search}"
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="recent">Most Recent</option>
                    <option value="salary">Highest Salary</option>
                    <option value="company">Company Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filters.search || Object.values(filters).some(v => v) ? 'No jobs found' : 'No jobs available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filters.search || Object.values(filters).some(v => v)
                    ? 'Try adjusting your search criteria or filters to find more jobs.'
                    : 'Check back later for new job opportunities.'
                  }
                </p>
                {(filters.search || Object.values(filters).some(v => v)) && (
                  <button
                    onClick={() => dispatch(clearFilters())}
                    className="btn btn-primary"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList; 
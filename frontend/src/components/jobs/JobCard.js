import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const JobCard = ({ job }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

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

  const statusBadge = getStatusBadge(job.status);
  const typeBadge = getTypeBadge(job.type);

  const timeAgo = (date) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffInHours = Math.floor((now - jobDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 cursor-pointer relative ${isHovered ? 'ring-2 ring-primary-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
      
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>
              <span className="mr-1">{statusBadge.icon}</span>
              {statusBadge.text}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadge.class}`}>
              <span className="mr-1">{typeBadge.icon}</span>
              {typeBadge.text}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="text-sm">{job.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-green-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
            <span className="text-sm font-medium">{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm">{timeAgo(job.created_at)}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {job.description.length > 120
            ? `${job.description.substring(0, 120)}...`
            : job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              <span className="mr-1">{typeBadge.icon}</span>
              {typeBadge.text}
            </span>
          )}
          {job.status === 'active' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
              <span className="mr-1">⚡</span>
              Urgent
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Link 
              to={`/jobs/${job.id}`} 
              className="btn btn-primary btn-sm"
            >
              <span>View Details</span>
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </Link>
            {isAuthenticated && job.status === 'active' && (
              <Link 
                to={`/jobs/${job.id}/apply`} 
                className="btn btn-success btn-sm"
              >
                <span>Apply Now</span>
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </Link>
            )}
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V15h-1.5v-3.5l-1.7-2.26A2.5 2.5 0 0 0 7.54 8H6.46c-.8 0-1.54.37-2.01 1L1.5 16.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.54 10H11c.8 0 1.54-.37 2.01-1l1.7-2.26V4h1.5v2.74l1.7 2.26c.47.63 1.21 1 2.01 1h1.46c.8 0 1.54-.37 2.01-1L20.5 16H22v6h2z"/>
            </svg>
            <span>{Math.floor(Math.random() * 50) + 5} applicants</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex space-x-4">
            <button className="bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>Save</span>
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard; 
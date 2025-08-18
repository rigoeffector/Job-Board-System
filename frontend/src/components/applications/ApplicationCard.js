import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ApplicationCard = ({ application }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      accepted: { text: 'Accepted', class: 'bg-green-100 text-green-800', icon: '✅' },
      rejected: { text: 'Rejected', class: 'bg-red-100 text-red-800', icon: '❌' },
      withdrawn: { text: 'Withdrawn', class: 'bg-gray-100 text-gray-800', icon: '↩️' }
    };
    return statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800', icon: '⚪' };
  };

  const statusBadge = getStatusBadge(application.status);

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-102 cursor-pointer relative ${isHovered ? 'ring-2 ring-primary-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top accent bar based on status */}
      <div className={`h-1 ${
        application.status === 'accepted' ? 'bg-green-500' :
        application.status === 'rejected' ? 'bg-red-500' :
        application.status === 'withdrawn' ? 'bg-gray-500' :
        'bg-gradient-to-r from-yellow-400 to-yellow-600'
      }`}></div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3 gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 ${
              application.status === 'accepted' ? 'bg-green-500' :
              application.status === 'rejected' ? 'bg-red-500' :
              application.status === 'withdrawn' ? 'bg-gray-500' :
              'bg-gradient-to-r from-yellow-400 to-yellow-600'
            }`}>
              {(application.job?.title || application.job_title || 'J').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors truncate">
                {application.job?.title || application.job_title || 'Unknown Job'}
              </h3>
              <p className="text-gray-600 text-sm truncate">{application.job?.company || application.company || 'Unknown Company'}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.class} transition-all duration-200 ${isHovered ? 'scale-110' : ''} flex-shrink-0`}>
            <span className="mr-1">{statusBadge.icon}</span>
            {statusBadge.text}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="truncate">Applied {new Date(application.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="truncate">{application.job?.location || application.location || 'Location not specified'}</span>
          </div>
        </div>

        {application.cover_letter && (
          <div className="mb-3">
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {application.cover_letter.length > 120
                ? `${application.cover_letter.substring(0, 120)}...`
                : application.cover_letter}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Link 
            to={`/applications/${application.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 flex items-center space-x-1 group"
          >
            <span>View Details</span>
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </Link>
          
          {application.status === 'pending' && (
            <button className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200 hover:bg-red-50 px-3 py-1 rounded-lg">
              Withdraw Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard; 
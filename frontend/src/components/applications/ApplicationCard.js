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

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg ${
              application.status === 'accepted' ? 'bg-green-500' :
              application.status === 'rejected' ? 'bg-red-500' :
              application.status === 'withdrawn' ? 'bg-gray-500' :
              'bg-gradient-to-r from-yellow-400 to-yellow-600'
            }`}>
              {application.job_title.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                {application.job_title}
              </h3>
              <p className="text-gray-600">{application.company}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.class} transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
            <span className="mr-1">{statusBadge.icon}</span>
            {statusBadge.text}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{application.location}</span>
          </div>
        </div>

        {application.cover_letter && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-3">
              {application.cover_letter.length > 150
                ? `${application.cover_letter.substring(0, 150)}...`
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

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center rounded-xl">
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

export default ApplicationCard; 
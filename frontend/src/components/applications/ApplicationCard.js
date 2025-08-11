import React from 'react';
import { Link } from 'react-router-dom';

const ApplicationCard = ({ application }) => {
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {application.job_title}
            </h3>
            <p className="text-gray-600">{application.company}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>
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
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Details →
          </Link>
          
          {application.status === 'pending' && (
            <button className="text-red-600 hover:text-red-700 font-medium text-sm">
              Withdraw Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard; 
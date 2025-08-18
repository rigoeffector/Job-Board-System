import React, { createContext, useContext, useState } from 'react';
import JobApplicationModal from '../components/jobs/JobApplicationModal';

const ApplicationContext = createContext();

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const openApplicationModal = (job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setSelectedJob(null);
  };

  const value = {
    selectedJob,
    isApplicationModalOpen,
    openApplicationModal,
    closeApplicationModal
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          isOpen={isApplicationModalOpen}
          onClose={closeApplicationModal}
        />
      )}
    </ApplicationContext.Provider>
  );
}; 

import React from 'react';
import type { Manager } from '../types';

interface ManagerCardProps {
  manager: Manager;
}

const EmailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const PhoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);


const ManagerCard: React.FC<ManagerCardProps> = ({ manager }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-lg shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 duration-300">
      <img
        src={manager.imageUrl}
        alt={manager.name}
        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-700 shadow-md"
      />
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{manager.name}</h3>
      <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">{manager.role}</p>
      
      <div className="text-left space-y-3 mt-6">
        <div className="flex items-center">
          <EmailIcon />
          <span className="mr-3 text-gray-600 dark:text-gray-300" style={{direction: 'ltr'}}>{manager.email}</span>
        </div>
        <div className="flex items-center">
          <PhoneIcon />
          <span className="mr-3 text-gray-600 dark:text-gray-300">{manager.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default ManagerCard;
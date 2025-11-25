
import React, { useState, useMemo } from 'react';
import type { User, Vehicle, Trip, MaintenanceRecord } from '../types';
import DriverStats from './system-admin/DriverStats';
import TripAssignment from './system-admin/TripAssignment';
import SystemAdminSidebar from './system-admin/SystemAdminSidebar';
import Settings from './admin/Settings';
import { OnlineRoutesTable } from './admin/Dashboard';
import Reports from './admin/Reports';

interface SystemAdminPanelProps {
  user: User;
  users: User[];
  vehicles: Vehicle[];
  trips: Trip[];
  maintenanceRecords: MaintenanceRecord[];
  onAddTrip: (tripData: Omit<Trip, 'id' | 'status'>) => void;
  onUpdateProfile: (userId: string, newUsername: string, newPassword?: string) => string | null;
  onUpdateTripQueue: (tripId: string, arrivalDate: Date, location: 'انبار مرکزی' | 'پاندا' | 'شهر لبنیات') => void;
}

const SystemAdminPanel: React.FC<SystemAdminPanelProps> = ({ user, users, vehicles, trips, maintenanceRecords, onAddTrip, onUpdateProfile, onUpdateTripQueue }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stats' | 'assignment' | 'reports' | 'settings'>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const viewTitles: Record<typeof activeTab, string> = {
      dashboard: 'داشبورد مدیریتی',
      stats: 'آمار رانندگان',
      assignment: 'تخصیص بار و مسیر',
      reports: 'گزارشات جامع',
      settings: 'تنظیمات سیستم',
  };

  // Calculate Live Stats
  const stats = useMemo(() => {
    return {
        // Drivers waiting (Vehicles available and assigned to a driver)
        inQueue: vehicles.filter(v => v.status === 'در دسترس' && v.driverId).length,
        // Drivers assigned cargo (Trips planned but not started/completed yet)
        assigned: trips.filter(t => t.status === 'برنامه ریزی شده').length,
        // Drivers en route (Trips in progress)
        enRoute: trips.filter(t => t.status === 'در حال انجام').length,
    };
  }, [vehicles, trips]);

  return (
    <div className="flex h-full">
        <SystemAdminSidebar
            activeView={activeTab}
            setActiveView={setActiveTab}
            isOpen={isSidebarOpen}
            setOpen={setSidebarOpen}
            stats={stats}
        />
        
        <div className="flex-1 flex flex-col w-full">
            <header className="lg:hidden bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-sm p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold dark:text-gray-100">{viewTitles[activeTab]}</h2>
                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 dark:text-gray-400 focus:outline-none focus:text-gray-700 dark:focus:text-gray-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </header>
            
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-y-auto">
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border dark:border-gray-700 flex flex-col items-center justify-center text-center">
                            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-6 rounded-full mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">داشبورد مدیریت سیستم</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">
                                به پنل مدیریت کل خوش آمدید. از منوی سمت راست برای دسترسی به آمار رانندگان و تخصیص بار استفاده کنید.
                            </p>
                        </div>
                        
                        <OnlineRoutesTable trips={trips} vehicles={vehicles} users={users} onUpdateQueue={onUpdateTripQueue} />
                    </div>
                )}
                
                {activeTab === 'stats' && (
                    <DriverStats users={users} trips={trips} vehicles={vehicles} />
                )}

                {activeTab === 'assignment' && (
                    <TripAssignment users={users} vehicles={vehicles} trips={trips} onAddTrip={onAddTrip} />
                )}

                {activeTab === 'reports' && (
                    <Reports users={users} vehicles={vehicles} trips={trips} maintenanceRecords={maintenanceRecords} />
                )}

                {activeTab === 'settings' && (
                     <Settings user={user} onUpdateProfile={onUpdateProfile} />
                )}
            </main>
        </div>
    </div>
  );
};

export default SystemAdminPanel;

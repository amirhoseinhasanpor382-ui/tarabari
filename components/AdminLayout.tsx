import React, { useState } from 'react';
import type { User, Manager, Request, Log, Vehicle, Trip, MaintenanceRecord, Alert } from '../types';
import Sidebar from './admin/Sidebar';
import Dashboard from './admin/Dashboard';
import UserManagement from './admin/UserManagement';
import Settings from './admin/Settings';
import ManagerCard from './ManagerCard';
import RequestsManagement from './admin/RequestsManagement';
import Reports from './admin/Reports';
import Alerts from './admin/Alerts';
import VehicleManagement from './admin/VehicleManagement';

type AdminView = 'dashboard' | 'users' | 'settings' | 'managerDetails' | 'requests' | 'reports' | 'alerts' | 'vehicles';

interface AdminLayoutProps {
  loggedInUser: User;
  users: User[];
  onAddUser: (username: string, password: string) => string | null;
  onChangePassword: (userId: string, newPassword: string) => string | null;
  requests: Request[];
  onProcessRequest: (requestId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onFinalizeRequest: (requestId: string) => void;
  onUpdateProfile: (userId: string, newUsername: string, newPassword?: string) => string | null;
  logs: Log[];
  vehicles: Vehicle[];
  trips: Trip[];
  maintenanceRecords: MaintenanceRecord[];
  onAddMaintenanceRecord: (vehicleId: string, serviceType: string, cost: number, date: Date) => void;
  onAddVehicle: (code: string, type: string, plateNumber: string) => string | null;
  alerts: Alert[];
  onAddAlert: (title: string, message: string, target: 'همه کاربران' | 'همه مدیران' | 'کاربران خاص', targetUsernames?: string[]) => void;
  onAssignVehicle: (userId: string, vehicleId: string | null) => void;
}

const initialManagers: Manager[] = [
    {
      id: 'm1',
      name: 'علیرضا محمدی',
      role: 'مدیر ارشد',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      email: 'alireza.m@example.com',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
    },
    {
      id: 'm2',
      name: 'مریم رضایی',
      role: 'مدیر عملیات',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      email: 'maryam.r@example.com',
      phone: '۰۹۱۲۹۸۷۶۵۴۳',
    }
];

const AdminLayout: React.FC<AdminLayoutProps> = (props) => {
  const { loggedInUser, users, requests, onUpdateProfile, onAddVehicle } = props;
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const pendingRequestsCount = requests.filter(req => req.status === 'PENDING').length;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard requestsCount={pendingRequestsCount} />;
      case 'users':
        return <UserManagement 
                    users={users.filter(u => u.role === 'USER')} 
                    onAddUser={props.onAddUser} 
                    onChangePassword={props.onChangePassword}
                    onUpdateProfile={props.onUpdateProfile}
                    onAssignVehicle={props.onAssignVehicle}
                    vehicles={props.vehicles}
                />;
      case 'settings':
        return <Settings user={loggedInUser} onUpdateProfile={onUpdateProfile} />;
      case 'managerDetails':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">جزئیات مدیران</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {initialManagers.map(manager => (
                <ManagerCard key={manager.id} manager={manager} />
              ))}
            </div>
          </div>
        );
      case 'requests':
        return <RequestsManagement requests={props.requests} onProcessRequest={props.onProcessRequest} onApproveRequest={props.onApproveRequest} onFinalizeRequest={props.onFinalizeRequest} />;
      case 'reports':
        return <Reports users={users} vehicles={props.vehicles} trips={props.trips} maintenanceRecords={props.maintenanceRecords} />;
      case 'vehicles':
        return <VehicleManagement vehicles={props.vehicles} users={users} maintenanceRecords={props.maintenanceRecords} onAddMaintenanceRecord={props.onAddMaintenanceRecord} onAddVehicle={onAddVehicle} />;
      case 'alerts':
        return <Alerts alerts={props.alerts} onAddAlert={props.onAddAlert} allUsers={users} />;
      default:
        return <Dashboard requestsCount={pendingRequestsCount} />;
    }
  };
  
  const viewTitles: Record<AdminView, string> = {
    dashboard: 'آمار',
    users: 'مدیریت کارکنان',
    settings: 'تنظیمات',
    managerDetails: 'جزئیات مدیران',
    requests: 'درخواست ها',
    reports: 'گزارشات',
    vehicles: 'مدیریت خودروها',
    alerts: 'هشدارها'
  }

  return (
    <div className="flex h-full">
       <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col w-full">
         <header className="lg:hidden bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-sm p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-gray-100">{viewTitles[activeView]}</h2>
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500 dark:text-gray-400 focus:outline-none focus:text-gray-700 dark:focus:text-gray-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 rounded-lg">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
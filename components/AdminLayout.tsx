
import React, { useState } from 'react';
import type { User, Manager, Request, Log, Vehicle, Trip, MaintenanceRecord, Alert, ServiceOrder, ServiceOrderStatus } from '../types';
import Sidebar from './admin/Sidebar';
import Dashboard from './admin/Dashboard';
import UserManagement from './admin/UserManagement';
import Settings from './admin/Settings';
import ManagerCard from './ManagerCard';
import RequestsManagement from './admin/RequestsManagement';
import Reports from './admin/Reports';
import Alerts from './admin/Alerts';
import VehicleManagement from './admin/VehicleManagement';
import WorkshopManagement from './admin/WorkshopManagement';
import AdmissionSlideOver from './admin/AdmissionSlideOver';

type AdminView = 'dashboard' | 'users' | 'settings' | 'managerDetails' | 'requests' | 'reports' | 'alerts' | 'vehicles' | 'workshop';

interface AdminLayoutProps {
  loggedInUser: User;
  users: User[];
  onAddUser: (username: string, password: string, role: 'USER' | 'WORKSHOP', personnelCode: string, phone: string) => string | null;
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
  serviceOrders: ServiceOrder[];
  onAddServiceOrder: (vehicleId: string, issueDescription: string) => void;
  onUpdateServiceOrder: (orderId: string, newStatus: ServiceOrderStatus, notes?: string) => void;
  hasUnreadAlerts: boolean;
  onViewAdminAlerts: () => void;
  onUpdateTripQueue?: (tripId: string, arrivalDate: Date, location: 'انبار مرکزی' | 'پاندا' | 'شهر لبنیات') => void;
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
  const { loggedInUser, users, requests, onUpdateProfile, onAddVehicle, hasUnreadAlerts, onViewAdminAlerts, onUpdateTripQueue } = props;
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmissionOpen, setAdmissionOpen] = useState(false);
  
  const handleSetActiveView = (view: AdminView) => {
    if (view === 'alerts') {
      onViewAdminAlerts();
    }
    setActiveView(view);
  };

  const pendingRequestsCount = requests.filter(req => req.status === 'PENDING').length;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            requestsCount={pendingRequestsCount} 
            trips={props.trips}
            vehicles={props.vehicles}
            users={props.users}
            onUpdateTripQueue={onUpdateTripQueue}
          />
        );
      case 'users':
        return <UserManagement 
                    users={users.filter(u => u.role !== 'ADMIN')} 
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
      case 'workshop': {
        const handleAddServiceOrder = (vehicleId: string, issueDescription: string) => {
          props.onAddServiceOrder(vehicleId, issueDescription);
          setAdmissionOpen(false);
        };
        const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (iconProps) => (
            <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        );
        return (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setAdmissionOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center transform hover:-translate-y-0.5"
                aria-label="پذیرش خودرو جدید"
              >
                <PlusIcon className="w-5 h-5 ml-2" />
                <span>پذیرش خودرو جدید</span>
              </button>
            </div>
            <WorkshopManagement
              users={props.users}
              vehicles={props.vehicles}
              serviceOrders={props.serviceOrders}
              onUpdateServiceOrder={props.onUpdateServiceOrder}
            />
            <AdmissionSlideOver
              isOpen={isAdmissionOpen}
              onClose={() => setAdmissionOpen(false)}
              vehicles={props.vehicles}
              users={props.users}
              onAddServiceOrder={handleAddServiceOrder}
            />
          </>
        );
      }
      default:
        return (
          <Dashboard 
            requestsCount={pendingRequestsCount} 
            trips={props.trips}
            vehicles={props.vehicles}
            users={props.users}
            onUpdateTripQueue={onUpdateTripQueue}
          />
        );
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
    alerts: 'هشدارها',
    workshop: 'تعمیرگاه'
  }

  return (
    <div className="flex h-full">
      {/* In RTL mode, the first flex item (Sidebar) will be on the right */}
      <Sidebar
          activeView={activeView}
          setActiveView={handleSetActiveView}
          isOpen={isSidebarOpen}
          setOpen={setSidebarOpen}
          hasUnreadAlerts={hasUnreadAlerts}
        />
        
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
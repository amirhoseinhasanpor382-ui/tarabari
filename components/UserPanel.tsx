
import React, { useState, useMemo } from 'react';
import type { User, Request, Alert as AlertType, Vehicle, MaintenanceRecord, ServiceOrder, ServiceOrderStatus, Trip } from '../types';
import { ServiceOrderStatuses } from '../types';

type RequestType = 'مرخصی' | 'کارت سوخت' | 'ترفیع';
type RequestRecipient = 'مدیریت' | 'مدیر 1' | 'مدیر 2';
type MenuView = 'requests' | 'newRequest' | 'settings' | 'alerts' | 'reports' | 'trips';

interface UserPanelProps {
  user: User;
  onAddRequest: (newRequestData: Omit<Request, 'id' | 'username' | 'status'>) => void;
  userRequests: Request[];
  onUpdateProfile: (userId: string, newUsername: string, newPassword?: string) => string | null;
  alerts: AlertType[];
  assignedVehicle?: Vehicle;
  maintenanceRecords: MaintenanceRecord[];
  activeServiceOrder?: ServiceOrder;
  userTrips: Trip[];
}

const requestTypes: RequestType[] = ['مرخصی', 'کارت سوخت', 'ترفیع'];
const requestRecipients: RequestRecipient[] = ['مدیریت', 'مدیر 1', 'مدیر 2'];

// --- SVG Icons ---
const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);
const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4-2H5M17 16l-4-4" />
  </svg>
);
const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const MapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
);
const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);
const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
);

const WrenchScrewdriverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17l-4.242-4.242a2.652 2.652 0 010-3.75l4.242-4.242a2.652 2.652 0 013.75 0l4.242 4.242a2.652 2.652 0 010 3.75l-4.242 4.242M11.42 15.17L15.17 11.42" />
    </svg>
);


const Alert: React.FC<{ message: string; type: 'error' | 'success'; onClose: () => void }> = ({ message, type, onClose }) => {
    const colors = {
        error: 'bg-red-100 border-red-400 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300',
        success: 'bg-green-100 border-green-400 text-green-700 dark:bg-green-500/10 dark:border-green-500/30 dark:text-green-300',
    };
    return (
        <div className={`border px-4 py-3 rounded-lg relative mb-4 ${colors[type]}`} role="alert">
            <span className="block sm:inline">{message}</span>
            <button onClick={onClose} className="absolute top-0 bottom-0 left-0 px-4 py-3">
                <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>بستن</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
        </div>
    );
};

const FormRow: React.FC<{ label: string; htmlFor: string; children: React.ReactNode }> = ({ label, htmlFor, children }) => (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {children}
    </div>
);

const SettingsView: React.FC<{ user: User, onUpdateProfile: UserPanelProps['onUpdateProfile'] }> = ({ user, onUpdateProfile }) => {
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        if (password !== confirmPassword) {
            setError('رمزهای عبور با یکدیگر مطابقت ندارند.');
            return;
        }

        const result = onUpdateProfile(user.id, username, password || undefined);
        if (result) {
            setError(result);
        } else {
            setSuccess('اطلاعات حساب کاربری با موفقیت به‌روزرسانی شد.');
            setPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 px-1">تنظیمات حساب کاربری</h4>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
              {success && <Alert message={success} type="success" onClose={() => setSuccess(null)} />}
              <form onSubmit={handleSubmit} className="space-y-6">
                  <FormRow label="نام کاربری" htmlFor="username">
                      <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                  </FormRow>
                  <FormRow label="رمز عبور جدید (اختیاری)" htmlFor="password">
                      <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="برای تغییر، رمز جدید را وارد کنید"
                      />
                  </FormRow>
                  <FormRow label="تکرار رمز عبور جدید" htmlFor="confirmPassword">
                      <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="رمز عبور جدید را تکرار کنید"
                      />
                  </FormRow>
                  <div>
                      <button
                          type="submit"
                          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                      >
                          ذخیره تغییرات
                      </button>
                  </div>
              </form>
            </div>
        </div>
    );
}

const getVehicleStatusBadge = (status: Vehicle['status']) => {
  switch (status) {
    case 'در مسیر':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">در مسیر</span>;
    case 'در دسترس':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300">در دسترس</span>;
    case 'در دست تعمیر':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300">در دست تعمیر</span>;
    default:
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">{status}</span>;
  }
};

const RepairStatusTracker: React.FC<{ serviceOrder: ServiceOrder }> = ({ serviceOrder }) => {
    const currentStatusIndex = ServiceOrderStatuses.indexOf(serviceOrder.status);

    return (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center">
                <WrenchScrewdriverIcon className="w-6 h-6 ml-3 text-yellow-500"/>
                وضعیت تعمیرگاه
            </h4>
            <div className="space-y-4">
                <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">علت مراجعه:</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{serviceOrder.issueDescription}</p>
                </div>
                <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-300 dark:bg-gray-600" style={{ right: '1rem', zIndex: 0}}></div>
                    <ul className="space-y-8">
                        {ServiceOrderStatuses.map((status, index) => {
                            const isActive = index === currentStatusIndex;
                            const isCompleted = index < currentStatusIndex;
                            return (
                                <li key={status} className="flex items-center relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                        ${isCompleted ? 'bg-green-500' : isActive ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`
                                    }>
                                        {isCompleted ? (
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        ) : isActive ? (
                                            <div className="w-4 h-4 bg-white rounded-full"></div>
                                        ) : null}
                                    </div>
                                    <span className={`mr-4 font-medium ${isActive ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {status}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                 {serviceOrder.notes && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">یادداشت تعمیرگاه:</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{serviceOrder.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MileageTracker: React.FC<{ trips: Trip[] }> = ({ trips }) => {
    const GOAL_KM = 17000;
    const ALERT_THRESHOLD_KM = 3000;

    const { totalKm, startDate, endDate } = useMemo(() => {
        const now = new Date();
        let start = new Date(now.getFullYear(), now.getMonth(), 25);
        let end = new Date(now.getFullYear(), now.getMonth() + 1, 25);

        if (now.getDate() < 25) {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 25);
            end = new Date(now.getFullYear(), now.getMonth(), 25);
        }

        // Filter for trips completed within this cycle
        const currentCycleTrips = trips.filter(trip => {
            if (trip.status !== 'تکمیل شده' && trip.status !== 'در حال انجام') return false;
            const tripDate = new Date(trip.startDate);
            return tripDate >= start && tripDate < end;
        });

        const sum = currentCycleTrips.reduce((acc, curr) => acc + (curr.distance || 0), 0);

        return { totalKm: sum, startDate: start, endDate: end };
    }, [trips]);

    const progress = Math.min(100, (totalKm / GOAL_KM) * 100);
    const remaining = Math.max(0, GOAL_KM - totalKm);
    const isNearGoal = remaining > 0 && remaining <= ALERT_THRESHOLD_KM;
    const numberFormatter = new Intl.NumberFormat('fa-IR');

    return (
        <div className="mt-auto sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-6 pb-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-2">
                <h5 className="font-bold text-gray-800 dark:text-gray-100">هدف ماهانه (۲۵ام تا ۲۵ام)</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                   {new Date(startDate).toLocaleDateString('fa-IR')} تا {new Date(endDate).toLocaleDateString('fa-IR')}
                </span>
            </div>
            
            {isNearGoal && (
                <div className="mb-3 bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300 p-3 rounded-md flex items-center shadow-sm animate-pulse">
                    <FireIcon className="w-6 h-6 ml-2 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold text-sm">
                         عالی پیش رفتی! فقط {numberFormatter.format(remaining)} کیلومتر تا تکمیل هدف باقی مانده.
                    </span>
                </div>
            )}

            <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className={`absolute top-0 right-0 h-full transition-all duration-1000 ease-out rounded-full 
                        ${isNearGoal 
                            ? 'bg-gradient-to-l from-amber-400 to-orange-500' 
                            : 'bg-gradient-to-l from-green-400 to-green-600'
                        }`}
                    style={{ width: `${progress}%` }}
                ></div>
                 <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-white drop-shadow-md">
                    {numberFormatter.format(totalKm)} / {numberFormatter.format(GOAL_KM)} کیلومتر
                </div>
            </div>
            <div className="mt-2 text-center text-sm">
                {progress >= 100 ? (
                    <span className="text-green-600 font-bold">تبریک! هدف ماهانه شما تکمیل شد.</span>
                ) : (
                    <span className="text-gray-600 dark:text-gray-300">
                        {numberFormatter.format(remaining)} کیلومتر تا تکمیل هدف باقی مانده است.
                    </span>
                )}
            </div>
        </div>
    );
}

const UserPanel: React.FC<UserPanelProps> = ({ user, onAddRequest, userRequests, onUpdateProfile, alerts, assignedVehicle, maintenanceRecords, activeServiceOrder, userTrips }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RequestType>(requestTypes[0]);
  const [recipient, setRecipient] = useState<RequestRecipient>(requestRecipients[0]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Initialize closed
  const [activeView, setActiveView] = useState<MenuView>('requests');
  const [reportSearchTerm, setReportSearchTerm] = useState('');

  const storageKey = `lastSeenAlertId_${user.id}`;
  const [latestSeenAlertId, setLatestSeenAlertId] = useState<string | null>(() => localStorage.getItem(storageKey));

  const latestAlert = alerts.length > 0 ? alerts[0] : null;
  const hasUnread = latestAlert ? latestAlert.id !== latestSeenAlertId : false;

  const handleAlertsTabClick = () => {
      setActiveView('alerts');
      if (latestAlert) {
          localStorage.setItem(storageKey, latestAlert.id);
          setLatestSeenAlertId(latestAlert.id);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('لطفا عنوان و شرح درخواست را وارد کنید.');
      return;
    }
    onAddRequest({ title, description, type, recipient });
    setTitle('');
    setDescription('');
    setType(requestTypes[0]);
    setRecipient(requestRecipients[0]);
    setActiveView('requests'); // Switch to requests list after submission
  };
  
  const currentDate = new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const NavItem: React.FC<{
    label: React.ReactNode;
    Icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-lg text-right font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60'
      }`}
    >
      <Icon
        className={`w-6 h-6 ml-4 transition-colors duration-200 ${
          isActive
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      />
      <span className="flex-1">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'alerts':
        return (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 px-1">هشدارها</h4>
            {alerts.length > 0 ? (
                <ul className="space-y-4">
                    {alerts.map(alert => (
                        <li key={alert.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-indigo-500">
                           <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{alert.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                       ارسال شده در {new Date(alert.createdAt).toLocaleString('fa-IR')}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">از طرف: {alert.sender}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 whitespace-pre-wrap">{alert.message}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">شما هیچ هشداری ندارید.</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">هشدارهای جدید در اینجا نمایش داده می‌شوند.</p>
                </div>
            )}
        </div>
        );
      case 'requests':
        return (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 px-1">تاریخچه درخواست‌ها</h4>
            {userRequests.length > 0 ? (
                <ul className="space-y-4">
                    {userRequests.map(req => (
                        <li key={req.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-gray-800 dark:text-gray-100">{req.title}</p>
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'}`}>
                                    {req.status === 'PENDING' ? 'در انتظار' : 'تکمیل شده'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">نوع: {req.type} | گیرنده: {req.recipient}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 whitespace-pre-wrap">{req.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">شما هنوز درخواستی ثبت نکرده‌اید.</p>
                </div>
            )}
        </div>
        );
      case 'newRequest':
        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormRow label="عنوان درخواست" htmlFor="title">
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="مثال: درخواست مرخصی"
                />
                </FormRow>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormRow label="نوع درخواست" htmlFor="type">
                    <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as RequestType)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                    {requestTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </FormRow>
                <FormRow label="گیرنده" htmlFor="recipient">
                    <select
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value as RequestRecipient)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                    {requestRecipients.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </FormRow>
                </div>
                <FormRow label="شرح درخواست" htmlFor="description">
                <textarea
                    id="description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="جزئیات درخواست خود را اینجا بنویسید..."
                />
                </FormRow>
                <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                >
                    نهایی کردن و ارسال
                </button>
                </div>
            </form>
        );
      case 'settings':
        return <SettingsView user={user} onUpdateProfile={onUpdateProfile} />;
      case 'reports': {
        const filteredMaintenanceRecords = maintenanceRecords.filter(record =>
            record.serviceType.toLowerCase().includes(reportSearchTerm.toLowerCase())
        );
        const costFormatter = new Intl.NumberFormat('fa-IR');

        return (
            <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 px-1">
                    گزارش سرویس خودرو: {assignedVehicle?.type} ({assignedVehicle?.plateNumber})
                </h4>
                <div className="relative w-full mb-4">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="جستجو بر اساس نوع سرویس..."
                        value={reportSearchTerm}
                        onChange={(e) => setReportSearchTerm(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                {filteredMaintenanceRecords.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نوع سرویس</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">هزینه (تومان)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredMaintenanceRecords.map(record => (
                                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(record.date).toLocaleDateString('fa-IR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{record.serviceType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{costFormatter.format(record.cost)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">
                            {reportSearchTerm ? 'سرویسی با این مشخصات یافت نشد.' : 'تاریخچه سرویسی برای خودروی شما ثبت نشده است.'}
                        </p>
                    </div>
                )}
            </div>
        );
      }
      case 'trips':
          return (
              <div className="flex flex-col h-full">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 px-1">لیست سفرها و کارکرد</h4>
                  <div className="flex-1 overflow-y-auto mb-6">
                      {userTrips.length > 0 ? (
                          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                                      <tr>
                                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مسیر</th>
                                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ</th>
                                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نوع بار</th>
                                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مسافت (Km)</th>
                                      </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                      {userTrips.map(trip => (
                                          <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{trip.origin} به {trip.destination}</td>
                                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(trip.startDate).toLocaleDateString('fa-IR')}</td>
                                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${trip.cargoType === 'بستنی' ? 'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'}`}>
                                                      {trip.cargoType || 'نامشخص'}
                                                  </span>
                                              </td>
                                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 ltr">{trip.distance ? trip.distance.toLocaleString('fa-IR') : '-'}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      ) : (
                          <div className="text-center py-10">
                              <p className="text-gray-500 dark:text-gray-400">هیچ سفری برای نمایش وجود ندارد.</p>
                          </div>
                      )}
                  </div>
                  <MileageTracker trips={userTrips} />
              </div>
          );
      default:
        return null;
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Side Menu Panel */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 dark:border-l dark:border-gray-700 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">پنل کاربری</h3>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <CloseIcon />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-1 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <NavItem label={
                    <span className="relative">
                        هشدارها
                        {hasUnread && <span className="absolute -top-1 -right-2 text-red-500 text-2xl leading-none">*</span>}
                    </span>
                } Icon={BellIcon} isActive={activeView === 'alerts'} onClick={handleAlertsTabClick} />
                <NavItem label="مسیرها (کیلومترشمار)" Icon={MapIcon} isActive={activeView === 'trips'} onClick={() => setActiveView('trips')} />
                <NavItem label="درخواست‌های من" Icon={ClipboardListIcon} isActive={activeView === 'requests'} onClick={() => setActiveView('requests')} />
                <NavItem label="درخواست جدید" Icon={PlusIcon} isActive={activeView === 'newRequest'} onClick={() => setActiveView('newRequest')} />
                {assignedVehicle && (
                   <NavItem label="گزارش سرویس" Icon={DocumentTextIcon} isActive={activeView === 'reports'} onClick={() => { setActiveView('reports'); setReportSearchTerm(''); }} />
                )}
                <NavItem label="تنظیمات" Icon={CogIcon} isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
            </nav>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {renderContent()}
            </div>
         </div>
      </aside>

      {/* Main Dashboard View */}
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    داشبورد کاربری
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg flex items-center">
                    <CalendarIcon />
                    <span className="mr-2">{currentDate}</span>
                </p>
            </div>
            <button
                onClick={() => setIsMenuOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mt-4 sm:mt-0 transform hover:-translate-y-0.5"
                aria-label="باز کردن پنل کاربری"
            >
                <MenuIcon />
                <span>مشاهده پنل</span>
            </button>
        </div>
        
        <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                خوش آمدید, <span className="text-indigo-600 dark:text-indigo-400">{user.username}</span>!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                اینجا داشبورد شماست. برای ثبت درخواست جدید، مشاهده تاریخچه درخواست‌ها یا تغییر تنظیمات، از دکمه <strong>مشاهده پنل</strong> در بالا استفاده کنید.
                {hasUnread && <span className="block mt-2 font-semibold text-red-600 dark:text-red-400">شما یک هشدار جدید دارید!</span>}
            </p>
            
            {assignedVehicle && activeServiceOrder ? (
                 <RepairStatusTracker serviceOrder={activeServiceOrder} />
            ) : assignedVehicle ? (
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                    <TruckIcon className="w-6 h-6 ml-3 text-indigo-500"/>
                    وضعیت خودروی شما
                </h4>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">نوع خودرو:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">{assignedVehicle.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">کد خودرو:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">{assignedVehicle.code}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">شماره پلاک:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">{assignedVehicle.plateNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">وضعیت فعلی:</span>
                        {getVehicleStatusBadge(assignedVehicle.status)}
                    </div>
                </div>
              </div>
            ) : null}

        </div>
      </div>
    </>
  );
};

export default UserPanel;

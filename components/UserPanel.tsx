import React, { useState } from 'react';
import type { User, Request, Alert as AlertType, Vehicle, MaintenanceRecord } from '../types';

type RequestType = 'مرخصی' | 'کارت سوخت' | 'ترفیع';
type RequestRecipient = 'مدیریت' | 'مدیر 1' | 'مدیر 2';
type MenuView = 'requests' | 'newRequest' | 'settings' | 'alerts' | 'reports';

interface UserPanelProps {
  user: User;
  onAddRequest: (newRequestData: Omit<Request, 'id' | 'username' | 'status'>) => void;
  userRequests: Request[];
  onUpdateProfile: (userId: string, newUsername: string, newPassword?: string) => string | null;
  alerts: AlertType[];
  assignedVehicle?: Vehicle;
  maintenanceRecords: MaintenanceRecord[];
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
const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
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


const UserPanel: React.FC<UserPanelProps> = ({ user, onAddRequest, userRequests, onUpdateProfile, alerts, assignedVehicle, maintenanceRecords }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RequestType>(requestTypes[0]);
  const [recipient, setRecipient] = useState<RequestRecipient>(requestRecipients[0]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            {assignedVehicle && (
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
            )}
        </div>
      </div>
    </>
  );
};

export default UserPanel;

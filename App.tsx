import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import UserPanel from './components/UserPanel';
import LoginPage from './components/LoginPage';
import type { User, Request, Log, Vehicle, Trip, MaintenanceRecord, Alert, ServiceOrder, ServiceOrderStatus } from './types';
import WorkshopPanel from './components/WorkshopPanel';

// Initial data for demonstration
const initialUsers: User[] = [
  { id: '1', username: 'admin', password: 'password', role: 'ADMIN', personnelCode: '1000', phone: '09120000000', registrationDate: new Date('2023-01-01T10:00:00Z'), lastLogin: null },
  { id: '2', username: 'user1', password: 'password', role: 'USER', personnelCode: '1001', phone: '09121111111', registrationDate: new Date('2023-02-15T11:20:00Z'), lastLogin: null },
  { id: '3', username: 'user2', password: 'password', role: 'USER', personnelCode: '1002', phone: '09122222222', registrationDate: new Date('2023-03-20T09:05:00Z'), lastLogin: new Date('2024-05-10T15:30:00Z') },
  { id: '4', username: 'تعمیرکار', password: 'password', role: 'WORKSHOP', personnelCode: '2001', phone: '09123333333', registrationDate: new Date('2024-07-21T09:00:00Z'), lastLogin: null },
];

const initialRequests: Request[] = [
    { id: 'r1', username: 'user1', title: 'درخواست مرخصی', description: 'برای تاریخ ۱۴۰۳/۰۵/۱۰ به دلیل مسائل شخصی.', type: 'مرخصی', recipient: 'مدیریت', status: 'PENDING' },
    { id: 'r2', username: 'user1', title: 'درخواست کارت سوخت', description: 'کارت سوخت فعلی مفقود شده است.', type: 'کارت سوخت', recipient: 'مدیر 1', status: 'COMPLETED' },
    { id: 'r3', username: 'user2', title: 'درخواست ترفیع شغلی', description: 'با توجه به سابقه ۵ ساله و عملکرد مثبت.', type: 'ترفیع', recipient: 'مدیر 2', status: 'APPROVED' },
];

const initialVehicles: Vehicle[] = [
  { id: 'v1', code: 'TR-101', type: 'اسکانیا R450', plateNumber: '۱۱ع۱۲۳ایران۴۴', driverId: '2', status: 'در مسیر' },
  { id: 'v2', code: 'TR-102', type: 'ولوو FH500', plateNumber: '۲۲ب۴۵۶ایران۴۴', driverId: '3', status: 'در دسترس' },
  { id: 'v3', code: 'TR-103', type: 'بنز آکتروس', plateNumber: '۳۳ج۷۸۹ایران۴۴', driverId: null, status: 'در دست تعمیر' },
];

const initialTrips: Trip[] = [
  { id: 't1', vehicleId: 'v1', driverId: '2', origin: 'تهران', destination: 'بندرعباس', startDate: new Date('2024-07-15'), endDate: null, status: 'در حال انجام' },
  { id: 't2', vehicleId: 'v2', driverId: '3', origin: 'اصفهان', destination: 'مشهد', startDate: new Date('2024-07-10'), endDate: new Date('2024-07-14'), status: 'تکمیل شده' },
  { id: 't3', vehicleId: 'v2', driverId: '3', origin: 'شیراز', destination: 'تبریز', startDate: new Date('2024-07-20'), endDate: null, status: 'برنامه ریزی شده' },
];

const initialMaintenanceRecords: MaintenanceRecord[] = [
    { id: 'maint1', vehicleId: 'v1', date: new Date('2024-04-10'), serviceType: 'سرویس دوره ای', cost: 1500000 },
    { id: 'maint2', vehicleId: 'v1', date: new Date('2024-06-20'), serviceType: 'تعویض لنت ترمز', cost: 2200000 },
    { id: 'maint3', vehicleId: 'v2', date: new Date('2024-05-20'), serviceType: 'تعویض روغن', cost: 950000 },
    { id: 'maint4', vehicleId: 'v3', date: new Date('2024-06-01'), serviceType: 'تعمیر موتور', cost: 12000000 },
];

const initialServiceOrders: ServiceOrder[] = [
    { id: 'so1', vehicleId: 'v3', admissionDate: new Date('2024-06-15'), issueDescription: 'دود کردن بیش از حد موتور و کاهش قدرت.', status: 'در حال تعمیر', notes: 'سیلندرها نیاز به تراشکاری دارند. قطعات سفارش داده شده.' },
];


const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [logs, setLogs] = useState<Log[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(initialServiceOrders);
  const [reportedOverdueOrders, setReportedOverdueOrders] = useState<string[]>([]);

  // Admin unread alerts state
  const adminAlertsStorageKey = 'lastSeenAdminAlertId';
  const [lastSeenAdminAlertId, setLastSeenAdminAlertId] = useState<string | null>(() => localStorage.getItem(adminAlertsStorageKey));


  const addLog = (username: string, action: string) => {
    const newLog: Log = {
        id: new Date().getTime().toString(),
        timestamp: new Date(),
        username,
        action,
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username);

    if (!user) {
        addLog(username, 'تلاش برای ورود ناموفق (نام کاربری یافت نشد)');
        return false;
    }

    if (user.password !== password) {
        addLog(username, 'تلاش برای ورود ناموفق (رمز عبور اشتباه)');
        return false;
    }

    const now = new Date();
    setUsers(prevUsers =>
      prevUsers.map(u => u.id === user.id ? { ...u, lastLogin: now } : u)
    );
    setLoggedInUser({ ...user, lastLogin: now });
    addLog(username, 'ورود موفق به سیستم');
    return true;
  };

  const handleLogout = () => {
    if(loggedInUser) {
        addLog(loggedInUser.username, 'خروج از سیستم');
    }
    setLoggedInUser(null);
  };

  const handleAddUser = (
    username: string, 
    password: string, 
    role: 'USER' | 'WORKSHOP',
    personnelCode: string,
    phone: string
  ): string | null => {
    if (users.some(u => u.username === username)) {
      return 'این نام کاربری قبلا استفاده شده است.';
    }
    if (users.some(u => u.personnelCode === personnelCode)) {
      return 'این کد پرسنلی قبلا استفاده شده است.';
    }
    if (password.length > 8) {
      return 'رمز عبور نباید بیشتر از ۸ کاراکتر باشد.';
    }
    const newUser: User = {
      id: new Date().getTime().toString(),
      username,
      password,
      role,
      personnelCode,
      phone,
      registrationDate: new Date(),
      lastLogin: null,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    if (loggedInUser) {
        addLog(loggedInUser.username, `کاربر جدید "${username}" با کد پرسنلی "${personnelCode}" را اضافه کرد.`);
    }
    return null;
  };

  const handleChangePassword = (userId: string, newPassword: string): string | null => {
    if (newPassword.length > 8) {
      return 'رمز عبور نباید بیشتر از ۸ کاراکتر باشد.';
    }
    const userToChange = users.find(u => u.id === userId);
    if (userToChange && loggedInUser) {
        setUsers(prevUsers => 
          prevUsers.map(u => u.id === userId ? { ...u, password: newPassword } : u)
        );
        addLog(loggedInUser.username, `رمز عبور کاربر "${userToChange.username}" را تغییر داد.`);
    }
    return null;
  };

  const handleProcessRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request && loggedInUser) {
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId ? { ...req, status: 'COMPLETED' } : req
          )
        );
        addLog(loggedInUser.username, `درخواست "${request.title}" کاربر "${request.username}" را تکمیل کرد.`);
    }
  };
  
  const handleApproveRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request && loggedInUser) {
        setRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status: 'APPROVED' } : req
            )
        );
        addLog(loggedInUser.username, `درخواست "${request.title}" کاربر "${request.username}" را تایید نهایی کرد.`);
    }
  };

  const handleFinalizeRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request && loggedInUser) {
        setRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status: 'FINALIZED' } : req
            )
        );
        addLog(loggedInUser.username, `درخواست "${request.title}" کاربر "${request.username}" را نهایی کرد.`);
    }
  };


  const handleAddRequest = (newRequestData: Omit<Request, 'id' | 'username' | 'status'>) => {
    if (!loggedInUser) return;
    const newRequest: Request = {
      id: new Date().getTime().toString(),
      username: loggedInUser.username,
      status: 'PENDING',
      ...newRequestData
    };
    setRequests(prevRequests => [newRequest, ...prevRequests]);
    addLog(loggedInUser.username, `درخواست جدیدی با عنوان "${newRequest.title}" ثبت کرد.`);
    alert('درخواست شما با موفقیت ثبت شد.');
  };

  const handleUpdateProfile = (userId: string, newUsername: string, newPassword?: string): string | null => {
    const currentUser = users.find(u => u.id === userId);
    if (!currentUser) return "کاربر پیدا نشد.";

    if (newUsername !== currentUser.username && users.some(u => u.username === newUsername)) {
      return 'این نام کاربری قبلا استفاده شده است.';
    }
    
    if (newPassword && newPassword.length > 8) {
      return 'رمز عبور نباید بیشتر از ۸ کاراکتر باشد.';
    }
    
    const logActions: string[] = [];
    if (newUsername !== currentUser.username) {
        logActions.push(`نام کاربری خود را از "${currentUser.username}" به "${newUsername}" تغییر داد.`);
    }
    if (newPassword && newPassword.length > 0) {
        logActions.push('رمز عبور خود را تغییر داد.');
    }

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          username: newUsername,
          password: newPassword && newPassword.length > 0 ? newPassword : u.password,
        };
      }
      return u;
    });

    setUsers(updatedUsers);

    if (loggedInUser && loggedInUser.id === userId) {
      const updatedLoggedInUser = updatedUsers.find(u => u.id === userId) as User;
      if (updatedLoggedInUser) {
        setLoggedInUser(updatedLoggedInUser);
      }
    }
    
    if (logActions.length > 0) {
        const userToLog = updatedUsers.find(u => u.id === userId) || currentUser;
        addLog(userToLog.username, logActions.join(' و '));
    }
    
    return null;
  };
  
  const handleAddMaintenanceRecord = (vehicleId: string, serviceType: string, cost: number, date: Date) => {
    if (!loggedInUser) return;
    const newRecord: MaintenanceRecord = {
        id: new Date().getTime().toString(),
        vehicleId,
        date,
        serviceType,
        cost,
    };
    setMaintenanceRecords(prev => [newRecord, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
        addLog(loggedInUser.username, `رکورد سرویس جدیدی برای خودروی "${vehicle.type} (${vehicle.code})" ثبت کرد.`);
    }
  };

  const handleAddAlert = (
    title: string,
    message: string,
    target: 'همه کاربران' | 'همه مدیران' | 'کاربران خاص',
    targetUsernames?: string[]
  ) => {
    if (!loggedInUser) return;
    const newAlert: Alert = {
      id: new Date().getTime().toString(),
      title,
      message,
      target,
      targetUsernames: target === 'کاربران خاص' ? targetUsernames : undefined,
      createdAt: new Date(),
      sender: loggedInUser.username,
    };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    addLog(loggedInUser.username, `هشدار جدیدی با عنوان "${title}" برای "${target}" ارسال کرد.`);
    alert('هشدار با موفقیت ارسال شد.');
  };

  const handleAssignVehicle = (userId: string, vehicleId: string | null) => {
    setVehicles(prevVehicles => {
        // First, find the vehicle currently assigned to the user (if any) and unassign it.
        const unassignedVehicles = prevVehicles.map(v => 
            v.driverId === userId ? { ...v, driverId: null } : v
        );

        // Then, if a new vehicleId is provided, assign it to the user.
        if (vehicleId) {
            return unassignedVehicles.map(v => 
                v.id === vehicleId ? { ...v, driverId: userId } : v
            );
        }

        // If no new vehicleId, just return the list with the user's old vehicle unassigned.
        return unassignedVehicles;
    });

    if (loggedInUser) {
        const user = users.find(u => u.id === userId);
        if (user) {
            if (vehicleId) {
                const vehicle = vehicles.find(v => v.id === vehicleId);
                addLog(loggedInUser.username, `خودروی "${vehicle?.type || 'ناشناس'} (${vehicle?.code || '---'})" را به کاربر "${user.username}" تخصیص داد.`);
            } else {
                addLog(loggedInUser.username, `تخصیص خودرو را از کاربر "${user.username}" حذف کرد.`);
            }
        }
    }
  };
  
  const handleAddVehicle = (code: string, type: string, plateNumber: string): string | null => {
    if (vehicles.some(v => v.plateNumber === plateNumber)) {
        return 'خودرویی با این شماره پلاک قبلا ثبت شده است.';
    }
    if (vehicles.some(v => v.code === code)) {
        return 'خودرویی با این کد قبلا ثبت شده است.';
    }
    const newVehicle: Vehicle = {
        id: new Date().getTime().toString(),
        code,
        type,
        plateNumber,
        driverId: null,
        status: 'در دسترس',
    };
    setVehicles(prevVehicles => [newVehicle, ...prevVehicles]);
    if (loggedInUser) {
        addLog(loggedInUser.username, `خودروی جدید "${type} (${code})" با پلاک "${plateNumber}" را اضافه کرد.`);
    }
    return null;
  };
  
  const handleAddServiceOrder = (vehicleId: string, issueDescription: string) => {
    if (!loggedInUser) return;
    const newOrder: ServiceOrder = {
        id: new Date().getTime().toString(),
        vehicleId,
        admissionDate: new Date(),
        issueDescription,
        status: 'پذیرش شده',
    };
    setServiceOrders(prev => [newOrder, ...prev]);
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status: 'در دست تعمیر' } : v));
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
        addLog(loggedInUser.username, `خودروی "${vehicle.type} (${vehicle.code})" را برای تعمیر پذیرش کرد.`);
    }
  };

  const handleUpdateServiceOrder = (orderId: string, newStatus: ServiceOrderStatus, notes?: string) => {
    if (!loggedInUser) return;
    let vehicleToUpdate: Vehicle | undefined;
    setServiceOrders(prev => prev.map(order => {
        if (order.id === orderId) {
            vehicleToUpdate = vehicles.find(v => v.id === order.vehicleId);
            return { ...order, status: newStatus, notes: notes || order.notes };
        }
        return order;
    }));

    if (vehicleToUpdate && newStatus === 'تحویل داده شده') {
        setVehicles(prev => prev.map(v => v.id === vehicleToUpdate!.id ? { ...v, status: 'در دسترس' } : v));
        addLog(loggedInUser.username, `تعمیرات خودروی "${vehicleToUpdate.type} (${vehicleToUpdate.code})" را تکمیل و تحویل داد.`);
    } else if (vehicleToUpdate) {
        addLog(loggedInUser.username, `وضعیت تعمیر خودروی "${vehicleToUpdate.type} (${vehicleToUpdate.code})" را به "${newStatus}" تغییر داد.`);
    }
  };

  const handleSendOverdueReport = (order: ServiceOrder, vehicle: Vehicle, explanation: string) => {
    if (!loggedInUser) return;
    const title = `هشدار تاخیر در تحویل خودرو: ${vehicle.type} (${vehicle.code})`;
    const message = `خودروی "${vehicle.type}" با کد "${vehicle.code}" که در تاریخ ${new Date(order.admissionDate).toLocaleDateString('fa-IR')} پذیرش شده، با تاخیر مواجه است.

توضیحات تعمیرکار:
${explanation}`;

    handleAddAlert(title, message, 'همه مدیران');
    setReportedOverdueOrders(prev => [...prev, order.id]);
  };


  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  if (!loggedInUser) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const assignedVehicle = vehicles.find(v => v.driverId === loggedInUser.id);
  const userMaintenanceRecords = assignedVehicle 
    ? maintenanceRecords.filter(m => m.vehicleId === assignedVehicle.id) 
    : [];
  const activeServiceOrder = assignedVehicle
    ? serviceOrders.find(so => so.vehicleId === assignedVehicle.id && so.status !== 'تحویل داده شده')
    : undefined;

  const allAdminAlerts = alerts.filter(a => a.target === 'همه مدیران');
  const latestAdminAlert = allAdminAlerts.length > 0 ? allAdminAlerts[0] : null;
  const hasUnreadAdminAlerts = latestAdminAlert ? latestAdminAlert.id !== lastSeenAdminAlertId : false;

  const handleAdminAlertsView = () => {
    if (latestAdminAlert) {
      localStorage.setItem(adminAlertsStorageKey, latestAdminAlert.id);
      setLastSeenAdminAlertId(latestAdminAlert.id);
    }
  };


  const renderPanel = () => {
    switch (loggedInUser.role) {
      case 'ADMIN':
        return (
          <AdminLayout
            loggedInUser={loggedInUser}
            users={users}
            onAddUser={handleAddUser}
            onChangePassword={handleChangePassword}
            requests={requests}
            onProcessRequest={handleProcessRequest}
            onApproveRequest={handleApproveRequest}
            onFinalizeRequest={handleFinalizeRequest}
            onUpdateProfile={handleUpdateProfile}
            logs={logs}
            vehicles={vehicles}
            trips={trips}
            maintenanceRecords={maintenanceRecords}
            onAddMaintenanceRecord={handleAddMaintenanceRecord}
            onAddVehicle={handleAddVehicle}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onAssignVehicle={handleAssignVehicle}
            serviceOrders={serviceOrders}
            onAddServiceOrder={handleAddServiceOrder}
            onUpdateServiceOrder={handleUpdateServiceOrder}
            hasUnreadAlerts={hasUnreadAdminAlerts}
            onViewAdminAlerts={handleAdminAlertsView}
          />
        );
      case 'WORKSHOP':
        return (
            <WorkshopPanel
                users={users}
                vehicles={vehicles}
                serviceOrders={serviceOrders}
                onAddServiceOrder={handleAddServiceOrder}
                onUpdateServiceOrder={handleUpdateServiceOrder}
                reportedOverdueOrders={reportedOverdueOrders}
                onSendOverdueReport={handleSendOverdueReport}
            />
        );
      case 'USER':
      default:
        return (
          <UserPanel
            user={loggedInUser}
            onAddRequest={handleAddRequest}
            userRequests={requests.filter(req => req.username === loggedInUser.username)}
            onUpdateProfile={handleUpdateProfile}
            alerts={alerts.filter(alert =>
                alert.target === 'همه کاربران' ||
                (alert.target === 'کاربران خاص' && alert.targetUsernames?.includes(loggedInUser.username))
            )}
            assignedVehicle={assignedVehicle}
            maintenanceRecords={userMaintenanceRecords}
            activeServiceOrder={activeServiceOrder}
          />
        );
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg dark:border-b dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">ترابری سنگین</h1>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 ml-4">خوش آمدید, {loggedInUser.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
              aria-label="خروج"
            >
              خروج
              <LogoutIcon />
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPanel()}
      </main>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import type { User, Vehicle } from '../../types';

interface UserManagementProps {
  users: User[];
  vehicles: Vehicle[];
  onAddUser: (username: string, password: string) => string | null;
  onChangePassword: (userId: string, newPassword: string) => string | null;
  onUpdateProfile: (userId: string, newUsername: string) => string | null;
  onAssignVehicle: (userId: string, vehicleId: string | null) => void;
}

const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
            <button onClick={onClose} className="absolute top-0 bottom-0 left-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>بستن</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
        </div>
    );
};

const AddUserForm: React.FC<{ onAddUser: (username: string, password: string) => string | null }> = ({ onAddUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError('لطفا نام کاربری و رمز عبور را وارد کنید.');
      return;
    }
    const result = onAddUser(username, password);
    if (result) {
        setError(result);
    } else {
        setUsername('');
        setPassword('');
        // Optionally show a success message
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">افزودن کاربر جدید</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert message={error} onClose={() => setError(null)} />}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام کاربری</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="نام کاربری جدید"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رمز عبور</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="رمز عبور (حداکثر ۸ کاراکتر)"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          افزودن کاربر
        </button>
      </form>
    </div>
  );
}

const UserListItem: React.FC<{ user: User, onChangePassword: (userId: string, newPassword: string) => string | null, onEditUser: (user: User) => void }> = ({ user, onChangePassword, onEditUser }) => {
    const [newPassword, setNewPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleChangePassword = () => {
        setError(null);
        if (!newPassword) {
            setError("لطفا رمز عبور جدید را وارد کنید.");
            return;
        }
        const result = onChangePassword(user.id, newPassword);
        if (result) {
            setError(result);
        } else {
            setNewPassword('');
            setIsEditing(false);
        }
    }

    return (
        <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
            <div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">نقش: کاربر</p>
            </div>
            <div className="mt-4 sm:mt-0 w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                <button
                    onClick={() => onEditUser(user)}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 hover:bg-blue-200 dark:hover:bg-blue-500/20 rounded-md whitespace-nowrap"
                >
                    ویرایش و تخصیص خودرو
                </button>
                {isEditing ? (
                    <div className="flex flex-col w-full sm:w-auto">
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="block w-full px-3 py-1.5 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="رمز عبور جدید"
                            />
                            <button onClick={handleChangePassword} className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md whitespace-nowrap">ذخیره</button>
                            <button onClick={() => { setIsEditing(false); setError(null); }} className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md">لغو</button>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1 text-right">{error}</p>}
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 hover:bg-indigo-200 dark:hover:bg-indigo-500/20 rounded-md whitespace-nowrap">تغییر رمز عبور</button>
                )}
            </div>
        </li>
    );
}

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);


interface EditUserModalProps {
    user: User;
    vehicles: Vehicle[];
    onClose: () => void;
    onSave: (userId: string, newUsername: string, newVehicleId: string | null) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, vehicles, onClose, onSave, error, setError }) => {
    const [username, setUsername] = useState(user.username);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [assignedVehicleId, setAssignedVehicleId] = useState<string>(() => {
        return vehicles.find(v => v.driverId === user.id)?.id || '';
    });

    const handleSave = () => {
        onSave(user.id, username, assignedVehicleId || null);
    };

    const availableVehicles = vehicles.filter(v => v.driverId === null || v.driverId === user.id);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" onClick={onClose}></div>
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 w-full max-w-lg p-6 border dark:border-gray-700"
                role="dialog"
                aria-modal="true"
                aria-labelledby="editUserModalTitle"
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 id="editUserModalTitle" className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        ویرایش کاربر: {user.username}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="بستن">
                        <CloseIcon />
                    </button>
                </div>
                <div className="mt-6 space-y-6">
                    {error && <Alert message={error} onClose={() => setError(null)} />}
                    <div>
                        <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام کاربری</label>
                        <input
                            id="edit-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رمز عبور فعلی</label>
                        <div className="relative mt-1">
                            <input
                                id="current-password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={user.password}
                                readOnly
                                className="block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                aria-label="نمایش/مخفی کردن رمز عبور"
                            >
                                {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <label htmlFor="assign-vehicle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تخصیص خودرو</label>
                        <select
                            id="assign-vehicle"
                            value={assignedVehicleId}
                            onChange={(e) => setAssignedVehicleId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">--- بدون خودرو ---</option>
                            {availableVehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    [{v.code}] {v.type} - {v.plateNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                         <p><strong>تاریخ ثبت نام:</strong> {new Date(user.registrationDate).toLocaleDateString('fa-IR')}</p>
                         <p><strong>آخرین ورود:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString('fa-IR') : 'هرگز'}</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
                     <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        لغو
                    </button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        ذخیره تغییرات
                    </button>
                </div>
            </div>
        </>
    );
};


const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onChangePassword, onUpdateProfile, onAssignVehicle, vehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editError, setEditError] = useState<string|null>(null);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSaveUser = (userId: string, newUsername: string, newVehicleId: string | null) => {
    setEditError(null);
    if (selectedUser && selectedUser.username !== newUsername) {
        const result = onUpdateProfile(userId, newUsername);
        if (result) {
            setEditError(result);
            return; // Stop if there's an error
        }
    }
    
    const currentVehicleId = vehicles.find(v => v.driverId === userId)?.id || null;
    if (currentVehicleId !== newVehicleId) {
        onAssignVehicle(userId, newVehicleId);
    }
    
    setSelectedUser(null);
  };

  return (
    <div className="space-y-8">
      <AddUserForm onAddUser={onAddUser} />
      
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 w-full text-right sm:w-auto mb-4 sm:mb-0">لیست کاربران</h2>
            <div className="relative w-full sm:w-auto">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="جستجوی کاربر..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-3 pr-10 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </div>
        {filteredUsers.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map(user => (
              <UserListItem key={user.id} user={user} onChangePassword={onChangePassword} onEditUser={setSelectedUser} />
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            {searchTerm ? 'کاربری با این مشخصات یافت نشد.' : 'کاربری برای نمایش وجود ندارد.'}
          </p>
        )}
      </div>

      {selectedUser && (
        <EditUserModal
            user={selectedUser}
            vehicles={vehicles}
            onClose={() => { setSelectedUser(null); setEditError(null); }}
            onSave={handleSaveUser}
            error={editError}
            setError={setEditError}
        />
      )}

    </div>
  );
};

export default UserManagement;
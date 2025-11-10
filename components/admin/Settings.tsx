
import React, { useState } from 'react';
import type { User } from '../../types';

interface SettingsProps {
    user: User;
    onUpdateProfile: (userId: string, newUsername: string, newPassword?: string) => string | null;
}

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


const Settings: React.FC<SettingsProps> = ({ user, onUpdateProfile }) => {
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

    const FormRow: React.FC<{ label: string; htmlFor: string; children: React.ReactNode }> = ({ label, htmlFor, children }) => (
        <div>
          <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
          {children}
        </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">تنظیمات حساب کاربری</h2>
      
      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
      {success && <Alert message={success} type="success" onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormRow label="نام کاربری" htmlFor="admin-username">
            <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </FormRow>
        <FormRow label="رمز عبور جدید (اختیاری)" htmlFor="admin-password">
            <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="برای تغییر، رمز جدید را وارد کنید"
            />
        </FormRow>
        <FormRow label="تکرار رمز عبور جدید" htmlFor="admin-confirmPassword">
            <input
                id="admin-confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
  );
};

export default Settings;
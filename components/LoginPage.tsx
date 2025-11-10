
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-400 text-center mb-8">
          ترابری سنگین
        </h1>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:border dark:border-gray-700">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">ورود به سیستم</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="text-sm font-bold text-gray-600 dark:text-gray-400 block">نام کاربری</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 mt-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:placeholder-gray-500"
                placeholder="مثال: admin"
              />
            </div>
            <div>
              {/* FIX: Removed invalid 'a' property from label element. */}
              <label htmlFor="password" className="text-sm font-bold text-gray-600 dark:text-gray-400 block">رمز عبور</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 mt-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ورود
              </button>
            </div>
          </form>
        </div>
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>سازنده : امیرحسین</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
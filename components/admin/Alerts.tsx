import React, { useState, useMemo } from 'react';
import type { Alert, User } from '../../types';

interface AlertsProps {
    alerts: Alert[];
    onAddAlert: (title: string, message: string, target: 'همه کاربران' | 'همه مدیران' | 'کاربران خاص', targetUsernames?: string[]) => void;
    allUsers: User[];
}

type TargetType = 'همه کاربران' | 'همه مدیران' | 'کاربران خاص';

const MegaphoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15h8.05a1.5 1.5 0 001.442-1.12l1.9-7.25a1.5 1.5 0 00-1.442-1.88H10.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6V3.75a1.5 1.5 0 00-3 0V6" />
    </svg>
);

const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);


const CreateAlertForm: React.FC<Pick<AlertsProps, 'onAddAlert' | 'allUsers'>> = ({ onAddAlert, allUsers }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState<TargetType>('همه کاربران');
    const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);

    const users = useMemo(() => allUsers.filter(u => u.role === 'USER'), [allUsers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            alert('لطفا عنوان و پیام هشدار را وارد کنید.');
            return;
        }
        if (target === 'کاربران خاص' && selectedUsernames.length === 0) {
            alert('لطفا حداقل یک کاربر را برای ارسال هشدار انتخاب کنید.');
            return;
        }
        onAddAlert(title, message, target, selectedUsernames);
        setTitle('');
        setMessage('');
        setTarget('همه کاربران');
        setSelectedUsernames([]);
    };

    const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const selected: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setSelectedUsernames(selected);
    };

    return (
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <MegaphoneIcon className="w-7 h-7 ml-3 text-indigo-500" />
                ایجاد هشدار جدید
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="alert-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان هشدار</label>
                    <input type="text" id="alert-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full input-field" placeholder="مثال: جلسه فوری" />
                </div>
                <div>
                    <label htmlFor="alert-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">متن پیام</label>
                    <textarea id="alert-message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} className="mt-1 block w-full input-field" placeholder="پیام خود را اینجا بنویسید..."></textarea>
                </div>
                <div>
                    <label htmlFor="alert-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ارسال به</label>
                    <select id="alert-target" value={target} onChange={(e) => setTarget(e.target.value as TargetType)} className="mt-1 block w-full input-field">
                        <option value="همه کاربران">همه کاربران</option>
                        <option value="همه مدیران">همه مدیران</option>
                        <option value="کاربران خاص">کاربران خاص</option>
                    </select>
                </div>
                {target === 'کاربران خاص' && (
                    <div>
                        <label htmlFor="alert-users" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">انتخاب کاربران</label>
                        <select id="alert-users" multiple value={selectedUsernames} onChange={handleUserSelection} className="mt-1 block w-full input-field h-32">
                            {users.map(user => (
                                <option key={user.id} value={user.username}>{user.username}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">برای انتخاب چند کاربر، کلید Ctrl (یا Cmd در مک) را نگه دارید.</p>
                    </div>
                )}
                <button type="submit" className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <PaperAirplaneIcon className="w-5 h-5 ml-2" />
                    ارسال هشدار
                </button>
            </form>
        </div>
    );
};

const AlertsList: React.FC<Pick<AlertsProps, 'alerts'>> = ({ alerts }) => {
    if (alerts.length === 0) {
        return (
            <div className="text-center py-10 px-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    <MegaphoneIcon className="h-10 w-10" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-800 dark:text-gray-100">
                    تاریخچه هشدارها خالی است
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    هشدارهای ارسال شده در این بخش نمایش داده خواهند شد.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {alerts.map(alert => (
                <div key={alert.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border-l-4 border-indigo-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{alert.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ارسال شده توسط <span className="font-medium text-gray-600 dark:text-gray-300">{alert.sender}</span> در تاریخ {new Date(alert.createdAt).toLocaleString('fa-IR')}
                            </p>
                        </div>
                        <div className="text-right">
                             <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300">
                                {alert.target}
                            </span>
                             {alert.target === 'کاربران خاص' && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-[150px]" title={alert.targetUsernames?.join(', ')}>
                                    ({alert.targetUsernames?.join(', ')})
                                </p>
                             )}
                        </div>
                    </div>
                    <p className="mt-3 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{alert.message}</p>
                </div>
            ))}
        </div>
    );
};

const Alerts: React.FC<AlertsProps> = ({ alerts, onAddAlert, allUsers }) => {
  return (
    <>
      <style>{`.input-field { padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); } .dark .input-field { background-color: #374151; border-color: #4B5563; color: #D1D5DB; } .input-field:focus { outline: none; ring: 2px; border-color: #6366F1; } `}</style>
      <div className="space-y-8">
        <CreateAlertForm onAddAlert={onAddAlert} allUsers={allUsers} />
        
        <div className="bg-gray-50 dark:bg-gray-800/50 dark:border dark:border-gray-700 rounded-xl p-6 md:p-8">
             <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                تاریخچه هشدارها
            </h2>
            <AlertsList alerts={alerts} />
        </div>
      </div>
    </>
  );
};

export default Alerts;

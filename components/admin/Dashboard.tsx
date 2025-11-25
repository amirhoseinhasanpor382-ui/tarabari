
import React, { useMemo, useState } from 'react';
import type { Trip, Vehicle, User } from '../../types';

const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4-2H5M17 16l-4-4" />
  </svg>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LocationMarkerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const QueueListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);


const StatCard: React.FC<{ title: string, value: string, Icon: React.ElementType, gradient: string }> = ({ title, value, Icon, gradient }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex items-center justify-between relative overflow-hidden group transition-transform hover:-translate-y-1">
        <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${gradient}`}></div>
        <div className="z-10">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-8 w-8" />
        </div>
    </div>
  );
};

export interface DashboardProps {
    requestsCount: number;
    trips: Trip[];
    vehicles: Vehicle[];
    users: User[];
    onUpdateTripQueue?: (tripId: string, arrivalDate: Date, location: 'انبار مرکزی' | 'پاندا' | 'شهر لبنیات') => void;
}


const QueueModal: React.FC<{
    trip: Trip & { vehicleType: string; vehicleCode: string; driverName: string };
    onClose: () => void;
    onSubmit: (tripId: string, arrivalDate: Date, location: 'انبار مرکزی' | 'پاندا' | 'شهر لبنیات') => void;
}> = ({ trip, onClose, onSubmit }) => {
    const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().slice(0, 16)); // format for datetime-local
    const [location, setLocation] = useState<'انبار مرکزی' | 'پاندا' | 'شهر لبنیات'>('انبار مرکزی');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(trip.id, new Date(arrivalDate), location);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity" onClick={onClose}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 w-full max-w-md p-6 border dark:border-gray-700">
                 <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        ثبت نوبت دهی انبار
                    </h3>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon />
                    </button>
                </div>
                <div className="mt-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">خودرو: <strong>{trip.vehicleType} ({trip.vehicleCode})</strong></p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">راننده: <strong>{trip.driverName}</strong></p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ساعت ورود به انبار</label>
                        <input 
                            type="datetime-local" 
                            id="arrivalTime"
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">جایی که رسیده (مقصد)</label>
                        <select
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value as any)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="انبار مرکزی">انبار مرکزی</option>
                            <option value="پاندا">پاندا</option>
                            <option value="شهر لبنیات">شهر لبنیات</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3 space-x-reverse">
                         <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">لغو</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">ثبت نوبت</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export const OnlineRoutesTable: React.FC<{ 
    trips: Trip[], 
    vehicles: Vehicle[], 
    users: User[], 
    onUpdateQueue?: (tripId: string, arrivalDate: Date, location: 'انبار مرکزی' | 'پاندا' | 'شهر لبنیات') => void 
}> = ({ trips, vehicles, users, onUpdateQueue }) => {
    const [queueModalTrip, setQueueModalTrip] = useState<(Trip & { vehicleType: string; vehicleCode: string; driverName: string }) | null>(null);

    const activeTrips = useMemo(() => {
        return trips.filter(t => t.status === 'در حال انجام' || t.status === 'در مسیر').map(trip => {
            const vehicle = vehicles.find(v => v.id === trip.vehicleId);
            const driver = users.find(u => u.id === trip.driverId);
            return {
                ...trip,
                vehicleCode: vehicle?.code || '---',
                vehicleType: vehicle?.type || '---',
                driverName: driver?.username || '---',
                driverPhone: driver?.phone || '---'
            };
        });
    }, [trips, vehicles, users]);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                    <GlobeIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 ml-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">سفرهای آنلاین (در حال انجام)</h3>
                </div>
                
                {activeTrips.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">خودرو</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">راننده</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مبدا / مقصد</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نوع بار</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت نوبت</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {activeTrips.map((trip) => (
                                    <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{trip.vehicleType}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{trip.vehicleCode}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{trip.driverName}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{trip.driverPhone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <span className="font-bold">{trip.origin}</span>
                                                <span className="mx-2 text-gray-400">←</span>
                                                <span className="font-bold">{trip.destination}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                {trip.cargoType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {trip.warehouseArrivalDate ? (
                                                <div className="text-sm">
                                                    <p className="font-bold text-green-600 dark:text-green-400">{trip.warehouseLocation}</p>
                                                    <p className="text-xs text-gray-500">{new Date(trip.warehouseArrivalDate).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">---</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 dark:text-gray-200 ltr">
                                            {onUpdateQueue && (
                                                <button 
                                                    onClick={() => setQueueModalTrip(trip)}
                                                    className="flex items-center px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded transition-colors"
                                                >
                                                    <QueueListIcon className="w-4 h-4 mr-1" />
                                                    نوبت دهی
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">هیچ خودرویی در حال حاضر در مسیر نیست.</p>
                    </div>
                )}
            </div>

            {queueModalTrip && onUpdateQueue && (
                <QueueModal 
                    trip={queueModalTrip}
                    onClose={() => setQueueModalTrip(null)}
                    onSubmit={onUpdateQueue}
                />
            )}
        </>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ requestsCount, trips, vehicles, users, onUpdateTripQueue }) => {
  const stats = [
    { title: 'تعداد کل خودروها', value: vehicles.length.toString(), Icon: TruckIcon, gradient: 'from-blue-500 to-blue-700' },
    { title: 'تعداد کل کارکنان', value: users.length.toString(), Icon: UsersIcon, gradient: 'from-emerald-500 to-teal-700' },
    { title: 'خودروهای در مسیر', value: vehicles.filter(v => v.status === 'در مسیر').length.toString(), Icon: LocationMarkerIcon, gradient: 'from-amber-500 to-orange-700' },
    { title: 'درخواست‌های باز', value: requestsCount.toString(), Icon: BellIcon, gradient: 'from-rose-500 to-pink-700' },
  ];
  
  const currentDate = new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    داشبورد مدیریتی
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg flex items-center">
                    <CalendarIcon />
                    <span className="mr-2">{currentDate}</span>
                </p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {stats.map(stat => (
                <StatCard key={stat.title} {...stat} />
            ))}
        </div>

        <OnlineRoutesTable trips={trips} vehicles={vehicles} users={users} onUpdateQueue={onUpdateTripQueue} />
    </div>
  );
};

export default Dashboard;
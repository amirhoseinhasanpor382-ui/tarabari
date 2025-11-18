
import React, { useState, useMemo } from 'react';
import type { User, Vehicle, Trip, MaintenanceRecord } from '../../types';

interface ReportsProps {
  users: User[];
  vehicles: Vehicle[];
  trips: Trip[];
  maintenanceRecords: MaintenanceRecord[];
}

type ReportView = 'personnel' | 'vehicles' | 'trips' | 'maintenance';

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);

const roleDisplay: Record<User['role'], string> = {
    ADMIN: 'مدیر',
    USER: 'کاربر',
    WORKSHOP: 'تعمیرکار'
};


const Reports: React.FC<ReportsProps> = ({ users, vehicles, trips, maintenanceRecords }) => {
    const [activeTab, setActiveTab] = useState<ReportView>('personnel');
    const [searchTerm, setSearchTerm] = useState('');
    const costFormatter = new Intl.NumberFormat('fa-IR');

    const userMap = useMemo(() => new Map(users.map(u => [u.id, u.username])), [users]);
    const vehicleMap = useMemo(() => new Map(vehicles.map(v => [v.id, `[${v.code}] ${v.type}`])), [vehicles]);

    const maintenanceByVehicle = useMemo(() => {
        return maintenanceRecords.reduce((acc, record) => {
            const { vehicleId } = record;
            if (!acc[vehicleId]) acc[vehicleId] = [];
            acc[vehicleId].push(record);
            return acc;
        }, {} as Record<string, MaintenanceRecord[]>);
    }, [maintenanceRecords]);
    
    const lastMaintenanceMap = useMemo(() => {
        const map = new Map<string, Date>();
        Object.keys(maintenanceByVehicle).forEach(vehicleId => {
            const records = maintenanceByVehicle[vehicleId];
            if (records.length > 0) {
                const latestDate = new Date(Math.max(...records.map(r => new Date(r.date).getTime())));
                map.set(vehicleId, latestDate);
            }
        });
        return map;
    }, [maintenanceByVehicle]);

    const enrichedMaintenanceRecords = useMemo(() => {
        return maintenanceRecords.map(record => {
            const vehicle = vehicles.find(v => v.id === record.vehicleId);
            return {
                ...record,
                vehicleCode: vehicle?.code || '---',
                vehicleType: vehicle?.type || 'ناشناس',
                vehiclePlate: vehicle?.plateNumber || '---',
                vehicleStatus: vehicle?.status || '---',
            };
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [maintenanceRecords, vehicles]);

    const handleDownloadCSV = () => {
        let headers: string[] = [];
        let rows: string[][] = [];
        let filename = `report-${activeTab}.csv`;

        switch(activeTab) {
            case 'personnel':
                headers = ['نام کاربری', 'کد پرسنلی', 'شماره تماس', 'نقش', 'تاریخ ثبت نام', 'آخرین ورود'];
                rows = filteredPersonnel.map(u => [
                    `"${u.username}"`,
                    `"${u.personnelCode}"`,
                    `"${u.phone}"`,
                    `"${roleDisplay[u.role]}"`,
                    `"${new Date(u.registrationDate).toLocaleString('fa-IR')}"`,
                    `"${u.lastLogin ? new Date(u.lastLogin).toLocaleString('fa-IR') : 'هرگز'}"`,
                ]);
                break;
            case 'vehicles':
                headers = ['کد خودرو', 'نوع خودرو', 'شماره پلاک', 'راننده', 'وضعیت', 'آخرین سرویس'];
                rows = filteredVehicles.map(v => {
                    const lastMaintDate = lastMaintenanceMap.get(v.id);
                    return [
                        `"${v.code}"`,
                        `"${v.type}"`,
                        `"${v.plateNumber}"`,
                        `"${v.driverId ? userMap.get(v.driverId) || 'ناشناس' : 'ندارد'}"`,
                        `"${v.status}"`,
                        `"${lastMaintDate ? lastMaintDate.toLocaleDateString('fa-IR') : '---'}"`,
                    ];
                });
                break;
            case 'trips':
                headers = ['خودرو', 'راننده', 'مبدا', 'مقصد', 'تاریخ شروع', 'تاریخ پایان', 'وضعیت'];
                rows = filteredTrips.map(t => [
                    `"${vehicleMap.get(t.vehicleId) || 'ناشناس'}"`,
                    `"${userMap.get(t.driverId) || 'ناشناس'}"`,
                    `"${t.origin}"`,
                    `"${t.destination}"`,
                    `"${new Date(t.startDate).toLocaleString('fa-IR')}"`,
                    `"${t.endDate ? new Date(t.endDate).toLocaleString('fa-IR') : '---'}"`,
                    `"${t.status}"`,
                ]);
                break;
            case 'maintenance':
                headers = ['کد خودرو', 'نوع خودرو', 'شماره پلاک', 'وضعیت خودرو', 'نوع سرویس', 'تاریخ', 'هزینه (تومان)'];
                rows = filteredMaintenance.map(m => [
                    `"${m.vehicleCode}"`,
                    `"${m.vehicleType}"`,
                    `"${m.vehiclePlate}"`,
                    `"${m.vehicleStatus}"`,
                    `"${m.serviceType}"`,
                    `"${new Date(m.date).toLocaleDateString('fa-IR')}"`,
                    `"${m.cost}"`,
                ]);
                break;
        }

        if (rows.length === 0) {
            alert('داده‌ای برای دانلود وجود ندارد.');
            return;
        }

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredPersonnel = useMemo(() => users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase())), [users, searchTerm]);
    const filteredVehicles = useMemo(() => vehicles.filter(v => v.type.toLowerCase().includes(searchTerm.toLowerCase()) || v.code.toLowerCase().includes(searchTerm.toLowerCase()) || v.plateNumber.includes(searchTerm)), [vehicles, searchTerm]);
    const filteredTrips = useMemo(() =>
        trips.filter(t => {
            const driverName = userMap.get(t.driverId)?.toLowerCase() || '';
            const term = searchTerm.toLowerCase();
            return t.origin.toLowerCase().includes(term) ||
                   t.destination.toLowerCase().includes(term) ||
                   driverName.includes(term);
        }),
    [trips, searchTerm, userMap]);
    const filteredMaintenance = useMemo(() =>
        enrichedMaintenanceRecords.filter(m =>
            m.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.vehicleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.vehiclePlate.includes(searchTerm) ||
            m.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
        ), [enrichedMaintenanceRecords, searchTerm]);

    const renderContent = () => {
        const placeholderText: Record<ReportView, string> = {
            personnel: 'جستجوی پرسنل...',
            vehicles: 'جستجوی خودرو (کد، نوع، پلاک)...',
            trips: 'جستجوی سفر (راننده، مبدا، مقصد)...',
            maintenance: 'جستجوی تعمیرات (کد/نوع خودرو، پلاک، سرویس)...',
        };
        
        const driverTripCounts = useMemo(() => {
            if (activeTab !== 'trips') return new Map<string, number>();
            const counts = new Map<string, number>();
            trips.forEach(trip => {
                if (trip.status === 'تکمیل شده') {
                    const currentCount = counts.get(trip.driverId) || 0;
                    counts.set(trip.driverId, currentCount + 1);
                }
            });
            return counts;
        }, [trips, activeTab]);

        const TripsSummary = () => {
            const summaryEntries = Array.from(driverTripCounts.entries());
            if (summaryEntries.length === 0) {
                 return (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-8">
                        <p>هنوز سفر تکمیل شده‌ای برای نمایش خلاصه ثبت نشده است.</p>
                    </div>
                );
            }

            return (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">خلاصه سفرهای تکمیل شده رانندگان</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {summaryEntries.map(([driverId, count]) => (
                            <div key={driverId} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-700">
                                <p className="font-semibold text-indigo-600 dark:text-indigo-400 truncate" title={userMap.get(driverId) || 'راننده ناشناس'}>{userMap.get(driverId) || 'راننده ناشناس'}</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{count}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">سفر موفق</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };


        const renderTable = () => {
            switch (activeTab) {
                case 'personnel': return (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نام کاربری</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">کد پرسنلی</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">شماره تماس</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نقش</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ ثبت نام</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">آخرین ورود</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPersonnel.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{u.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{u.personnelCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{u.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{roleDisplay[u.role]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(u.registrationDate).toLocaleString('fa-IR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{u.lastLogin ? new Date(u.lastLogin).toLocaleString('fa-IR') : 'هرگز'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                case 'vehicles': return (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">کد خودرو</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نوع خودرو</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">شماره پلاک</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">راننده</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">آخرین سرویس</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredVehicles.map(v => {
                                const lastMaintDate = lastMaintenanceMap.get(v.id);
                                return (
                                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{v.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{v.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{v.plateNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{v.driverId ? userMap.get(v.driverId) || 'ناشناس' : '---'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{v.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lastMaintDate ? lastMaintDate.toLocaleDateString('fa-IR') : '---'}</td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                );
                case 'trips': return (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">خودرو</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">راننده</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مبدا</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مقصد</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ شروع</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ پایان</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTrips.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{vehicleMap.get(t.vehicleId) || 'ناشناس'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{userMap.get(t.driverId) || 'ناشناس'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{t.origin}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{t.destination}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(t.startDate).toLocaleString('fa-IR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{t.endDate ? new Date(t.endDate).toLocaleString('fa-IR') : '---'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{t.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                case 'maintenance': return (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">کد خودرو</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نوع خودرو</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">شماره پلاک</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت خودرو</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نوع سرویس</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">هزینه (تومان)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredMaintenance.map(m => (
                                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{m.vehicleCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{m.vehicleType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{m.vehiclePlate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{m.vehicleStatus}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{m.serviceType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(m.date).toLocaleDateString('fa-IR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{costFormatter.format(m.cost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                default: return null;
            }
        };

        const dataExists = (filteredPersonnel.length > 0 && activeTab === 'personnel') || 
            (filteredVehicles.length > 0 && activeTab === 'vehicles') || 
            (filteredTrips.length > 0 && activeTab === 'trips') ||
            (filteredMaintenance.length > 0 && activeTab === 'maintenance');

        return (
            <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8 mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder={placeholderText[activeTab]}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-3 pr-10 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        onClick={handleDownloadCSV}
                        className="flex items-center whitespace-nowrap px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
                    >
                        <DownloadIcon className="w-5 h-5 ml-2" />
                        دانلود CSV
                    </button>
                </div>
                
                {activeTab === 'trips' && <TripsSummary />}
                
                {dataExists ? (
                    <div className="overflow-x-auto">
                        {renderTable()}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        {searchTerm ? 'موردی با این مشخصات یافت نشد.' : 'داده‌ای برای نمایش وجود ندارد.'}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="reports-container">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
                    گزارشات ناوگان
                </h2>
                <div className="flex items-center space-x-2 space-x-reverse p-1 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                    <TabButton label="پرسنل" isActive={activeTab === 'personnel'} onClick={() => { setActiveTab('personnel'); setSearchTerm(''); }} />
                    <TabButton label="خودروها" isActive={activeTab === 'vehicles'} onClick={() => { setActiveTab('vehicles'); setSearchTerm(''); }} />
                    <TabButton label="سفرها" isActive={activeTab === 'trips'} onClick={() => { setActiveTab('trips'); setSearchTerm(''); }} />
                    <TabButton label="تعمیرات" isActive={activeTab === 'maintenance'} onClick={() => { setActiveTab('maintenance'); setSearchTerm(''); }} />
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default Reports;

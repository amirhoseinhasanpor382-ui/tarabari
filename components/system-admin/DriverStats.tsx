
import React, { useMemo } from 'react';
import type { User, Trip, Vehicle } from '../../types';

interface DriverStatsProps {
    users: User[];
    trips: Trip[];
    vehicles: Vehicle[];
}

const DriverStats: React.FC<DriverStatsProps> = ({ users, trips, vehicles }) => {
    const GOAL_KM = 17000;

    const drivers = useMemo(() => users.filter(u => u.role === 'USER'), [users]);
    
    // Calculate current cycle dates
    const { startDate, endDate } = useMemo(() => {
        const now = new Date();
        let start = new Date(now.getFullYear(), now.getMonth(), 25);
        let end = new Date(now.getFullYear(), now.getMonth() + 1, 25);

        if (now.getDate() < 25) {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 25);
            end = new Date(now.getFullYear(), now.getMonth(), 25);
        }
        return { startDate: start, endDate: end };
    }, []);

    const driverStats = useMemo(() => {
        return drivers.map(driver => {
            const driverTrips = trips.filter(t => t.driverId === driver.id);
            
            // Filter for trips completed within this cycle for goal calculation
            const cycleTrips = driverTrips.filter(trip => {
                if (trip.status !== 'تکمیل شده' && trip.status !== 'در حال انجام') return false;
                const tripDate = new Date(trip.startDate);
                return tripDate >= startDate && tripDate < endDate;
            });

            const monthlyDistance = cycleTrips.reduce((acc, curr) => acc + (curr.distance || 0), 0);
            const totalDistance = driverTrips.reduce((acc, curr) => acc + (curr.distance || 0), 0);
            const totalTripsCount = driverTrips.length;
            
            const vehicle = vehicles.find(v => v.driverId === driver.id);
            
            return {
                ...driver,
                monthlyDistance,
                totalDistance,
                totalTripsCount,
                vehicleType: vehicle?.type || '---',
                vehiclePlate: vehicle?.plateNumber || '---'
            };
        });
    }, [drivers, trips, startDate, endDate, vehicles]);

    const numberFormatter = new Intl.NumberFormat('fa-IR');

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">آمار عملکرد رانندگان</h3>
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-bold">بازه زمانی محاسبه هدف ماهانه:</span> {startDate.toLocaleDateString('fa-IR')} تا {endDate.toLocaleDateString('fa-IR')}
                </p>
            </div>

            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نام راننده</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">خودرو</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">کل سفرها</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">کارکرد ماه جاری (Km)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت هدف (17k)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {driverStats.map(stat => {
                            const progress = Math.min(100, (stat.monthlyDistance / GOAL_KM) * 100);
                            return (
                                <tr key={stat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{stat.username}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.personnelCode}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {stat.vehicleType} <span className="text-xs text-gray-400">({stat.vehiclePlate})</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {numberFormatter.format(stat.totalTripsCount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 dark:text-gray-100">
                                        {numberFormatter.format(stat.monthlyDistance)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                                        <div className="w-full max-w-xs">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{progress.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                <div 
                                                    className={`h-2.5 rounded-full ${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'}`} 
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DriverStats;


import React, { useState, useMemo } from 'react';
import type { User, Vehicle, Trip } from '../../types';

interface TripAssignmentProps {
    users: User[];
    vehicles: Vehicle[];
    trips: Trip[];
    onAddTrip: (tripData: Omit<Trip, 'id' | 'status'>) => void;
}

// --- Types & Icons ---

const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4-2H5M17 16l-4-4" />
  </svg>
);

const BoltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

// --- Predefined Data ---

interface PredefinedRoute {
    id: number;
    destination: string;
    distance: number; // km (Round trip)
    cargo: string;
    compatibleVehicles: string[]; // Keywords to match vehicle type
    description: string;
    type: 'FAR' | 'NEAR';
}

const PREDEFINED_ROUTES: PredefinedRoute[] = [
    { id: 1, destination: 'بندرعباس', distance: 2600, cargo: 'کنتینر', compatibleVehicles: ['تریلی', 'ولوو', 'اسکانیا'], description: 'بار صادراتی - اسکله رجایی', type: 'FAR' },
    { id: 2, destination: 'مشهد', distance: 1800, cargo: 'آهن آلات', compatibleVehicles: ['تریلی', 'ده چرخ'], description: 'تیرآهن ذوب آهن', type: 'FAR' },
    { id: 3, destination: 'تبریز', distance: 1260, cargo: 'قطعات صنعتی', compatibleVehicles: ['سی اند سی', 'مینی', 'ده چرخ'], description: 'قطعات کارخانه تراکتورسازی', type: 'FAR' },
    { id: 4, destination: 'اهواز', distance: 1650, cargo: 'لوله و اتصالات', compatibleVehicles: ['تریلی', 'ده چرخ'], description: 'پروژه آبرسانی خوزستان', type: 'FAR' },
    { id: 5, destination: 'شیراز', distance: 1850, cargo: 'مواد غذایی', compatibleVehicles: ['تریلی', 'اسکانیا'], description: 'کنسرویجات', type: 'FAR' },
    { id: 6, destination: 'رشت', distance: 650, cargo: 'چوب', compatibleVehicles: ['ده چرخ', 'سی اند سی', 'مینی'], description: 'الوار راش - ناحیه صنعتی', type: 'NEAR' },
    { id: 7, destination: 'اصفهان', distance: 900, cargo: 'سنگ', compatibleVehicles: ['ده چرخ', 'تریلی'], description: 'سنگ اسلپ صادراتی', type: 'NEAR' },
    { id: 8, destination: 'قزوین', distance: 300, cargo: 'شوینده', compatibleVehicles: ['سی اند سی', 'مینی'], description: 'پخش استانی', type: 'NEAR' },
    { id: 9, destination: 'کرمان', distance: 1950, cargo: 'لاستیک', compatibleVehicles: ['تریلی'], description: 'لاستیک بارز', type: 'FAR' },
    { id: 10, destination: 'یزد', distance: 1250, cargo: 'کاشی و سرامیک', compatibleVehicles: ['ده چرخ', 'تریلی'], description: 'کاشی میبد', type: 'FAR' },
    { id: 11, destination: 'ساری', distance: 560, cargo: 'مرکبات', compatibleVehicles: ['ده چرخ', 'سی اند سی'], description: 'جعبه‌های پرتقال', type: 'NEAR' },
    { id: 12, destination: 'ارومیه', distance: 1500, cargo: 'نمک', compatibleVehicles: ['تریلی'], description: 'نمک صنعتی دریاچه', type: 'FAR' },
    { id: 13, destination: 'بوشهر', distance: 2400, cargo: 'تجهیزات نفتی', compatibleVehicles: ['تریلی', 'اسکانیا', 'ولوو'], description: 'پروژه عسلویه', type: 'FAR' },
];


const TripAssignment: React.FC<TripAssignmentProps> = ({ users, vehicles, trips, onAddTrip }) => {
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [origin, setOrigin] = useState('تهران'); 
    const [destination, setDestination] = useState('');
    const [cargoType, setCargoType] = useState('');
    const [distance, setDistance] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    
    const [isQueueOpen, setIsQueueOpen] = useState(false);

    const drivers = useMemo(() => users.filter(u => u.role === 'USER'), [users]);

    // 1. Drivers In Queue Logic (Available Vehicles)
    const driversInQueue = useMemo(() => {
        return drivers.filter(driver => {
            const vehicle = vehicles.find(v => v.driverId === driver.id);
            return vehicle && vehicle.status === 'در دسترس';
        }).map(driver => {
             const vehicle = vehicles.find(v => v.driverId === driver.id);
             // Find last completed trip for this driver to show arrival details
             const lastTrip = trips
                .filter(t => t.driverId === driver.id && t.status === 'تکمیل شده')
                .sort((a, b) => {
                    const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
                    const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
                    return dateB - dateA;
                })[0];

             return { ...driver, vehicle, lastTrip };
        });
    }, [drivers, vehicles, trips]);

    const selectedDriverVehicle = useMemo(() => {
        return vehicles.find(v => v.driverId === selectedDriverId);
    }, [selectedDriverId, vehicles]);

    // 2. History & Balancing Logic
    // Threshold for "Far" vs "Near" is 1000km round trip
    const driverHistory = useMemo(() => {
        if (!selectedDriverId) return null;
        
        const completedTrips = trips
            .filter(t => t.driverId === selectedDriverId && t.status === 'تکمیل شده')
            .sort((a, b) => {
                const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
                const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
                return dateB - dateA;
            });

        const lastTrip = completedTrips.length > 0 ? completedTrips[0] : null;
        const lastDistance = lastTrip ? lastTrip.distance : 0;
        const lastDestination = lastTrip ? lastTrip.destination : 'مرکز';
        
        // If last trip > 1000km (Far) -> Prioritize Short (NEAR)
        // If last trip <= 1000km (Near) -> Prioritize Long (FAR)
        const recommendationStrategy = lastDistance > 1000 ? 'NEAR' : 'FAR';

        return {
            lastTrip,
            lastDistance,
            lastDestination,
            recommendationStrategy
        };
    }, [selectedDriverId, trips]);

    // 3. Filter Routes based on Strategy
    const recommendedRoutes = useMemo(() => {
        let routes = [...PREDEFINED_ROUTES];
        
        if (driverHistory) {
            // Sort: Put matching strategy types first
            routes.sort((a, b) => {
                if (a.type === driverHistory.recommendationStrategy && b.type !== driverHistory.recommendationStrategy) return -1;
                if (a.type !== driverHistory.recommendationStrategy && b.type === driverHistory.recommendationStrategy) return 1;
                return 0;
            });
        }

        return routes;
    }, [driverHistory]);


    const handleSelectRoute = (route: PredefinedRoute) => {
        setDestination(route.destination);
        setCargoType(route.cargo);
        setDistance(route.distance.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDriverId) {
            alert('لطفا یک راننده انتخاب کنید.');
            return;
        }
        if (!selectedDriverVehicle) {
            alert('راننده انتخاب شده خودروی تخصیص داده شده ندارد.');
            return;
        }
        if (!distance || Number(distance) <= 0) {
            alert('لطفا مسافت معتبر وارد کنید.');
            return;
        }

        onAddTrip({
            driverId: selectedDriverId,
            vehicleId: selectedDriverVehicle.id,
            origin,
            destination,
            cargoType,
            distance: Number(distance),
            startDate: new Date(startDate),
            endDate: null
        });

        // Reset Form
        setSelectedDriverId('');
        setDestination('');
        setCargoType('');
        setDistance('');
        alert('بار و مسیر جدید با موفقیت تخصیص یافت و سفر قبلی (در صورت وجود) تکمیل شد.');
    };

    return (
        <div className="space-y-6">
            {/* Queue Status Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                     <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
                        <span className="flex h-3 w-3 relative ml-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        صف انتظار رانندگان (آماده بارگیری)
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{driversInQueue.length} راننده در نوبت هستند.</p>
                </div>
                <button 
                    onClick={() => setIsQueueOpen(true)}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition-colors flex items-center justify-center"
                >
                    <UserCircleIcon className="w-6 h-6 ml-2" />
                    مشاهده لیست نوبت
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column: Assignment Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 h-fit">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                        <TruckIcon className="w-6 h-6 ml-2 text-indigo-500" />
                        فرم تخصیص بار و مسیر
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="driver" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">انتخاب راننده</label>
                            <select
                                id="driver"
                                value={selectedDriverId}
                                onChange={(e) => setSelectedDriverId(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">--- انتخاب کنید ---</option>
                                {drivers.map(driver => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.username} - {driver.personnelCode} {driversInQueue.some(d => d.id === driver.id) ? '(در صف)' : ''}
                                    </option>
                                ))}
                            </select>
                            {selectedDriverVehicle && (
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                                    خودرو: {selectedDriverVehicle.type} | پلاک: {selectedDriverVehicle.plateNumber}
                                </div>
                            )}
                        </div>

                         {/* Smart Recommendation Info Box */}
                         {driverHistory && (
                            <div className={`p-4 rounded-md border ${driverHistory.recommendationStrategy === 'NEAR' ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800'}`}>
                                <div className="flex items-start">
                                    <ArrowPathIcon className={`w-5 h-5 mt-0.5 ml-2 ${driverHistory.recommendationStrategy === 'NEAR' ? 'text-green-600' : 'text-orange-600'}`} />
                                    <div>
                                        <h4 className={`text-sm font-bold ${driverHistory.recommendationStrategy === 'NEAR' ? 'text-green-800 dark:text-green-300' : 'text-orange-800 dark:text-orange-300'}`}>
                                            پیشنهاد سیستم: {driverHistory.recommendationStrategy === 'NEAR' ? 'مسیر نزدیک (زیر ۱۰۰۰ کیلومتر)' : 'مسیر دور (بالای ۱۰۰۰ کیلومتر)'}
                                        </h4>
                                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                            آخرین مقصد: <strong>{driverHistory.lastDestination}</strong> (مسافت: {driverHistory.lastDistance}km). 
                                            {driverHistory.recommendationStrategy === 'NEAR' 
                                                ? ' چون مسیر قبلی طولانی بوده، نوبت مسیر کوتاه (نزدیک) است.'
                                                : ' چون مسیر قبلی کوتاه بوده، نوبت مسیر طولانی (دور) است.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مبدا</label>
                                <input
                                    type="text"
                                    id="origin"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مقصد</label>
                                <input
                                    type="text"
                                    id="destination"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع بار</label>
                            <input
                                type="text"
                                id="cargoType"
                                value={cargoType}
                                onChange={(e) => setCargoType(e.target.value)}
                                required
                                placeholder="نوع بار را وارد کنید"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مسافت (رفت و برگشت)</label>
                                <input
                                    type="number"
                                    id="distance"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                    required
                                    min="1"
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                             <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاریخ شروع</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <BoltIcon className="w-5 h-5 ml-2" />
                                ثبت و تخصیص سفر (تکمیل سفر قبلی)
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Predefined Routes / Smart Queue */}
                <div className="flex flex-col h-full">
                    <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center shadow-md">
                        <h3 className="text-lg font-bold flex items-center">
                            <BoltIcon className="w-5 h-5 ml-2 text-yellow-400" />
                             لیست بارهای موجود
                        </h3>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                             {recommendedRoutes.length} مسیر
                        </span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg shadow flex-1 p-4 overflow-y-auto max-h-[700px]">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            ترتیب نمایش مسیرها بر اساس سیستم نوبت‌دهی هوشمند (تعادل بین مسیر دور و نزدیک) است.
                        </p>
                        <div className="space-y-3">
                            {recommendedRoutes.map((route, idx) => {
                                const isRecommended = driverHistory && route.type === driverHistory.recommendationStrategy;
                                return (
                                    <div 
                                        key={route.id}
                                        onClick={() => handleSelectRoute(route)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden group
                                            ${isRecommended
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500' 
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                                            }
                                        `}
                                    >
                                        {isRecommended && (
                                            <div className="absolute top-0 left-0 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-br-lg shadow-sm">
                                                پیشنهاد سیستم
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{route.destination}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{route.description}</p>
                                            </div>
                                            <div className="text-left">
                                                <span className="block font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded text-sm mb-1">
                                                    {route.distance} km
                                                </span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${route.type === 'FAR' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                                    {route.type === 'FAR' ? 'مسیر دور' : 'مسیر نزدیک'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                بار: {route.cargo}
                                            </span>
                                            <div className="flex gap-1">
                                                {route.compatibleVehicles.map(v => (
                                                    <span key={v} className="text-[10px] bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                                                        {v}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Queue Slide-over */}
            {isQueueOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsQueueOpen(false)}></div>
                    <div className="absolute inset-y-0 left-0 max-w-md w-full flex">
                        <div className="w-full bg-white dark:bg-gray-800 shadow-xl flex flex-col h-full transform transition-transform duration-300 ease-in-out">
                            <div className="px-4 py-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">لیست رانندگان در نوبت</h2>
                                <button onClick={() => setIsQueueOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <span className="sr-only">بستن</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {driversInQueue.length > 0 ? driversInQueue.map(driver => {
                                    const isSelected = selectedDriverId === driver.id;
                                    return (
                                        <div 
                                            key={driver.id} 
                                            onClick={() => { setSelectedDriverId(driver.id); setIsQueueOpen(false); }}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 hover:border-indigo-300'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center">
                                                    <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                                        <UserCircleIcon className={`w-8 h-8 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-300'}`} />
                                                    </div>
                                                    <div className="mr-3">
                                                        <h4 className="font-bold text-gray-900 dark:text-gray-100">{driver.username}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">کد: {driver.personnelCode}</p>
                                                    </div>
                                                </div>
                                                {driver.vehicle && (
                                                    <div className="text-left">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                            {driver.vehicle.type}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {driver.lastTrip && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400 block mb-0.5">ساعت رسیدن:</span>
                                                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                            {driver.lastTrip.endDate 
                                                                ? new Date(driver.lastTrip.endDate).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'}) 
                                                                : 'نامشخص'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400 block mb-0.5">برگشت از:</span>
                                                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                            {driver.lastTrip.origin}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-gray-500 dark:text-gray-400 block mb-0.5">بار برگشتی:</span>
                                                        <span className="font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                                                            {driver.lastTrip.cargoType}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 dark:text-gray-400">هیچ راننده‌ای در صف نیست.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripAssignment;

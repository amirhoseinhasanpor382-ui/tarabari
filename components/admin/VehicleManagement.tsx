import React, { useState, useMemo } from 'react';
import type { Vehicle, User, MaintenanceRecord } from '../../types';

interface VehicleManagementProps {
  vehicles: Vehicle[];
  users: User[];
  maintenanceRecords: MaintenanceRecord[];
  onAddMaintenanceRecord: (vehicleId: string, serviceType: string, cost: number, date: Date) => void;
  onAddVehicle: (code: string, type: string, plateNumber: string) => string | null;
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

const AddVehicleForm: React.FC<{ onAddVehicle: (code: string, type: string, plateNumber: string) => string | null }> = ({ onAddVehicle }) => {
  const [code, setCode] = useState('');
  const [type, setType] = useState('');
  const [platePart1, setPlatePart1] = useState('');
  const [platePart2, setPlatePart2] = useState('ب');
  const [platePart3, setPlatePart3] = useState('');
  const [platePart4, setPlatePart4] = useState('');
  const [error, setError] = useState<string | null>(null);

  const persianLetters = ['ب', 'ج', 'د', 'س', 'ص', 'ط', 'ق', 'ل', 'م', 'ن', 'و', 'ه', 'ی', 'الف', 'پ', 'ت', 'ث', 'ح', 'خ', 'ر', 'ز', 'ژ', 'ش', 'ع', 'ف', 'ک', 'گ'];

  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, maxLength: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value) && value.length <= maxLength) {
          setter(value);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim() || !type.trim() || !platePart1.trim() || !platePart3.trim() || !platePart4.trim() || platePart1.length !== 2 || platePart3.length !== 3 || platePart4.length !== 2) {
      setError('لطفا تمام فیلدها را پر کرده و شماره پلاک را به درستی وارد کنید (مثال: ۱۱ ب ۱۲۳ ایران ۴۴).');
      return;
    }

    const plateNumber = `${platePart1} ${platePart2} ${platePart3} ایران ${platePart4}`;
    
    const result = onAddVehicle(code, type, plateNumber);
    if (result) {
        setError(result);
    } else {
        setCode('');
        setType('');
        setPlatePart1('');
        setPlatePart2('ب');
        setPlatePart3('');
        setPlatePart4('');
        alert('خودرو با موفقیت اضافه شد.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">افزودن خودروی جدید</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert message={error} onClose={() => setError(null)} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicle-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">کد خودرو</label>
              <input
                type="text"
                id="vehicle-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="mt-1 block w-full input-field"
                placeholder="مثال: TR-101"
              />
            </div>
            <div>
              <label htmlFor="vehicle-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع خودرو</label>
              <input
                type="text"
                id="vehicle-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="mt-1 block w-full input-field"
                placeholder="مثال: اسکانیا R450"
              />
            </div>
        </div>
        <div>
          <label htmlFor="vehicle-plate-p1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">شماره پلاک</label>
          <div className="flex items-center gap-2 mt-1" dir="rtl">
            <input
              type="text"
              id="vehicle-plate-p1"
              value={platePart1}
              onChange={handleNumericInputChange(setPlatePart1, 2)}
              required
              className="input-field text-center w-16"
              placeholder="11"
              aria-label="بخش اول پلاک"
            />
            <select
              id="vehicle-plate-p2"
              value={platePart2}
              onChange={(e) => setPlatePart2(e.target.value)}
              required
              className="input-field text-center appearance-none bg-white dark:bg-gray-700 w-16"
              aria-label="حرف پلاک"
            >
              {persianLetters.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <input
              type="text"
              id="vehicle-plate-p3"
              value={platePart3}
              onChange={handleNumericInputChange(setPlatePart3, 3)}
              required
              className="input-field text-center w-20"
              placeholder="123"
              aria-label="بخش سوم پلاک"
            />
            <div className="flex-grow flex items-center gap-2 border-r-2 border-gray-400 dark:border-gray-500 mr-2 pr-2">
              <span className="text-gray-800 dark:text-gray-200 font-bold">ایران</span>
              <input
                type="text"
                id="vehicle-plate-p4"
                value={platePart4}
                onChange={handleNumericInputChange(setPlatePart4, 2)}
                required
                className="input-field text-center w-16"
                placeholder="44"
                aria-label="کد استان پلاک"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          افزودن خودرو
        </button>
      </form>
    </div>
  );
};

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const MaintenanceModal: React.FC<{
    vehicle: Vehicle;
    records: MaintenanceRecord[];
    onClose: () => void;
    onAddRecord: (vehicleId: string, serviceType: string, cost: number, date: Date) => void;
}> = ({ vehicle, records, onClose, onAddRecord }) => {
    const [serviceType, setServiceType] = useState('');
    const [cost, setCost] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceType || !cost || !date || Number(cost) <= 0) {
            alert('لطفا تمام فیلدها را با مقادیر معتبر پر کنید.');
            return;
        }
        onAddRecord(vehicle.id, serviceType, Number(cost), new Date(date));
        setServiceType('');
        setCost('');
        setDate(new Date().toISOString().split('T')[0]);
    };
    
    const costFormatter = new Intl.NumberFormat('fa-IR');

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" onClick={onClose}></div>
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 w-full max-w-3xl border dark:border-gray-700"
                role="dialog"
                aria-modal="true"
                aria-labelledby="maintenanceModalTitle"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 id="maintenanceModalTitle" className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            تاریخچه سرویس: {vehicle.type} ({vehicle.code})
                        </h3>
                        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="بستن">
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 mt-6 max-h-[70vh] overflow-hidden">
                        <div className="md:col-span-3 h-full overflow-y-auto pr-2 -mr-2">
                            <h4 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">تاریخچه</h4>
                            {records.length > 0 ? (
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                                            <tr>
                                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">تاریخ</th>
                                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">نوع سرویس</th>
                                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">هزینه (تومان)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {records.map(rec => (
                                                <tr key={rec.id}>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(rec.date).toLocaleDateString('fa-IR')}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{rec.serviceType}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{costFormatter.format(rec.cost)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">تاریخچه‌ای برای این خودرو ثبت نشده است.</p>
                            )}
                        </div>

                        <div className="md:col-span-2 mt-6 md:mt-0 border-t md:border-t-0 md:border-r border-gray-200 dark:border-gray-700 pt-6 md:pt-0 md:pr-8">
                            <h4 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">ثبت رکورد جدید</h4>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاریخ</label>
                                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-field" />
                                </div>
                                <div>
                                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع سرویس</label>
                                    <input type="text" id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required placeholder="مثال: تعویض روغن" className="mt-1 block w-full input-field" />
                                </div>
                                <div>
                                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">هزینه (تومان)</label>
                                    <input type="number" id="cost" value={cost} onChange={(e) => setCost(e.target.value)} required placeholder="مثال: 500000" className="mt-1 block w-full input-field" />
                                </div>
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    افزودن رکورد
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


const VehicleManagement: React.FC<VehicleManagementProps> = ({ vehicles, users, maintenanceRecords, onAddMaintenanceRecord, onAddVehicle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const userMap = useMemo(() => new Map(users.map(u => [u.id, u.username])), [users]);

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

  const filteredVehicles = useMemo(() =>
    vehicles.filter(v =>
      v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNumber.includes(searchTerm) ||
      (v.driverId && userMap.get(v.driverId)?.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [vehicles, searchTerm, userMap]
  );

  const getStatusBadge = (status: Vehicle['status']) => {
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

  return (
    <>
      <style>{`.input-field { padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); } .dark .input-field { background-color: #374151; border-color: #4B5563; color: #D1D5DB; } .input-field:focus { outline: none; ring: 2px; border-color: #6366F1; } `}</style>
      <div className="space-y-8">
        <AddVehicleForm onAddVehicle={onAddVehicle} />
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 w-full text-right sm:w-auto mb-4 sm:mb-0">لیست خودروها</h2>
            <div className="relative w-full sm:w-auto">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="جستجوی خودرو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-3 pr-10 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          {filteredVehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">کد خودرو</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نوع خودرو</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">شماره پلاک</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">راننده</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">آخرین سرویس</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">عملیات</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{vehicle.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{vehicle.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{vehicle.plateNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{vehicle.driverId ? userMap.get(vehicle.driverId) || 'ناشناس' : '---'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{getStatusBadge(vehicle.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lastMaintenanceMap.get(vehicle.id) ? lastMaintenanceMap.get(vehicle.id)?.toLocaleDateString('fa-IR') : '---'}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <button
                          onClick={() => setSelectedVehicle(vehicle)}
                          className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors duration-200"
                        >
                          مشاهده تاریخچه
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {searchTerm ? 'خودرویی با این مشخصات یافت نشد.' : 'خودرویی برای نمایش وجود ندارد.'}
            </p>
          )}
        </div>
      </div>

      {selectedVehicle && (
        <MaintenanceModal
            vehicle={selectedVehicle}
            records={maintenanceByVehicle[selectedVehicle.id] || []}
            onClose={() => setSelectedVehicle(null)}
            onAddRecord={onAddMaintenanceRecord}
        />
      )}
    </>
  );
};

export default VehicleManagement;
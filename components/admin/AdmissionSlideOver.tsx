import React, { useState, useMemo, Fragment } from 'react';
import type { Vehicle, User, ServiceOrder } from '../../types';

interface AdmissionSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    vehicles: Vehicle[];
    users: User[];
    onAddServiceOrder: (vehicleId: string, issueDescription: string) => void;
}

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

interface RepairItem {
  id: number;
  predefined: string;
  custom: string;
}

const predefinedServices = [
  'تعویض روغن',
  'سرویس دوره ای',
  'تعویض لنت ترمز',
  'تعمیر موتور',
  'سیستم تعلیق',
  'برق خودرو',
  'جلوبندی',
  'سایر...'
];


const AdmissionSlideOver: React.FC<AdmissionSlideOverProps> = ({ isOpen, onClose, vehicles, users, onAddServiceOrder }) => {
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [repairItems, setRepairItems] = useState<RepairItem[]>([{ id: Date.now(), predefined: '', custom: '' }]);

    const userMap = useMemo(() => new Map(users.map(u => [u.id, u.username])), [users]);
    
    const availableVehicles = useMemo(() => 
        vehicles.filter(v => v.status === 'در دسترس'), 
    [vehicles]);

    const handleItemChange = (index: number, type: 'predefined' | 'custom', value: string) => {
        const newItems = [...repairItems];
        newItems[index] = { ...newItems[index], [type]: value };
        // if user selects something other than 'سایر...', clear custom value
        if (type === 'predefined' && value !== 'سایر...') {
            newItems[index].custom = '';
        }
        setRepairItems(newItems);
    };

    const handleAddItem = () => {
        setRepairItems([...repairItems, { id: Date.now(), predefined: '', custom: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        if (repairItems.length > 1) {
            setRepairItems(repairItems.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicleId) {
            alert('لطفا یک خودرو انتخاب کنید.');
            return;
        }
        
        const descriptionItems = repairItems
            .map(item => {
                if (item.predefined === 'سایر...') {
                    return item.custom.trim();
                }
                return item.predefined.trim();
            })
            .filter(item => item !== '');

        if (descriptionItems.length === 0) {
            alert('لطفا حداقل یک مورد برای تعمیر وارد کنید.');
            return;
        }

        const description = descriptionItems.join(' - ');

        onAddServiceOrder(selectedVehicleId, description);
        
        // Reset state after submission
        setSelectedVehicleId('');
        setRepairItems([{ id: Date.now(), predefined: '', custom: '' }]);
    };
    
    if (!isOpen) return null;

    return (
        <div className="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div className="pointer-events-auto w-screen max-w-md">
                            <form onSubmit={handleSubmit} className="flex h-full flex-col divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 shadow-xl">
                                <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                                    <div className="px-4 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <h2 id="slide-over-title" className="text-2xl font-semibold leading-6 text-gray-900 dark:text-gray-100">
                                                پذیرش خودرو جدید
                                            </h2>
                                            <div className="ml-3 flex h-7 items-center">
                                                <button type="button" onClick={onClose} className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                    <span className="sr-only">بستن پنل</span>
                                                    <CloseIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="vehicle" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                                    انتخاب خودرو
                                                </label>
                                                <select
                                                    id="vehicle"
                                                    value={selectedVehicleId}
                                                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                                                    className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-gray-200 dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled>یک خودرو انتخاب کنید...</option>
                                                    {availableVehicles.map(v => (
                                                        <option key={v.id} value={v.id}>
                                                            {v.type} ({v.code}) - {v.plateNumber}
                                                            {v.driverId && ` - ${userMap.get(v.driverId) || 'راننده ناشناس'}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                                    جزئیات تعمیر
                                                </label>
                                                <div className="mt-2 space-y-4">
                                                    {repairItems.map((item, index) => (
                                                        <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600/50">
                                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                                <select
                                                                    value={item.predefined}
                                                                    onChange={(e) => handleItemChange(index, 'predefined', e.target.value)}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                >
                                                                    <option value="" disabled>انتخاب سرویس...</option>
                                                                    {predefinedServices.map(service => (
                                                                        <option key={service} value={service}>{service}</option>
                                                                    ))}
                                                                </select>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveItem(index)}
                                                                    disabled={repairItems.length <= 1}
                                                                    className="p-1 rounded-full text-gray-400 hover:text-red-500 disabled:text-gray-300 disabled:dark:text-gray-600 disabled:cursor-not-allowed"
                                                                    aria-label="حذف مورد"
                                                                >
                                                                    <TrashIcon className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                            {item.predefined === 'سایر...' && (
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        value={item.custom}
                                                                        onChange={(e) => handleItemChange(index, 'custom', e.target.value)}
                                                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-right text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        placeholder="لطفا مورد تعمیر را مشخص کنید..."
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                     <button
                                                        type="button"
                                                        onClick={handleAddItem}
                                                        className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <PlusCircleIcon className="w-5 h-5 ml-2" />
                                                        افزودن مورد دیگر
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-shrink-0 justify-end px-4 py-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-md bg-white dark:bg-gray-700 py-2 px-3 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        لغو
                                    </button>
                                    <button
                                        type="submit"
                                        className="mr-3 inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        ثبت پذیرش
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionSlideOver;
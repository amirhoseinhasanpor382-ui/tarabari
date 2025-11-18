import React, { useState, useMemo } from 'react';
import type { User, Vehicle, ServiceOrder, ServiceOrderStatus } from '../types';
import WorkshopManagement from './admin/WorkshopManagement';
import AdmissionSlideOver from './admin/AdmissionSlideOver';

interface WorkshopPanelProps {
    users: User[];
    vehicles: Vehicle[];
    serviceOrders: ServiceOrder[];
    onAddServiceOrder: (vehicleId: string, issueDescription: string) => void;
    onUpdateServiceOrder: (orderId: string, newStatus: ServiceOrderStatus, notes?: string) => void;
    reportedOverdueOrders: string[];
    onSendOverdueReport: (order: ServiceOrder, vehicle: Vehicle, explanation: string) => void;
}

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


type OverdueOrderInfo = ServiceOrder & { vehicle: Vehicle };

const OverdueReportModal: React.FC<{
    orderInfo: OverdueOrderInfo;
    onClose: () => void;
    onSendReport: (order: ServiceOrder, vehicle: Vehicle, explanation: string) => void;
}> = ({ orderInfo, onClose, onSendReport }) => {
    const [explanation, setExplanation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!explanation.trim()) {
            alert('لطفا توضیحات را وارد کنید.');
            return;
        }
        onSendReport(orderInfo, orderInfo.vehicle, explanation);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50" onClick={onClose}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 w-full max-w-lg p-6 border dark:border-gray-700">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            ثبت توضیحات تاخیر
                        </h3>
                        <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="text-sm">خودرو: <span className="font-semibold">{orderInfo.vehicle.type} ({orderInfo.vehicle.code})</span></p>
                            <p className="text-sm">تاریخ پذیرش: <span className="font-semibold">{new Date(orderInfo.admissionDate).toLocaleDateString('fa-IR')}</span></p>
                        </div>
                        <div>
                            <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">علت تاخیر در تحویل</label>
                            <textarea
                                id="explanation"
                                rows={5}
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="توضیحات خود را اینجا بنویسید... این پیام مستقیما برای مدیر ارشد ارسال خواهد شد."
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            ارسال گزارش به مدیر ارشد
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};


const WorkshopPanel: React.FC<WorkshopPanelProps> = (props) => {
    const { onSendOverdueReport, reportedOverdueOrders, serviceOrders, vehicles } = props;
    const [isAdmissionOpen, setAdmissionOpen] = useState(false);
    const [overdueOrderToReport, setOverdueOrderToReport] = useState<OverdueOrderInfo | null>(null);

    const currentDate = new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleAddServiceOrder = (vehicleId: string, issueDescription: string) => {
        props.onAddServiceOrder(vehicleId, issueDescription);
        setAdmissionOpen(false);
    };

    const vehicleMap = useMemo(() => new Map(vehicles.map(v => [v.id, v])), [vehicles]);

    const overdueOrders = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return serviceOrders
            .filter(order =>
                new Date(order.admissionDate) < thirtyDaysAgo &&
                order.status !== 'تحویل داده شده' &&
                !reportedOverdueOrders.includes(order.id)
            )
            .map(order => ({
                ...order,
                vehicle: vehicleMap.get(order.vehicleId) as Vehicle
            }))
            .filter((order): order is OverdueOrderInfo => !!order.vehicle);
    }, [serviceOrders, reportedOverdueOrders, vehicleMap]);

    return (
        <>
            <div className="max-w-7xl mx-auto">
                {overdueOrders.length > 0 && (
                    <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-r-4 border-red-500 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-red-800 dark:text-red-300 flex items-center">
                            <AlertTriangleIcon className="w-6 h-6 ml-3" />
                            هشدار تاخیر در تحویل
                        </h2>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            خودروهای زیر بیش از ۳۰ روز در تعمیرگاه هستند و نیاز به ثبت توضیحات دارند.
                        </p>
                        <div className="mt-4 space-y-3">
                            {overdueOrders.map(orderInfo => (
                                <div key={orderInfo.id} className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-md border border-red-200 dark:border-red-900/50">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{orderInfo.vehicle.type} ({orderInfo.vehicle.code})</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            تاریخ پذیرش: {new Date(orderInfo.admissionDate).toLocaleDateString('fa-IR')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setOverdueOrderToReport(orderInfo)}
                                        className="mt-2 sm:mt-0 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-md text-sm transition-colors"
                                    >
                                        ثبت توضیحات
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                            پنل تعمیرگاه
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg flex items-center">
                            <CalendarIcon />
                            <span className="mr-2">{currentDate}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setAdmissionOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mt-4 sm:mt-0 transform hover:-translate-y-0.5"
                        aria-label="پذیرش خودرو جدید"
                    >
                        <PlusIcon className="w-5 h-5 ml-2" />
                        <span>پذیرش خودرو جدید</span>
                    </button>
                </div>
                <WorkshopManagement
                    users={props.users}
                    vehicles={props.vehicles}
                    serviceOrders={props.serviceOrders}
                    onUpdateServiceOrder={props.onUpdateServiceOrder}
                />
            </div>

            <AdmissionSlideOver
                isOpen={isAdmissionOpen}
                onClose={() => setAdmissionOpen(false)}
                vehicles={props.vehicles}
                users={props.users}
                onAddServiceOrder={handleAddServiceOrder}
            />

            {overdueOrderToReport && (
                <OverdueReportModal
                    orderInfo={overdueOrderToReport}
                    onClose={() => setOverdueOrderToReport(null)}
                    onSendReport={(order, vehicle, explanation) => {
                        onSendOverdueReport(order, vehicle, explanation);
                        setOverdueOrderToReport(null);
                    }}
                />
            )}
        </>
    );
};

export default WorkshopPanel;
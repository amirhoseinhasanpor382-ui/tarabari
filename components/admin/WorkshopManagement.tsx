
import React, { useState, useMemo } from 'react';
import type { Vehicle, ServiceOrder, ServiceOrderStatus, User } from '../../types';
import { ServiceOrderStatuses } from '../../types';

interface WorkshopManagementProps {
    users: User[];
    vehicles: Vehicle[];
    serviceOrders: ServiceOrder[];
    onUpdateServiceOrder: (orderId: string, newStatus: ServiceOrderStatus, notes?: string) => void;
    onAddServiceOrder?: (vehicleId: string, issueDescription: string) => void;
}

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const EditOrderModal: React.FC<{
    order: ServiceOrder & { vehicle?: Vehicle };
    onClose: () => void;
    onSave: (orderId: string, newStatus: ServiceOrderStatus, notes: string) => void;
}> = ({ order, onClose, onSave }) => {
    const [status, setStatus] = useState(order.status);
    const [notes, setNotes] = useState(order.notes || '');

    const handleSave = () => {
        onSave(order.id, status, notes);
        onClose();
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={onClose}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 w-full max-w-lg p-6 border dark:border-gray-700">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        بروزرسانی سفارش: {order.vehicle?.type} ({order.vehicle?.code})
                    </h3>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon />
                    </button>
                </div>
                <div className="mt-6 space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">علت مراجعه:</p>
                        <p className="text-gray-800 dark:text-gray-200 mt-1">{order.issueDescription}</p>
                    </div>
                    <div>
                        <label htmlFor="order-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تغییر وضعیت</label>
                        <select
                            id="order-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ServiceOrderStatus)}
                            className="mt-1 block w-full pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        >
                            {ServiceOrderStatuses.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">یادداشت تعمیرگاه</label>
                        <textarea
                            id="order-notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="جزئیات تعمیرات و نکات لازم را اینجا بنویسید..."
                        />
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">لغو</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">ذخیره تغییرات</button>
                </div>
            </div>
        </>
    )
};


const WorkshopManagement: React.FC<WorkshopManagementProps> = (props) => {
    const { 
        users,
        vehicles, 
        serviceOrders, 
        onUpdateServiceOrder,
    } = props;
    
    const [editingOrder, setEditingOrder] = useState<(ServiceOrder & { vehicle?: Vehicle }) | null>(null);

    const vehicleMap = useMemo(() => new Map(vehicles.map(v => [v.id, v])), [vehicles]);
    const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

    const handleExportToCSV = (order: ServiceOrder & { vehicle: Vehicle; user?: User }) => {
        const issues = order.issueDescription.split(' - ').map(issue => issue.trim()).filter(Boolean);
        const csvRows: string[] = [];

        // Helper to wrap strings in quotes for CSV
        const csvSafe = (text: string) => `"${text.replace(/"/g, '""')}"`;

        // Row 1: Headers for vehicle/driver info
        csvRows.push(['تاریخ پذیرش', 'کد ماشین', 'شماره پلاک', 'نام راننده'].map(csvSafe).join(','));

        // Row 2: Data for vehicle/driver info
        const infoRow = [
            new Date(order.admissionDate).toLocaleDateString('fa-IR'),
            order.vehicle.code,
            order.vehicle.plateNumber,
            order.user?.username || '---'
        ];
        csvRows.push(infoRow.map(csvSafe).join(','));

        // Row 3: Spacer
        csvRows.push('');

        // Row 4: Headers for issues
        csvRows.push([csvSafe('مشکلات ثبت شده'), '', '', csvSafe('ردیف')].join(','));

        // Rows 5 onwards: Issues list
        issues.forEach((issue, index) => {
            const issueRow = [
                csvSafe(issue),
                '',
                '',
                csvSafe((index + 1).toString())
            ];
            csvRows.push(issueRow.join(','));
        });
        
        // Add empty rows to reach 20 as in the image
        const remainingRows = 20 - issues.length;
        if (remainingRows > 0) {
            for (let i = 0; i < remainingRows; i++) {
                const emptyRow = [
                    '',
                    '',
                    '',
                    csvSafe((issues.length + i + 1).toString())
                ];
                csvRows.push(emptyRow.join(','));
            }
        }

        const csvContent = csvRows.join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const fileName = `paziresh-${order.vehicle.code}-${new Date(order.admissionDate).toLocaleDateString('fa-IR').replace(/\//g, '-')}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const activeOrders = useMemo(() => 
        serviceOrders
            .filter(so => so.status !== 'تحویل داده شده')
            .map(so => {
                const vehicle = vehicleMap.get(so.vehicleId);
                const user = vehicle?.driverId ? userMap.get(vehicle.driverId) : undefined;
                return {
                    ...so,
                    vehicle,
                    user,
                };
            })
            .filter((so): so is ServiceOrder & { vehicle: Vehicle, user?: User } => !!so.vehicle)
            .sort((a,b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()),
        [serviceOrders, vehicleMap, userMap]
    );


    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
                        سفارشات فعال ({activeOrders.length})
                    </h2>
                </div>
                <div>
                    {activeOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">خودرو</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">راننده</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">تاریخ پذیرش</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">علت مراجعه</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">وضعیت</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {activeOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{order.vehicle.type} ({order.vehicle.code})</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {order.user?.username || '---'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(order.admissionDate).toLocaleDateString('fa-IR')}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" title={order.issueDescription}>{order.issueDescription}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-gray-100">{order.status}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <button onClick={() => setEditingOrder(order)} className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">بروزرسانی</button>
                                                <button onClick={() => handleExportToCSV(order)} className="mr-2 text-green-800 bg-green-200 hover:bg-green-300 dark:text-green-100 dark:bg-green-700 dark:hover:bg-green-600 font-medium rounded-lg text-sm px-4 py-2">چاپ</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">هیچ سفارش فعالی وجود ندارد.</p>}
                </div>
            </div>
            
            {editingOrder && (
                <EditOrderModal
                    order={editingOrder}
                    onClose={() => setEditingOrder(null)}
                    onSave={onUpdateServiceOrder}
                />
            )}
        </div>
    );
};

export default WorkshopManagement;

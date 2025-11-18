import React from 'react';
import type { ServiceOrder, Vehicle, User } from '../../types';

interface PrintableAdmissionSlipProps {
    order: ServiceOrder & { vehicle?: Vehicle };
    user?: User;
}

const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4-2H5M17 16l-4-4" />
  </svg>
);


const PrintableAdmissionSlip: React.FC<PrintableAdmissionSlipProps> = ({ order, user }) => {
    if (!order.vehicle) return null;

    return (
        <div className="p-8 bg-white text-black font-[Vazirmatn] w-[210mm] min-h-[297mm] mx-auto" dir="rtl">
            {/* Header */}
            <header className="flex justify-between items-center pb-4 border-b-2 border-gray-800">
                <div className="flex items-center">
                    <div className="p-2 bg-gray-800 text-white rounded-md">
                        <TruckIcon className="w-10 h-10"/>
                    </div>
                    <div className="mr-4">
                        <h1 className="text-3xl font-bold text-gray-800">ترابری سنگین</h1>
                        <p className="text-md text-gray-600">برگه پذیرش تعمیرگاه</p>
                    </div>
                </div>
                <div className="text-left text-sm">
                    <p>شماره سفارش: <span className="font-semibold">{order.id.slice(-6).toUpperCase()}</span></p>
                    <p>تاریخ: <span className="font-semibold">{new Date(order.admissionDate).toLocaleDateString('fa-IR')}</span></p>
                </div>
            </header>

            <main className="mt-6">
                <table className="w-full border-collapse border border-gray-500">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="w-1/2 p-2 border border-gray-500 text-right text-lg font-bold">مشخصات خودرو</th>
                            <th className="w-1/2 p-2 border border-gray-500 text-right text-lg font-bold">مشخصات راننده</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2 border border-gray-500 align-top">
                                <table className="w-full">
                                    <tbody>
                                        <tr><td className="py-1 pr-2 font-semibold">نوع:</td><td className="py-1">{order.vehicle.type}</td></tr>
                                        <tr><td className="py-1 pr-2 font-semibold">کد:</td><td className="py-1">{order.vehicle.code}</td></tr>
                                        <tr><td className="py-1 pr-2 font-semibold">پلاک:</td><td className="py-1">{order.vehicle.plateNumber}</td></tr>
                                    </tbody>
                                </table>
                            </td>
                            <td className="p-2 border border-gray-500 align-top">
                                <table className="w-full">
                                    <tbody>
                                        <tr><td className="py-1 pr-2 font-semibold">نام:</td><td className="py-1">{user ? user.username : '---'}</td></tr>
                                        <tr><td className="py-1 pr-2 font-semibold">کد پرسنلی:</td><td className="py-1">{user ? user.personnelCode : '---'}</td></tr>
                                        <tr><td className="py-1 pr-2 font-semibold">شماره تماس:</td><td className="py-1">{user ? user.phone : '---'}</td></tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-6 border border-gray-500">
                    <h3 className="p-2 bg-gray-100 font-bold text-lg border-b border-gray-500">موارد اعلام شده توسط مشتری</h3>
                    <div className="p-3 min-h-[120px]">
                        <ul className="list-decimal list-inside space-y-2">
                            {order.issueDescription.split(' - ').map((item, index) => (
                                <li key={index} className="text-md">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-6 border border-gray-500">
                    <h3 className="p-2 bg-gray-100 font-bold text-lg border-b border-gray-500">یادداشت کارشناس فنی</h3>
                    <div className="p-2 min-h-[120px]">
                        {/* Empty space for manual notes */}
                    </div>
                </div>
            </main>
            
            <footer className="mt-16">
                <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="text-center">
                        <p className="mb-20 text-lg font-semibold">امضای مشتری</p>
                        <p className="border-t-2 border-dotted border-gray-400 w-3/4 mx-auto pt-2">نام و نام خانوادگی</p>
                    </div>
                    <div className="text-center">
                        <p className="mb-20 text-lg font-semibold">مهر و امضای تعمیرگاه</p>
                        <p className="border-t-2 border-dotted border-gray-400 w-3/4 mx-auto pt-2"></p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PrintableAdmissionSlip;

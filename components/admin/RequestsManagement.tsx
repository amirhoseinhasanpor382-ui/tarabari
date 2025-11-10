
import React from 'react';
import type { Request } from '../../types';

interface RequestsManagementProps {
  requests: Request[];
  onProcessRequest: (requestId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onFinalizeRequest: (requestId: string) => void;
}

const getStatusBadge = (status: Request['status']) => {
  switch (status) {
    case 'PENDING':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300">در انتظار</span>;
    case 'COMPLETED':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">تکمیل شده</span>;
    case 'APPROVED':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300">تایید نهایی</span>;
    case 'FINALIZED':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">نهایی شده</span>;
  }
};

const RequestTable: React.FC<{
  requests: Request[];
  onProcessRequest: (requestId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onFinalizeRequest: (requestId: string) => void;
}> = ({ requests, onProcessRequest, onApproveRequest, onFinalizeRequest }) => {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">نام کاربر</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">عنوان</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">گیرنده</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">عملیات</span></th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50" title={`شرح: ${request.description}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{request.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{request.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{request.recipient}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{getStatusBadge(request.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                {request.status === 'PENDING' && (
                  <button onClick={() => onProcessRequest(request.id)} className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors duration-200">تکمیل کردن</button>
                )}
                {request.status === 'COMPLETED' && (
                  <button onClick={() => onApproveRequest(request.id)} className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors duration-200">تایید نهایی</button>
                )}
                {request.status === 'APPROVED' && (
                  <button onClick={() => onFinalizeRequest(request.id)} className="text-white bg-purple-600 hover:bg-purple-700 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors duration-200">نهایی کردن</button>
                )}
                {request.status === 'FINALIZED' && (
                  <span className="text-gray-400 dark:text-gray-500 font-medium text-sm px-4 py-2 text-center">نهایی شده</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const RequestsManagement: React.FC<RequestsManagementProps> = ({ requests, onProcessRequest, onApproveRequest, onFinalizeRequest }) => {
  const requestCategories: Request['type'][] = ['مرخصی', 'کارت سوخت', 'ترفیع'];

  const groupedRequests = requests.reduce((acc, request) => {
    const type = request.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(request);
    return acc;
  }, {} as Record<Request['type'], Request[]>);

  const hasRequests = requests.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">مدیریت درخواست‌ها</h2>
      {hasRequests ? (
        <div className="space-y-10">
          {requestCategories.map((category) => {
            const categoryRequests = groupedRequests[category];
            if (!categoryRequests || categoryRequests.length === 0) {
              return null;
            }
            return (
              <div key={category}>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  {category} ({categoryRequests.length})
                </h3>
                <RequestTable
                  requests={categoryRequests}
                  onProcessRequest={onProcessRequest}
                  onApproveRequest={onApproveRequest}
                  onFinalizeRequest={onFinalizeRequest}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">در حال حاضر درخواستی برای نمایش وجود ندارد.</p>
      )}
    </div>
  );
};

export default RequestsManagement;

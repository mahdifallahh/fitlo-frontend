import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../types/user';
import { PremiumStatusEnum } from '../../types/user';
import { API_ENDPOINTS } from '../../config/api';

const PremiumRequests: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.admin.premiumRequests, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching premium requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequest = async (coachId: string, status: PremiumStatusEnum) => {
    try {
      await axios.post(`${API_ENDPOINTS.admin.premiumRequests}/${coachId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter(request => request._id !== coachId));
    } catch (error) {
      console.error('Error handling premium request:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-blue-700">
          📋 درخواست‌های پریمیوم
        </h1>
        <div className="text-sm text-gray-500">
          تعداد کل: {requests.length} درخواست
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-right">
            <thead>
              <tr className="bg-blue-50 text-blue-700 text-sm">
                <th className="p-4 font-bold whitespace-nowrap">نام</th>
                <th className="p-4 font-bold whitespace-nowrap">شماره تماس</th>
                <th className="p-4 font-bold whitespace-nowrap">رسید پرداخت</th>
                <th className="p-4 font-bold text-center whitespace-nowrap">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {request.profileImage ? (
                          <img
                            src={request.profileImage}
                            alt={request.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {request.name?.[0] || '?'}
                          </div>
                        )}
                        <span className="font-medium">{request.name}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-gray-600">{request.phone}</td>
                    <td className="p-4 whitespace-nowrap">
                      {request.receiptUrl ? (
                        <a
                          href={request.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          مشاهده رسید
                        </a>
                      ) : (
                        <span className="text-gray-400">بدون رسید</span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          onClick={() => handleRequest(request._id, PremiumStatusEnum.ACCEPTED)}
                          className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          تایید
                        </button>
                        <button
                          onClick={() => handleRequest(request._id, PremiumStatusEnum.REJECTED)}
                          className="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          رد
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>هیچ درخواستی وجود ندارد</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PremiumRequests; 
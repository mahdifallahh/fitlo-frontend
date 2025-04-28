import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../types/user';
import { PremiumStatusEnum } from '../../types/user';

const PremiumRequests: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/admin/premium-requests');
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
      await axios.post(`/api/admin/premium-requests/${coachId}`, { status });
      setRequests(requests.filter(request => request._id !== coachId));
    } catch (error) {
      console.error('Error handling premium request:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10 text-black">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        📋 درخواست‌های پریمیوم
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="overflow-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[500px] text-right">
            <thead>
              <tr className="bg-blue-50 text-blue-700 text-sm">
                <th className="p-3 whitespace-nowrap font-bold">نام</th>
                <th className="p-3 whitespace-nowrap font-bold">شماره تماس</th>
                <th className="p-3 whitespace-nowrap font-bold">رسید پرداخت</th>
                <th className="p-3 whitespace-nowrap font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request._id} className="border-b hover:bg-gray-50 text-gray-800">
                    <td className="p-3 whitespace-nowrap">{request.name}</td>
                    <td className="p-3 whitespace-nowrap">{request.phone}</td>
                    <td className="p-3 whitespace-nowrap">
                      {request.receiptUrl && (
                        <a
                          href={request.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          مشاهده رسید
                        </a>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleRequest(request._id, PremiumStatusEnum.ACCEPTED)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition font-bold"
                      >
                        تایید
                      </button>
                      <button
                        onClick={() => handleRequest(request._id, PremiumStatusEnum.REJECTED)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition font-bold"
                      >
                        رد
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    هیچ درخواستی وجود ندارد
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
import React, { useState } from 'react';
import Modal from '../ui/modal';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

interface ShareExercisesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareExercisesModal: React.FC<ShareExercisesModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    if (password.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        API_ENDPOINTS.exercises.share,
        { password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (data.replaced) {
        toast.warning('⚠️ لینک جدید جایگزین لینک قبلی شد');
      }

      setShareUrl(data.shareUrl);
      toast.success('🔗 لینک با موفقیت ساخته شد');
    } catch (error) {
      toast.error('❌ خطا در ایجاد لینک');
    }
    setIsLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('✅ لینک کپی شد');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 max-h-[80vh] overflow-y-auto text-black relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="بستن"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold text-blue-700 text-center mb-2">
          اشتراک‌گذاری تمرینات
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          برای اشتراک‌گذاری تمرینات خود یک رمز عبور انتخاب کنید.
        </p>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            رمز عبور
          </label>
          <input
            id="password"
            type="password"
            placeholder="رمز عبور را وارد کنید (حداقل ۶ کاراکتر)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <Button
          onClick={handleGenerateLink}
          disabled={isLoading || password.length < 6}
          className="w-full"
        >
          {isLoading ? 'در حال ایجاد لینک...' : 'ایجاد لینک'}
        </Button>

        {shareUrl && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">لینک اشتراک‌گذاری</label>
            <div className="flex items-center space-x-2">
              <input
                readOnly
                value={shareUrl}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? 'کپی شد' : 'کپی'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShareExercisesModal;
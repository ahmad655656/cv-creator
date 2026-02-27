'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Certification } from '../types';

interface CertificationsFormProps {
  certifications: Certification[];
  addCertification: () => void;
  updateCertification: (id: string, field: keyof Certification, value: any) => void;
  removeCertification: (id: string) => void;
}

export function CertificationsForm({ 
  certifications, 
  addCertification, 
  updateCertification, 
  removeCertification 
}: CertificationsFormProps) {
  return (
    <div className="space-y-6">
      {certifications.map((cert, index) => (
        <div key={cert.id} className="relative group">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                شهادة {index + 1}
              </h3>
              <button
                onClick={() => removeCertification(cert.id)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">اسم الشهادة</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="اسم الشهادة"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الجهة المانحة</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="اسم المؤسسة"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">تاريخ الإصدار</label>
                <input
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">تاريخ الانتهاء</label>
                <input
                  type="month"
                  value={cert.expiryDate}
                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                  disabled={cert.doesNotExpire}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={cert.doesNotExpire}
                onChange={(e) => updateCertification(cert.id, 'doesNotExpire', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label className="text-sm text-gray-600 dark:text-gray-400">
                لا تنتهي صلاحيتها
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">معرف الشهادة</label>
                <input
                  type="text"
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="رقم الشهادة"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">رابط التحقق</label>
                <input
                  type="url"
                  value={cert.credentialUrl || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="https://verify.com"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة شهادة جديدة
      </button>
    </div>
  );
}
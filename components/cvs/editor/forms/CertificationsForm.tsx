// components/editor/forms/CertificationsForm.tsx
'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Certification } from '../types';

interface CertificationsFormProps {
  certifications: Certification[];
  addCertification: () => void;
  updateCertification: (id: string, field: string, value: any) => void;
  removeCertification: (id: string) => void;
}

export const CertificationsForm = ({
  certifications,
  addCertification,
  updateCertification,
  removeCertification
}: CertificationsFormProps) => {
  return (
    <div className="space-y-6">
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {cert.name || 'شهادة جديدة'}
            </h3>
            <button
              onClick={() => removeCertification(cert.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم الشهادة
              </label>
              <input
                type="text"
                value={cert.name || ''}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="شهادة في..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الجهة المانحة
              </label>
              <input
                type="text"
                value={cert.issuer || ''}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="الجهة المانحة للشهادة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاريخ الإصدار
              </label>
              <input
                type="month"
                value={cert.date || ''}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاريخ الانتهاء (اختياري)
              </label>
              <input
                type="month"
                value={cert.expiryDate || ''}
                onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                معرف الشهادة (اختياري)
              </label>
              <input
                type="text"
                value={cert.credentialId || ''}
                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="معرف الشهادة"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رابط الشهادة (اختياري)
              </label>
              <input
                type="url"
                value={cert.url || ''}
                onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة شهادة
      </button>
    </div>
  );
};
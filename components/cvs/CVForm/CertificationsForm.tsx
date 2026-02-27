'use client';

import { Certification } from '@/lib/types/template.types';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export function CertificationsForm({ certifications, onChange }: CertificationsFormProps) {
  const addCertification = () => {
    const newCertification: Certification = {
      id: uuidv4(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      doesNotExpire: false,
    };
    onChange([...certifications, newCertification]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    const updated = certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    onChange(updated);
  };

  const removeCertification = (id: string) => {
    onChange(certifications.filter(cert => cert.id !== id));
  };

  return (
    <div className="space-y-6">
      {certifications.map((cert) => (
        <div key={cert.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">شهادة</h3>
            <button
              onClick={() => removeCertification(cert.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">اسم الشهادة</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="مثال: شهادة محترف في إدارة المشاريع PMP"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الجهة المانحة</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="اسم المؤسسة أو الجهة"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">تاريخ الإصدار</label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">تاريخ الانتهاء</label>
              <input
                type="month"
                value={cert.expiryDate}
                onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                disabled={cert.doesNotExpire}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cert.doesNotExpire}
              onChange={(e) => updateCertification(cert.id, 'doesNotExpire', e.target.checked)}
              id={`no-expiry-${cert.id}`}
              className="rounded border-gray-300"
            />
            <label htmlFor={`no-expiry-${cert.id}`} className="text-sm text-gray-600">
              لا تنتهي صلاحيتها
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">معرف الشهادة</label>
              <input
                type="text"
                value={cert.credentialId || ''}
                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="رقم الشهادة أو المعرف"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">رابط التحقق</label>
              <input
                type="url"
                value={cert.credentialUrl || ''}
                onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://example.com/verify"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة شهادة جديدة
      </button>
    </div>
  );
}
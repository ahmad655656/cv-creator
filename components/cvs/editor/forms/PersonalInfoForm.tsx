// components/editor/forms/PersonalInfoForm.tsx
'use client';

import { PersonalInfo } from '../types';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  updatePersonalInfo: (field: string, value: string) => void;
}

export const PersonalInfoForm = ({ personalInfo, updatePersonalInfo }: PersonalInfoFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الاسم الكامل
          </label>
          <input
            type="text"
            value={personalInfo.fullName || ''}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            المسمى الوظيفي
          </label>
          <input
            type="text"
            value={personalInfo.jobTitle || ''}
            onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="مثال: مهندس برمجيات"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={personalInfo.email || ''}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={personalInfo.phone || ''}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="+966 50 000 0000"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            العنوان
          </label>
          <input
            type="text"
            value={personalInfo.address || ''}
            onChange={(e) => updatePersonalInfo('address', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="المدينة، الدولة"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الملخص الشخصي
          </label>
          <textarea
            value={personalInfo.summary || ''}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="اكتب نبذة مختصرة عن نفسك، خبراتك، وأهدافك المهنية..."
          />
        </div>
      </div>
    </div>
  );
};
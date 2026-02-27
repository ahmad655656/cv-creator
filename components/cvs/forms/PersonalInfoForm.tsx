'use client';

import { User, Plus, Upload, X } from 'lucide-react';
import { PersonalInfo } from '../types';
import { useRef, useState } from 'react';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
}

export function PersonalInfoForm({ personalInfo, updatePersonalInfo }: PersonalInfoFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImage, setLocalImage] = useState<string | null>(personalInfo.profileImage || null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      alert('❌ الرجاء اختيار ملف صورة صالح');
      return;
    }

    // التحقق من الحجم
    if (file.size > 2 * 1024 * 1024) {
      alert('❌ حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
      return;
    }

    // قراءة وعرض الصورة
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setLocalImage(imageData);
      updatePersonalInfo('profileImage', imageData);
      alert('✅ تم رفع الصورة بنجاح');
    };
    reader.readAsDataURL(file);

    // إعادة تعيين input file
    event.target.value = '';
  };

  const handleRemoveImage = () => {
    setLocalImage(null);
    updatePersonalInfo('profileImage', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* صورة شخصية */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {/* الصورة - قابلة للضغط */}
          <div 
            onClick={handleImageClick}
            className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
          >
            {localImage ? (
              <img 
                src={localImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
          </div>
          
          {/* زر الإضافة + */}
          <button
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
            type="button"
          >
            <Plus size={14} />
          </button>

          {/* زر الحذف X */}
          {localImage && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow-lg"
              type="button"
            >
              <X size={12} />
            </button>
          )}

          {/* Input file المخفي */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">صورة شخصية</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            أضف صورة احترافية لتعزيز فرصك (أقل من 2 ميجابايت)
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleImageClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 w-full sm:w-auto"
              type="button"
            >
              <Upload size={16} />
              اختر صورة من الجهاز
            </button>
            {localImage && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                ✅ تم رفع الصورة
              </span>
            )}
          </div>
        </div>
      </div>

      {/* باقي الحقول - كما هي */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الاسم الكامل <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
            placeholder="محمد أحمد عبدالله"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            المسمى الوظيفي
          </label>
          <input
            type="text"
            value={personalInfo.jobTitle}
            onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
            placeholder="مطور برمجيات أول"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
            placeholder="mohamed@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
            placeholder="+966 50 123 4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            تاريخ الميلاد
          </label>
          <input
            type="date"
            value={personalInfo.birthDate}
            onChange={(e) => updatePersonalInfo('birthDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الجنسية
          </label>
          <input
            type="text"
            value={personalInfo.nationality}
            onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
            placeholder="مصري"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          العنوان
        </label>
        <input
          type="text"
          value={personalInfo.address}
          onChange={(e) => updatePersonalInfo('address', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
          placeholder="الرياض، السعودية"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          نبذة عني
        </label>
        <textarea
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white resize-none"
          placeholder="اكتب نبذة مختصرة عن خبراتك ومهاراتك وإنجازاتك..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
          {personalInfo.summary.length}/500 حرف
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 dark:text-white">روابط التواصل</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              الموقع الشخصي
            </label>
            <input
              type="url"
              value={personalInfo.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
              placeholder="https://mohamed.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              LinkedIn
            </label>
            <input
              type="url"
              value={personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
              placeholder="https://linkedin.com/in/mohamed"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              GitHub
            </label>
            <input
              type="url"
              value={personalInfo.github || ''}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white"
              placeholder="https://github.com/mohamed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
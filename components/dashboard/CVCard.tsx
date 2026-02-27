'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Eye, Download, Edit, MoreVertical, Copy, Trash2, Share2, Globe, Lock } from 'lucide-react';

interface CVCardProps {
  cv: {
    id: number;
    title: string;
    template_name: string;
    template_thumbnail: string | null;
    is_published: boolean;
    views: number;
    downloads: number;
    share_id: string;
    updated_at: string;
    created_at: string;
  };
}

export function CVCard({ cv }: CVCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/cvs/${cv.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  const handleTogglePublish = async () => {
    try {
      const response = await fetch(`/api/cvs/${cv.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !cv.is_published }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${cv.share_id}`;
    navigator.clipboard.writeText(shareUrl);
    // يمكن إضافة إشعار نجاح هنا
  };

  // منع انتشار حدث النقر عند فتح القائمة
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group">
      {/* Template Preview - هذا الجزء فقط هو الذي يجب أن يكون رابطاً */}
      <Link href={`/cvs/${cv.id}/edit`} className="block">
        <div className="aspect-[210/297] bg-gray-100 relative overflow-hidden">
          {cv.template_thumbnail ? (
            <img
              src={cv.template_thumbnail}
              alt={cv.template_name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-gray-400">معاينة</span>
            </div>
          )}
        </div>
      </Link>

      {/* Status Badge - خارج الرابط */}
      <div className="absolute top-2 right-2 z-10">
        {cv.is_published ? (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm">
            <Globe size={12} />
            منشور
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm">
            <Lock size={12} />
            خاص
          </span>
        )}
      </div>

      {/* CV Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/cvs/${cv.id}/edit`} className="hover:text-blue-600 transition flex-1">
            <h3 className="font-bold text-gray-900">
              {cv.title}
            </h3>
          </Link>
          
          {/* Menu Button */}
          <div className="relative z-20">
            <button
              onClick={handleMenuClick}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
              aria-label="القائمة"
            >
              <MoreVertical size={18} className="text-gray-500" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-40">
                  <button
                    onClick={() => {
                      router.push(`/cvs/${cv.id}/edit`);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-right hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={16} />
                    تعديل
                  </button>
                  <button
                    onClick={() => {
                      copyShareLink();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-right hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Share2 size={16} />
                    نسخ رابط المشاركة
                  </button>
                  <button
                    onClick={() => {
                      handleTogglePublish();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-right hover:bg-gray-50 flex items-center gap-2"
                  >
                    {cv.is_published ? <Lock size={16} /> : <Globe size={16} />}
                    {cv.is_published ? 'إلغاء النشر' : 'نشر'}
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full px-4 py-2 text-right hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <Link href={`/cvs/${cv.id}/edit`} className="block">
          <p className="text-sm text-gray-600 mb-3">قالب: {cv.template_name}</p>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {cv.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <Download size={14} />
              {cv.downloads || 0}
            </span>
          </div>

          {/* Date */}
          <div className="text-xs text-gray-400" suppressHydrationWarning>
            آخر تحديث: {formatDistanceToNow(new Date(cv.updated_at), { addSuffix: true, locale: ar })}
          </div>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف "{cv.title}"؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
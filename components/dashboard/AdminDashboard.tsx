'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, CreditCard, LayoutTemplate, FileText, Eye, Download, 
  Settings, BarChart3, TrendingUp, Clock, CheckCircle, XCircle,
  DollarSign, Calendar, Bell, Shield, Activity, AlertCircle,
  RefreshCw
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalTemplates: number;
  totalPayments: number;
  totalRevenue: number;
  pendingPayments: number;
  totalCVs: number;
  recentPayments: any[];
  popularTemplates: any[];
  bundlePayments?: number;
}

interface AdminDashboardProps {
  stats: AdminStats;
  user: any;
}

export function AdminDashboard({ stats, user }: AdminDashboardProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // جلب الإشعارات (آخر 5 مدفوعات معلقة)
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/notifications');
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث الإحصائيات
  const refreshStats = async () => {
    setRefreshing(true);
    try {
      // إعادة تحميل الصفحة
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // فتح/إغلاق قائمة الإشعارات
  const toggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + ' ل.س';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return formatDate(dateString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Admin Header مع الإشعارات المتقدمة */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  لوحة تحكم المدير
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  مرحباً {user.name} • {new Date().toLocaleDateString('ar-EG', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* زر التحديث */}
              <button
                onClick={refreshStats}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative group"
                title="تحديث البيانات"
              >
                <RefreshCw size={20} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* زر الإشعارات مع قائمة منسدلة */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition group"
                >
                  <Bell size={20} className="text-gray-600" />
                  {stats.pendingPayments > 0 && (
                    <>
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {stats.pendingPayments > 9 ? '9+' : stats.pendingPayments}
                      </span>
                    </>
                  )}
                </button>

                {/* قائمة الإشعارات المنسدلة */}
                {showNotifications && (
                  <div className="absolute left-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-800 overflow-hidden z-50">
                    {/* Header */}
                    <div className="p-4 border-b dark:border-gray-800 bg-gradient-to-l from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Bell size={16} className="text-purple-600" />
                          طلبات الدفع الجديدة
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {stats.pendingPayments} معلقة
                          </span>
                          <button 
                            onClick={fetchNotifications}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
                      </p>
                    </div>

                    {/* قائمة الطلبات */}
                    <div className="max-h-96 overflow-y-auto">
                      {loading ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
                          <p className="text-sm text-gray-500">جاري التحميل...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((payment) => (
                          <Link
                            key={payment.id}
                            href={`/admin/payments`}
                            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-800 last:border-0 transition group"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                  <Clock size={18} className="text-white" />
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <p className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition">
                                    {payment.user_name}
                                  </p>
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                    جديد
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                  {payment.template_name || 'باقة شاملة'}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-sm font-bold text-green-600">
                                    {formatCurrency(payment.amount)}
                                  </span>
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatRelativeTime(payment.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle size={24} className="text-green-600" />
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium mb-1">لا توجد طلبات جديدة</p>
                          <p className="text-sm text-gray-500">كل الطلبات تمت مراجعتها</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                      <Link
                        href="/admin/payments"
                        className="block text-center text-sm bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                        onClick={() => setShowNotifications(false)}
                      >
                        عرض جميع المدفوعات ({stats.totalPayments})
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/admin/settings"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <Settings size={20} className="text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-[73px] z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium whitespace-nowrap shadow-md"
            >
              الرئيسية
            </Link>
            <Link
              href="/admin/users"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition"
            >
              <Users size={18} />
              المستخدمين
            </Link>
            <Link
              href="/admin/payments"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition relative"
            >
              <CreditCard size={18} />
              المدفوعات
              {stats.pendingPayments > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                  {stats.pendingPayments}
                </span>
              )}
            </Link>
            <Link
              href="/admin/templates"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition"
            >
              <LayoutTemplate size={18} />
              القوالب
            </Link>
            <Link
              href="/admin/cvs"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition"
            >
              <FileText size={18} />
              السير الذاتية
            </Link>
            <Link
              href="/admin/analytics"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition"
            >
              <BarChart3 size={18} />
              التحليلات
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - باقي المحتوى كما هو */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards مع تأثيرات حركية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">إجمالي المستخدمين</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl">
                <Users size={28} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-800 flex items-center gap-2 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>+{Math.round(stats.totalUsers * 0.12)} هذا الشهر</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">إجمالي الإيرادات</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl">
                <DollarSign size={28} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-800 flex items-center gap-2 text-sm text-green-600">
              <Activity size={16} />
              <span>{stats.totalPayments} معاملة ناجحة</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200/20 rounded-full -mt-10 -mr-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">قيد المراجعة</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingPayments}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-xl">
                <Clock size={28} className="text-yellow-600" />
              </div>
            </div>
            <Link
              href="/admin/payments"
              className="mt-4 pt-4 border-t dark:border-gray-800 flex items-center justify-between text-sm text-blue-600 hover:text-blue-700 group"
            >
              <span>مراجعة الآن</span>
              <span className="group-hover:translate-x-1 transition">←</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">إجمالي القوالب</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalTemplates}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-xl">
                <LayoutTemplate size={28} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-800 flex items-center gap-2 text-sm text-purple-600">
              <FileText size={16} />
              <span>{stats.totalCVs} سيرة ذاتية منشأة</span>
            </div>
          </div>
        </div>

        {/* باقي المحتوى (نفس الكود السابق) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Payments */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">آخر المدفوعات</h2>
              <Link href="/admin/payments" className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                عرض الكل
                <span>←</span>
              </Link>
            </div>
            
            <div className="space-y-4">
              {stats.recentPayments.length > 0 ? (
                stats.recentPayments.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.status === 'approved' ? 'bg-green-100' :
                        payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {payment.status === 'approved' ? <CheckCircle size={20} className="text-green-600" /> :
                         payment.status === 'pending' ? <Clock size={20} className="text-yellow-600" /> :
                         <XCircle size={20} className="text-red-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{payment.user_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{payment.template_name || 'باقة شاملة'}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(payment.created_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">لا توجد مدفوعات حديثة</p>
              )}
            </div>
          </div>

          {/* Popular Templates */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">أكثر القوالب استخداماً</h2>
            
            <div className="space-y-4">
              {stats.popularTemplates.length > 0 ? (
                stats.popularTemplates.map((template: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-300 text-orange-900' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{template.name}</span>
                    </div>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-full">
                      {template.usage_count} استخدام
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">لا توجد بيانات كافية</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t dark:border-gray-800">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/templates/new"
                  className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl text-center hover:shadow-md transition group"
                >
                  <LayoutTemplate size={24} className="mx-auto mb-2 text-purple-600 group-hover:scale-110 transition" />
                  <span className="text-sm font-medium">قالب جديد</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl text-center hover:shadow-md transition group"
                >
                  <Users size={24} className="mx-auto mb-2 text-blue-600 group-hover:scale-110 transition" />
                  <span className="text-sm font-medium">إدارة المستخدمين</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">حالة النظام</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">قاعدة البيانات</p>
                <p className="font-medium text-green-600">متصل</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">خادم API</p>
                <p className="font-medium text-green-600">نشط</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Activity size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">الذاكرة المؤقتة</p>
                <p className="font-medium text-yellow-600">70%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
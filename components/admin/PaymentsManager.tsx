'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, XCircle, Eye, Download, Search, 
  Filter, ChevronLeft, ChevronRight, Clock, Package, Crown
} from 'lucide-react';
import Image from 'next/image';

interface Payment {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  template_id: number;
  template_name: string;
  amount: number;
  sender_number: string;
  receiver_number: string;
  transaction_date: string;
  screenshot: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  payment_type?: 'single' | 'bundle'; // إضافة نوع الدفع
}

interface PaymentsManagerProps {
  payments: Payment[];
}

export function PaymentsManager({ payments }: PaymentsManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      payment.template_name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.sender_number?.includes(search);
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.payment_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApprove = async (paymentId: number) => {
    if (!confirm('هل أنت متأكد من الموافقة على هذا الدفع؟')) return;
    
    setProcessingId(paymentId);
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'approved',
          adminNotes 
        }),
      });

      if (response.ok) {
        router.refresh();
        setSelectedPayment(null);
        setShowImageModal(false);
        setAdminNotes('');
      } else {
        alert('حدث خطأ في الموافقة على الدفع');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('حدث خطأ في الاتصال بالخادم');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (paymentId: number) => {
    const reason = prompt('الرجاء إدخال سبب الرفض:');
    if (!reason) return;
    
    setProcessingId(paymentId);
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          adminNotes: reason 
        }),
      });

      if (response.ok) {
        router.refresh();
        setSelectedPayment(null);
        setShowImageModal(false);
        setAdminNotes('');
      } else {
        alert('حدث خطأ في رفض الدفع');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('حدث خطأ في الاتصال بالخادم');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle size={12} /> مقبول</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><XCircle size={12} /> مرفوض</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Clock size={12} /> قيد المراجعة</span>;
    }
  };

  const getPaymentTypeBadge = (type?: string) => {
    if (type === 'bundle') {
      return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Package size={12} /> باقة شاملة</span>;
    }
    return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Crown size={12} /> قالب مفرد</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + ' ل.س';
  };

  // إحصائيات حسب النوع
  const bundlePayments = payments.filter(p => p.payment_type === 'bundle');
  const singlePayments = payments.filter(p => p.payment_type !== 'bundle');

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث باسم المستخدم أو البريد أو القالب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">جميع الأنواع</option>
            <option value="single">قالب مفرد</option>
            <option value="bundle">باقة شاملة</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{payments.length}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">إجمالي المعاملات</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {payments.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">قيد المراجعة</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {payments.filter(p => p.status === 'approved').length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">مقبولة</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {payments.filter(p => p.status === 'rejected').length}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">مرفوضة</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {bundlePayments.length}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">باقات شاملة</div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">المستخدم</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">القالب / الباقة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">النوع</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">المبلغ</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">رقم المرسل</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">التاريخ</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{payment.user_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{payment.user_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">
                      {payment.payment_type === 'bundle' ? '📦 باقة شاملة' : payment.template_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getPaymentTypeBadge(payment.payment_type)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {payment.sender_number}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {formatDate(payment.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowImageModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      {payment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(payment.id)}
                            disabled={processingId === payment.id}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition disabled:opacity-50"
                            title="موافقة"
                          >
                            <CheckCircle size={18} className="text-green-600" />
                          </button>
                          <button
                            onClick={() => handleReject(payment.id)}
                            disabled={processingId === payment.id}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-50"
                            title="رفض"
                          >
                            <XCircle size={18} className="text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">لا توجد مدفوعات مطابقة للبحث</p>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showImageModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                تفاصيل الدفع
              </h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedPayment(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* نوع الدفع */}
              {selectedPayment.payment_type === 'bundle' && (
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 p-4 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-lg mb-2">
                    <Package size={24} />
                    <span>باقة شاملة - جميع القوالب</span>
                  </div>
                  <p className="text-sm">سيتم تفعيل جميع القوالب للمستخدم بعد الموافقة</p>
                </div>
              )}

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">اسم المستخدم</label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.user_name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">البريد الإلكتروني</label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.user_email}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {selectedPayment.payment_type === 'bundle' ? 'الباقة' : 'القالب'}
                  </label>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedPayment.payment_type === 'bundle' ? '📦 باقة شاملة' : selectedPayment.template_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">المبلغ</label>
                  <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(selectedPayment.amount)}</p>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">رقم المرسل</label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.sender_number}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">رقم المستلم</label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.receiver_number}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ التحويل</label>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedPayment.transaction_date).toLocaleString('ar-EG')}
                </p>
              </div>

              {/* Screenshot */}
              {selectedPayment.screenshot && (
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">صورة الإيصال</label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <img
                      src={selectedPayment.screenshot}
                      alt="Payment Screenshot"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {selectedPayment.status === 'pending' && (
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">ملاحظات المشرف</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="أضف ملاحظات حول هذا الدفع..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              )}

              {selectedPayment.admin_notes && (
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">ملاحظات المشرف</label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {selectedPayment.admin_notes}
                  </p>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">الحالة</label>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              {/* Actions for pending payments */}
              {selectedPayment.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t dark:border-gray-800">
                  <button
                    onClick={() => {
                      handleApprove(selectedPayment.id);
                    }}
                    disabled={processingId === selectedPayment.id}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-medium disabled:opacity-50"
                  >
                    {processingId === selectedPayment.id ? 'جاري المعالجة...' : 'موافقة على الدفع'}
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedPayment.id);
                    }}
                    disabled={processingId === selectedPayment.id}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50"
                  >
                    {processingId === selectedPayment.id ? 'جاري المعالجة...' : 'رفض الدفع'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
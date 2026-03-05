'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock3, Eye, Package, Search, XCircle } from 'lucide-react';

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
  payment_type?: 'single' | 'bundle';
}

interface PaymentsManagerProps {
  payments: Payment[];
}

const dateFormatter = new Intl.DateTimeFormat('ar-SY-u-nu-arab', {
  timeZone: 'Asia/Damascus',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export function PaymentsManager({ payments: initialPayments }: PaymentsManagerProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const q = search.toLowerCase();
      const matchesSearch =
        payment.user_name?.toLowerCase().includes(q) ||
        payment.user_email?.toLowerCase().includes(q) ||
        payment.template_name?.toLowerCase().includes(q) ||
        payment.sender_number?.includes(search);

      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesType = typeFilter === 'all' || payment.payment_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [payments, search, statusFilter, typeFilter]);

  const applyPaymentUpdate = (
    paymentId: number,
    nextStatus: Payment['status'],
    notes: string | null
  ) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: nextStatus,
              admin_notes: notes,
            }
          : payment
      )
    );
    setSelectedPayment((prev) =>
      prev && prev.id === paymentId
        ? {
            ...prev,
            status: nextStatus,
            admin_notes: notes,
          }
        : prev
    );
  };

  const handleApprove = async (paymentId: number) => {
    if (!confirm('تأكيد الموافقة على هذه الدفعة؟')) return;

    setProcessingId(paymentId);
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          adminNotes,
        }),
      });

      if (response.ok) {
        applyPaymentUpdate(paymentId, 'approved', adminNotes || null);
        setSelectedPayment(null);
        setAdminNotes('');
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert('حدث خطأ أثناء الموافقة على الدفعة.');
      }
    } catch (error) {
      console.error(error);
      alert('تعذر الاتصال بالخادم.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (paymentId: number) => {
    const reason = prompt('أدخل سبب الرفض:');
    if (!reason) return;

    setProcessingId(paymentId);
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          adminNotes: reason,
        }),
      });

      if (response.ok) {
        applyPaymentUpdate(paymentId, 'rejected', reason);
        setSelectedPayment(null);
        setAdminNotes('');
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert('حدث خطأ أثناء رفض الدفعة.');
      }
    } catch (error) {
      console.error(error);
      alert('تعذر الاتصال بالخادم.');
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (amount: number) => `${amount.toLocaleString('ar-SY')} ل.س`;

  const formatDate = (dateString: string) => {
    const parts = dateFormatter.formatToParts(new Date(dateString));
    const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const day = (partMap.day || '').replace(/\u200f/g, '');
    const month = (partMap.month || '').replace(/\u200f/g, '');
    const year = (partMap.year || '').replace(/\u200f/g, '');
    const hour = (partMap.hour || '').replace(/\u200f/g, '');
    const minute = (partMap.minute || '').replace(/\u200f/g, '');
    const dayPeriod = (partMap.dayPeriod || '').replace(/\u200f/g, '');
    return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}`.trim();
  };

  const statusBadge = (status: Payment['status']) => {
    if (status === 'approved') {
      return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={12} />مقبول</span>;
    }
    if (status === 'rejected') {
      return <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700"><XCircle size={12} />مرفوض</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"><Clock3 size={12} />قيد المراجعة</span>;
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="بحث باسم المستخدم، البريد، القالب، أو رقم المرسل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm"
          >
            <option value="all">كل الحالات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm"
          >
            <option value="all">كل الأنواع</option>
            <option value="single">قالب مفرد</option>
            <option value="bundle">باقة شاملة</option>
          </select>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="text-right px-4 py-3 font-semibold">المستخدم</th>
                <th className="text-right px-4 py-3 font-semibold">القالب</th>
                <th className="text-right px-4 py-3 font-semibold">المبلغ</th>
                <th className="text-right px-4 py-3 font-semibold">المرسل</th>
                <th className="text-right px-4 py-3 font-semibold">التاريخ</th>
                <th className="text-right px-4 py-3 font-semibold">الحالة</th>
                <th className="text-right px-4 py-3 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{payment.user_name}</p>
                    <p className="text-xs text-slate-500">{payment.user_email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {payment.payment_type === 'bundle' ? 'الباقة الشاملة' : payment.template_name}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(payment.amount)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{payment.sender_number}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(payment.created_at)}</td>
                  <td className="px-4 py-3">{statusBadge(payment.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setAdminNotes(payment.admin_notes ?? '');
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="عرض التفاصيل"
                      >
                        <Eye size={16} />
                      </button>
                      {payment.status === 'pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(payment.id)}
                            disabled={processingId === payment.id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                            title="موافقة"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(payment.id)}
                            disabled={processingId === payment.id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                            title="رفض"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">لا توجد نتائج مطابقة للفلاتر.</div>
        ) : null}
      </section>

      {selectedPayment ? (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">تفاصيل عملية الدفع</h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedPayment(null);
                  setAdminNotes('');
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <XCircle size={16} />
              </button>
            </div>

            <div className="space-y-4 p-4 sm:p-5">
              {selectedPayment.payment_type === 'bundle' ? (
                <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-700">
                  <div className="font-semibold flex items-center gap-2"><Package size={16} /> هذا الطلب خاص بالباقة الشاملة.</div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="المستخدم" value={selectedPayment.user_name} />
                <Field label="البريد" value={selectedPayment.user_email} />
                <Field label="القالب" value={selectedPayment.payment_type === 'bundle' ? 'الباقة الشاملة' : selectedPayment.template_name} />
                <Field label="المبلغ" value={formatCurrency(selectedPayment.amount)} />
                <Field label="رقم المرسل" value={selectedPayment.sender_number} />
                <Field label="رقم المستلم" value={selectedPayment.receiver_number} />
                <Field label="التاريخ" value={formatDate(selectedPayment.transaction_date)} />
                <div>
                  <p className="mb-1 text-xs text-slate-500">الحالة</p>
                  {statusBadge(selectedPayment.status)}
                </div>
              </div>

              {selectedPayment.screenshot ? (
                <div>
                  <p className="mb-2 text-xs text-slate-500">صورة الإيصال</p>
                  <img src={selectedPayment.screenshot} alt="Payment Screenshot" className="w-full rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
              ) : null}

              {selectedPayment.status === 'pending' ? (
                <div>
                  <p className="mb-2 text-xs text-slate-500">ملاحظات المشرف</p>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                    placeholder="اكتب ملاحظاتك هنا..."
                  />
                </div>
              ) : selectedPayment.admin_notes ? (
                <Field label="ملاحظات المشرف" value={selectedPayment.admin_notes} />
              ) : null}

              {selectedPayment.status === 'pending' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedPayment.id)}
                    disabled={processingId === selectedPayment.id}
                    className="rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {processingId === selectedPayment.id ? 'جار المعالجة...' : 'موافقة على الدفع'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedPayment.id)}
                    disabled={processingId === selectedPayment.id}
                    className="rounded-xl bg-rose-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    {processingId === selectedPayment.id ? 'جار المعالجة...' : 'رفض الدفع'}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs text-slate-500">{label}</p>
      <p className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
}


import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import Link from 'next/link';
import { 
  Plus, FileText, Eye, Download, MoreVertical, Calendar, Edit, Trash2,
  Users, CreditCard, LayoutTemplate, BarChart3, Settings, Shield, Bell,
  Crown, Package
} from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { CVCard } from '@/components/dashboard/CVCard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

const sql = neon(process.env.DATABASE_URL!);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // ✅ للتشخيص - شوف البيانات في الـ console
  console.log('👤 Session user:', session.user);
  console.log('👤 User role:', session.user?.role);

  // التحقق من دور المستخدم
  const userRole = session.user?.role || 'user';
  const isAdmin = userRole === 'admin';

  console.log('👑 Is admin?', isAdmin);

  // ✅ إذا كان المستخدم أدمن، اعرض AdminDashboard فقط
  if (isAdmin) {
    console.log('👑 Admin logged in - showing AdminDashboard');
    
    // إحصائيات عامة للأدمن
    const [
      totalUsers,
      totalTemplates,
      totalPayments,
      pendingPayments,
      totalCVs,
      recentPayments,
      popularTemplates,
      bundlePayments
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM templates`,
      sql`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'approved'`,
      sql`SELECT COUNT(*) as count FROM payments WHERE status = 'pending'`,
      sql`SELECT COUNT(*) as count FROM cvs`,
      sql`
        SELECT p.*, u.name as user_name, u.email, t.name as template_name,
               CASE WHEN p.template_id = 0 THEN 'bundle' ELSE 'single' END as payment_type
        FROM payments p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN templates t ON p.template_id = t.id
        ORDER BY p.created_at DESC
        LIMIT 5
      `,
      sql`
        SELECT t.name, COUNT(c.id) as usage_count
        FROM templates t
        LEFT JOIN cvs c ON t.slug = c.template_id
        GROUP BY t.id, t.name
        ORDER BY usage_count DESC
        LIMIT 5
      `,
      sql`SELECT COUNT(*) as count FROM payments WHERE template_id = 0 AND status = 'approved'`
    ]);

    const adminStats = {
      totalUsers: totalUsers[0]?.count || 0,
      totalTemplates: totalTemplates[0]?.count || 0,
      totalPayments: totalPayments[0]?.count || 0,
      totalRevenue: totalPayments[0]?.total || 0,
      pendingPayments: pendingPayments[0]?.count || 0,
      totalCVs: totalCVs[0]?.count || 0,
      recentPayments: recentPayments || [],
      popularTemplates: popularTemplates || [],
      bundlePayments: bundlePayments[0]?.count || 0
    };

    // ✅ عرض AdminDashboard فقط
    return (
      <AdminDashboard 
        stats={adminStats}
        user={session.user}
      />
    );
  }

  // ✅ إذا كان المستخدم عادي، اعرض UserDashboard
  console.log('👤 User logged in - showing UserDashboard');
  
  // باقي كود المستخدم العادي...
  // جلب السير الذاتية للمستخدم
  const cvs = await sql`
    SELECT c.*, t.name as template_name, t.thumbnail as template_thumbnail, t.is_premium
    FROM cvs c
    LEFT JOIN templates t ON c.template_id = t.slug
    WHERE c.user_id = ${parseInt(session.user?.id)}
    ORDER BY c.updated_at DESC
  `;

  // التحقق من وجود باقة شاملة للمستخدم
  const userBundle = await sql`
    SELECT * FROM payments 
    WHERE user_id = ${parseInt(session.user?.id)} 
    AND template_id = 0 
    AND status = 'approved'
    LIMIT 1
  `;

  const hasBundle = userBundle.length > 0;

  // جلب القوالب المشتراة
  const purchasedTemplates = await sql`
    SELECT t.* 
    FROM templates t
    JOIN payments p ON t.id = p.template_id
    WHERE p.user_id = ${parseInt(session.user?.id)} 
    AND p.status = 'approved'
    AND p.template_id != 0
    AND t.is_premium = true
  `;

  // جلب جميع القوالب للباقة
  let allTemplates: any[] = [];
  if (hasBundle) {
    allTemplates = await sql`
      SELECT * FROM templates 
      WHERE is_premium = true
      ORDER BY name
    `;
  }

  // إحصائيات المستخدم
  const stats = {
    total: cvs.length,
    published: cvs.filter(cv => cv.is_published).length,
    views: cvs.reduce((acc, cv) => acc + (cv.views || 0), 0),
    downloads: cvs.reduce((acc, cv) => acc + (cv.downloads || 0), 0),
    purchasedTemplates: hasBundle ? allTemplates.length : purchasedTemplates.length,
    totalSpent: hasBundle ? 70000 : purchasedTemplates.reduce((acc, t) => acc + (t.price || 0), 0),
    hasBundle
  };

  // القوالب المعروضة
  const displayTemplates = hasBundle ? allTemplates : purchasedTemplates;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {session.user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  مرحباً {session.user.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {new Date().toLocaleDateString('ar-EG', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                {hasBundle && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                    <Package size={16} />
                    <span>مشترك في الباقة الشاملة</span>
                    <Crown size={16} className="text-yellow-500" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/templates"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                <LayoutTemplate size={20} />
                استعرض القوالب
              </Link>
              <Link
                href="/cvs/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus size={20} />
                إنشاء سيرة ذاتية جديدة
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* باقي محتوى UserDashboard */}
      <div className="container mx-auto px-4 py-8">
        {/* إحصائيات المستخدم */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">السير الذاتية</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">منشورة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.published}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <Eye size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">المشاهدات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.views}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Eye size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">التحميلات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.downloads}</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <Download size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">القوالب المتاحة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.purchasedTemplates}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <CreditCard size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* القوالب المتاحة */}
        {displayTemplates.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {hasBundle ? 'جميع القوالب (باقة شاملة)' : 'القوالب المشتراة'}
              </h2>
              {hasBundle && (
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Package size={16} />
                  10 قوالب متاحة
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/cvs/new/${template.slug}`}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 hover:shadow-lg transition text-center group relative"
                >
                  {hasBundle && (
                    <div className="absolute top-2 right-2">
                      <Crown size={14} className="text-yellow-500" />
                    </div>
                  )}
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 group-hover:scale-110 transition">
                    {template.name.charAt(0)}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {template.category}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* السير الذاتية */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">السير الذاتية</h2>
            <Link href="/cvs" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              عرض الكل
              <span className="text-lg">←</span>
            </Link>
          </div>

          {cvs.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-12 text-center">
              <FileText size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                لا توجد سير ذاتية بعد
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                ابدأ مسيرتك المهنية بإنشاء سيرتك الذاتية الأولى باستخدام قوالبنا الاحترافية
              </p>
              <Link
                href="/cvs/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                إنشاء سيرة ذاتية
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <CVCard key={cv.id} cv={cv} />
              ))}
            </div>
          )}
        </div>

        {/* نصائح مخصصة */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                💡
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">نصيحة ذهبية</h3>
                <p className="text-white/90 max-w-xl">
                  {stats.total === 0 
                    ? 'ابدأ بإنشاء سيرتك الذاتية الأولى الآن! استخدم أحد قوالبنا الاحترافية.'
                    : stats.published === 0
                    ? 'قم بنشر سيرتك الذاتية للحصول على رابط مشاركة فريد وإرساله لأصحاب العمل.'
                    : 'شارك سيرتك الذاتية على LinkedIn ووسائل التواصل الاجتماعي لزيادة فرصك.'
                  }
                </p>
              </div>
            </div>
            <Link
              href={stats.total === 0 ? "/cvs/new" : "/templates"}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition font-medium whitespace-nowrap shadow-lg"
            >
              {stats.total === 0 ? 'ابدأ الآن' : 'استعرض القوالب'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
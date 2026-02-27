import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // إذا كان المستخدم مسجل دخوله
  if (session) {
    const userRole = session.user.role || 'user';
    
    // إذا كان أدمن → يوجه إلى dashboard الأدمن
    if (userRole === 'admin') {
      redirect('/admin');
    }
    
    // إذا كان مستخدم عادي → يوجه إلى dashboard المستخدم
    redirect('/dashboard');
  }

  // إذا لم يكن مسجل دخوله → يعرض الصفحة الرئيسية
  return (
    <div className=" bg-gradient-to-br min-h-[100vh] from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            أنشئ سيرتك الذاتية الاحترافية
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            اختر من بين 50+ قالب احترافي وصمم سيرتك الذاتية في دقائق
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
            >
              ابدأ مجاناً
            </Link>
            <Link 
              href="/templates" 
              className="bg-white hover:bg-gray-100 text-gray-800 px-8 py-3 rounded-lg text-lg font-medium transition border"
            >
              استعرض القوالب
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">قوالب احترافية</h3>
            <p className="text-gray-600">أكثر من 50 قالب متنوع لمختلف المجالات</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">سهل وسريع</h3>
            <p className="text-gray-600">أنشئ سيرتك الذاتية في خطوات بسيطة</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">تصدير PDF</h3>
            <p className="text-gray-600">حمّل سيرتك الذاتية بصيغة PDF</p>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600">+50</div>
              <div className="text-gray-600">قالب احترافي</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">+1000</div>
              <div className="text-gray-600">مستخدم</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">+5000</div>
              <div className="text-gray-600">سيرة ذاتية</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-2xl p-12 max-w-3xl mx-auto shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            جاهز لبدء مسيرتك المهنية؟
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            أنشئ سيرتك الذاتية الآن وزد فرصك في الحصول على الوظيفة
          </p>
          <Link 
            href="/register" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-xl font-medium transition inline-block"
          >
            ابدأ مجاناً
          </Link>
        </div>
      </div>
    </div>
  );
}
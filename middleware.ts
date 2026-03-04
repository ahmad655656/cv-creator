import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// قائمة المسارات العامة التي لا تحتاج مصادقة
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/templates',
  '/pricing',
  '/study-questions',
  '/logo-studio',
  '/test-db',
  '/test',
  '/api/auth',
  '/api/test-db',
  '/api/study/questions',
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // API routes should handle auth inside each route and return JSON, not redirects.
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // التحقق إذا كان المسار عاماً
    const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    // إذا كان المسار عاماً، اسمح بالوصول
    if (isPublicPath) {
      return NextResponse.next();
    }

    // إذا لم يكن هناك token والمسار ليس عاماً
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      // أضف المسار الأصلي كـ callbackUrl
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // كل شيء طبيعي
    return NextResponse.next();
  },
  {
    callbacks: {
      // لا نريد أن يمنع withAuth الوصول تلقائياً
      authorized: () => true,
    },
  }
);

// تطبيق middleware على كل المسارات باستثناء static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

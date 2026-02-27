import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 Authorize called for:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const users = await sql`
            SELECT id, name, email, password_hash, role 
            FROM users 
            WHERE email = ${credentials.email}
          `;
          
          const user = users[0];
          console.log('📦 User from DB:', user);

          if (!user || !user.password_hash) return null;

          const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);
          if (!passwordMatch) return null;

          // ✅ إرجاع كائن كامل مع role
          const userToReturn = {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role, // هذا مهم جداً
          };
          
          console.log('✅ User returned from authorize:', userToReturn);
          return userToReturn;
          
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔑 JWT callback - user received:', user);
      console.log('🔑 JWT callback - token before:', token);
      
      // ✅ إذا كان user موجود (أي تسجيل دخول جديد)، أضف كل البيانات
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        console.log('✅ Role added to token:', user.role);
      }
      
      console.log('🔑 JWT callback - token after:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('📋 Session callback - token:', token);
      console.log('📋 Session callback - session before:', session);
      
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      
      console.log('📋 Session callback - session after:', session);
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

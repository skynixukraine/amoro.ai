import NextAuth from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import { RequestInternal } from 'next-auth';
import axios from '@/common/config';
console.log('check');

export default NextAuth({
  session: { strategy: 'jwt', maxAge: 3600 },
  providers: [
    Credentials({
      // @ts-ignore
      async authorize(
        credentials: Record<string, string>,
        req: RequestInternal
      ) {
        const email = credentials.email;
        const password = credentials.password;
        const userData = await axios.post(`/api/auth/login`, {
          email,
          password,
        });
        const user: any = userData.data;
        if (user) {
          axios.post(`/api/history`, {
            name: `${user.firstName} ${user.lastName}`,
            userId: user.id,
          });
        }
        return user || null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
});

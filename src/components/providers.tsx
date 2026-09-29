'use client';

import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '521094424048-65p6soaovklg8t8kkpg53400mj5r32sg.apps.googleusercontent.com';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

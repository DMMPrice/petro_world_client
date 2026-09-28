'use client';

import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '521094424048-l0141t7rubl1q8hf4di8vd80utcen68f.apps.googleusercontent.com';

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

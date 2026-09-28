'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Droplets } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setLoading(true);
    try {
      await signInWithGoogle(credential);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-navy font-bold text-2xl mb-2">
            <Droplets className="text-brand" size={32} />
            <span>Petro<span className="text-brand">World</span></span>
          </div>
          <p className="text-slate-500">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/40 text-slate-800"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/40 text-slate-800"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand-dark disabled:bg-slate-200 disabled:text-slate-400 text-navy font-bold rounded-xl transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="relative my-6">
            <div className="border-t border-slate-200" />
            <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-3 text-xs text-slate-400">OR</span>
          </div>
          <div className="flex justify-center [&>div]:w-full [&_iframe]:!w-full">
            <GoogleLogin
              onSuccess={(response) => {
                if (response.credential) void handleGoogleLogin(response.credential);
                else toast.error('Google did not return a credential');
              }}
              onError={() => toast.error('Google sign-in failed')}
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-brand font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

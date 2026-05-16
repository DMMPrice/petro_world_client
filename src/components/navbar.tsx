'use client';

import Link from 'next/link';
import { Droplets, ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    toast.success('Signed out');
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl shrink-0">
              <Droplets className="text-brand" size={28} />
              <span className="hidden sm:block">Petro<span className="text-brand">World</span></span>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 flex items-center max-w-2xl mx-auto">
              <div className="flex w-full rounded-lg overflow-hidden border-2 border-brand focus-within:border-brand-light transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 px-4 py-2.5 text-slate-800 bg-white text-sm outline-none"
                />
                <button
                  type="submit"
                  className="bg-brand hover:bg-brand-dark px-4 flex items-center justify-center transition-colors"
                >
                  <Search size={20} className="text-navy" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 shrink-0">
              {user ? (
                <>
                  <Link href="/profile" className="hidden md:flex items-center gap-1.5 text-white hover:text-brand transition-colors text-sm">
                    <User size={20} />
                    <span className="hidden lg:block">Account</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="hidden md:block text-sm px-3 py-1.5 rounded border border-slate-600 text-slate-300 hover:border-brand hover:text-brand transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:flex items-center gap-1.5 text-sm px-4 py-2 rounded bg-brand hover:bg-brand-dark text-navy font-bold transition-colors"
                >
                  <User size={16} />
                  Sign In
                </Link>
              )}

              <Link href="/cart" className="relative flex items-center gap-1.5 text-white hover:text-brand transition-colors">
                <div className="relative">
                  <ShoppingCart size={22} />
                  <span className="absolute -top-2 -right-2 bg-brand text-navy text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">0</span>
                </div>
                <span className="hidden lg:block text-sm">Cart</span>
              </Link>

              <button
                className="md:hidden text-slate-300 hover:text-white p-1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-6 h-9 text-sm">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">Home</Link>
              <Link href="/products" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">All Products</Link>
              <Link href="/products?category=Engine%20Oils" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">Engine Oils</Link>
              <Link href="/products?category=Safety%20Signboards" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">Safety Signs</Link>
              <Link href="/products?category=Petroleum%20Uniforms" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">Uniforms</Link>
              <Link href="/products?category=Flooring%20%26%20Mats" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">Flooring & Mats</Link>
              <Link href="/products?category=Station%20Accessories" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">Accessories</Link>
              {user && (
                <Link href="/orders" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">My Orders</Link>
              )}
            </nav>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-navy-800 border-t border-slate-700 px-4 pb-4 pt-3 flex flex-col gap-3">
          <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden border border-brand">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-slate-800 bg-white text-sm outline-none"
            />
            <button type="submit" className="bg-brand px-3 flex items-center">
              <Search size={16} className="text-navy" />
            </button>
          </form>
          <Link href="/" className="text-slate-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/products" className="text-slate-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>All Products</Link>
          {user ? (
            <>
              <Link href="/orders" className="text-slate-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link href="/profile" className="text-slate-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleSignOut} className="text-left text-red-400 hover:text-red-300 py-1">Sign Out</button>
            </>
          ) : (
            <Link href="/auth/login" className="text-brand font-semibold py-1" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
}

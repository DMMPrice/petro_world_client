import { Droplets } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-navy text-slate-400 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
            <Droplets className="text-brand" size={24} />
            <span>Petro<span className="text-brand">World</span></span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            India&apos;s trusted supplier of petroleum station equipment, safety signboards, uniforms, and accessories.
          </p>
          <div className="flex gap-2">
            <span className="bg-navy-800 border border-slate-700 text-xs px-3 py-1.5 rounded">🇮🇳 Made in India</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="hover:text-white hover:text-brand transition-colors">Home</Link>
            <Link href="/products" className="hover:text-white transition-colors">All Products</Link>
            <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
            <Link href="/orders" className="hover:text-white transition-colors">My Orders</Link>
            <Link href="/profile" className="hover:text-white transition-colors">My Account</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Categories</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/products?category=Engine%20Oils" className="hover:text-white transition-colors">Engine Oils</Link>
            <Link href="/products?category=Safety%20Signboards" className="hover:text-white transition-colors">Safety Signboards</Link>
            <Link href="/products?category=Petroleum%20Uniforms" className="hover:text-white transition-colors">Petroleum Uniforms</Link>
            <Link href="/products?category=Flooring%20%26%20Mats" className="hover:text-white transition-colors">Flooring & Mats</Link>
            <Link href="/products?category=Station%20Accessories" className="hover:text-white transition-colors">Station Accessories</Link>
            <Link href="/products?category=Fuel%20Additives" className="hover:text-white transition-colors">Fuel Additives</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Contact Us</h4>
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-white font-medium">Customer Support</p>
              <p>support@petroworld.in</p>
            </div>
            <div>
              <p className="text-white font-medium">Phone</p>
              <p>+91 98765 43210</p>
            </div>
            <div>
              <p className="text-white font-medium">Hours</p>
              <p>Mon–Sat, 9am–6pm IST</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>&copy; {new Date().getFullYear()} PetroWorld. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

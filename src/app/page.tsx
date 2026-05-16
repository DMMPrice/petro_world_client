import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { serverFetch } from '@/lib/api';
import { ArrowRight, Truck, Shield, RotateCcw, CreditCard, ChevronRight } from 'lucide-react';

async function getHomeData() {
  const [products, categories] = await Promise.all([
    serverFetch('/products/trending').catch(() => []),
    serverFetch('/categories').catch(() => []),
  ]);
  return { products, categories };
}

const categoryIcons: Record<string, string> = {
  'Engine Oils': '🛢️',
  'Transmission Fluids': '⚙️',
  'Brake Fluids': '🔴',
  'Greases & Lubricants': '🔧',
  'Coolants & Antifreeze': '❄️',
  'Fuel Additives': '⛽',
  'Safety Signboards': '⚠️',
  'Petroleum Uniforms': '👕',
  'Flooring & Mats': '🟦',
  'Station Accessories': '🧢',
};

export default async function HomePage() {
  const { products, categories } = await getHomeData();
  const flashDeals = products.slice(0, 8);
  const featuredProducts = products.slice(0, 10);

  return (
    <div className="bg-slate-100 min-h-screen">
      <section className="bg-gradient-to-r from-navy via-navy-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-block bg-brand/20 border border-brand/40 text-brand text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4">
              Exclusive Deals
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              UP TO <span className="text-brand">30% OFF</span><br />
              on Petroleum Station Supplies
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-6 max-w-lg">
              Engine oils, safety signboards, uniforms, rubber mats — everything your station needs, delivered fast.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/products"
                className="px-8 py-3 bg-brand hover:bg-brand-dark text-navy font-black rounded transition-colors flex items-center gap-2 text-sm"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                href="/products?category=Safety%20Signboards"
                className="px-8 py-3 border border-slate-500 hover:border-brand hover:text-brand text-white rounded transition-colors text-sm"
              >
                Safety Signs
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center gap-4 flex-wrap max-w-sm">
            {[
              { emoji: '⚠️', label: 'Safety Signs', href: '/products?category=Safety%20Signboards' },
              { emoji: '👕', label: 'Uniforms', href: '/products?category=Petroleum%20Uniforms' },
              { emoji: '🟦', label: 'Rubber Mats', href: '/products?category=Flooring%20%26%20Mats' },
              { emoji: '🛢️', label: 'Engine Oils', href: '/products?category=Engine%20Oils' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="w-32 h-28 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs font-semibold text-slate-200">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { icon: <Truck size={18} className="text-brand" />, label: 'Free Delivery', sub: 'On orders over ₹999' },
            { icon: <Shield size={18} className="text-brand" />, label: 'Genuine Products', sub: '100% authentic' },
            { icon: <RotateCcw size={18} className="text-brand" />, label: 'Easy Returns', sub: '7-day return policy' },
            { icon: <CreditCard size={18} className="text-brand" />, label: 'COD Available', sub: 'Pay on delivery' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-3 py-2">
              {item.icon}
              <div>
                <p className="font-bold text-slate-800 text-sm leading-tight">{item.label}</p>
                <p className="text-xs text-slate-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">Shop by Category</h2>
              <Link href="/products" className="text-brand text-sm flex items-center gap-1 hover:text-brand-dark font-medium">
                See all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {categories.slice(0, 10).map((cat: { id: string; title: string }) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.title)}`}
                  className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-brand/5 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-brand/10 group-hover:bg-brand/20 flex items-center justify-center text-2xl transition-colors">
                    {categoryIcons[cat.title] || '📦'}
                  </div>
                  <span className="text-xs text-center text-slate-700 font-medium leading-tight line-clamp-2">{cat.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-6">
          <div className="bg-white rounded-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">Today's Deals</h2>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">LIVE</span>
              </div>
              <Link href="/products" className="text-brand text-sm flex items-center gap-1 hover:text-brand-dark font-medium">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {flashDeals.map((product: { id: string; title: string; brand_name: string; price: number; price_after_discount?: number; images?: string[]; rating?: number; num_reviews?: number }) => (
                <div key={product.id} className="shrink-0 w-44">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">Featured Products</h2>
              <Link href="/products" className="text-brand text-sm flex items-center gap-1 hover:text-brand-dark font-medium">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {featuredProducts.map((product: { id: string; title: string; brand_name: string; price: number; price_after_discount?: number; images?: string[]; rating?: number; num_reviews?: number }) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-sm border border-slate-200 p-16 text-center text-slate-400">
            <p className="text-lg mb-1">No products available</p>
            <p className="text-sm">Make sure the backend is running.</p>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-gradient-to-r from-navy to-navy-800 rounded-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🏆</div>
            <div>
              <h3 className="font-bold mb-1">Genuine Products</h3>
              <p className="text-slate-400 text-sm">Direct from authorized distributors. Every product verified for authenticity.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-3xl">🚚</div>
            <div>
              <h3 className="font-bold mb-1">Pan-India Delivery</h3>
              <p className="text-slate-400 text-sm">Free delivery on orders over ₹999. Express options available in major cities.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔄</div>
            <div>
              <h3 className="font-bold mb-1">Hassle-Free Returns</h3>
              <p className="text-slate-400 text-sm">7-day easy return policy. No questions asked on eligible products.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

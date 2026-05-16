import { ProductCard } from '@/components/product-card';
import { serverFetch } from '@/lib/api';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchParams {
  category?: string;
  q?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}

async function getProducts(searchParams: SearchParams) {
  if (searchParams.q) {
    return serverFetch(`/search?q=${encodeURIComponent(searchParams.q)}`).catch(() => []);
  }
  const params = new URLSearchParams();
  if (searchParams.category) params.set('categoryName', searchParams.category);
  return serverFetch(`/products?${params}`).catch(() => []);
}

async function getCategories() {
  return serverFetch('/categories').catch(() => []);
}

function sortProducts(products: Product[], sort?: string): Product[] {
  if (!sort || sort === 'default') return products;
  const arr = [...products];
  if (sort === 'price_asc') return arr.sort((a, b) => (a.price_after_discount ?? a.price) - (b.price_after_discount ?? b.price));
  if (sort === 'price_desc') return arr.sort((a, b) => (b.price_after_discount ?? b.price) - (a.price_after_discount ?? a.price));
  if (sort === 'rating') return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return arr;
}

function filterByPrice(products: Product[], minPrice?: string, maxPrice?: string): Product[] {
  if (!minPrice && !maxPrice) return products;
  const min = minPrice ? Number(minPrice) : 0;
  const max = maxPrice ? Number(maxPrice) : Infinity;
  return products.filter((p) => {
    const price = p.price_after_discount ?? p.price;
    return price >= min && price <= max;
  });
}

interface Product {
  id: string;
  title: string;
  brand_name: string;
  price: number;
  price_after_discount?: number;
  images?: string[];
  rating?: number;
  num_reviews?: number;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [rawProducts, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const filtered = filterByPrice(rawProducts, params.minPrice, params.maxPrice);
  const products = sortProducts(filtered, params.sort);

  const hasActiveFilters = params.category || params.q || params.minPrice || params.maxPrice;

  const buildFilterUrl = (overrides: Partial<SearchParams>) => {
    const merged = { ...params, ...overrides };
    const qs = new URLSearchParams();
    if (merged.q) qs.set('q', merged.q);
    if (merged.category) qs.set('category', merged.category);
    if (merged.sort) qs.set('sort', merged.sort);
    if (merged.minPrice) qs.set('minPrice', merged.minPrice);
    if (merged.maxPrice) qs.set('maxPrice', merged.maxPrice);
    return `/products?${qs.toString()}`;
  };

  const priceRanges = [
    { label: 'Under ₹500', min: '0', max: '500' },
    { label: '₹500 – ₹1,000', min: '500', max: '1000' },
    { label: '₹1,000 – ₹2,500', min: '1000', max: '2500' },
    { label: '₹2,500 – ₹5,000', min: '2500', max: '5000' },
    { label: 'Above ₹5,000', min: '5000', max: '' },
  ];

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="bg-navy py-3 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form className="flex gap-2" method="GET">
            {params.category && <input type="hidden" name="category" value={params.category} />}
            {params.sort && <input type="hidden" name="sort" value={params.sort} />}
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 rounded border border-slate-600 bg-navy-800 text-white placeholder-slate-400 focus:outline-none focus:border-brand text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-brand hover:bg-brand-dark text-navy font-bold rounded text-sm transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-slate-600 flex items-center gap-1">
              <SlidersHorizontal size={14} />
              Applied filters:
            </span>
            {params.category && (
              <Link
                href={buildFilterUrl({ category: undefined })}
                className="flex items-center gap-1 px-3 py-1 bg-brand text-navy text-xs font-bold rounded-full"
              >
                {params.category} <X size={11} />
              </Link>
            )}
            {params.q && (
              <Link
                href={buildFilterUrl({ q: undefined })}
                className="flex items-center gap-1 px-3 py-1 bg-brand text-navy text-xs font-bold rounded-full"
              >
                &ldquo;{params.q}&rdquo; <X size={11} />
              </Link>
            )}
            {(params.minPrice || params.maxPrice) && (
              <Link
                href={buildFilterUrl({ minPrice: undefined, maxPrice: undefined })}
                className="flex items-center gap-1 px-3 py-1 bg-brand text-navy text-xs font-bold rounded-full"
              >
                Price filter <X size={11} />
              </Link>
            )}
            <Link href="/products" className="text-xs text-slate-500 hover:text-slate-800 underline flex items-center">
              Clear all
            </Link>
          </div>
        )}

        <div className="flex gap-4">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white border border-slate-200 rounded-sm">
              <div className="px-4 py-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                  <SlidersHorizontal size={14} />
                  Filters
                </h3>
              </div>

              <div className="px-4 py-3 border-b border-slate-100">
                <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wide mb-2">Category</h4>
                <div className="flex flex-col gap-1">
                  <Link
                    href={buildFilterUrl({ category: undefined })}
                    className={`text-sm px-2 py-1.5 rounded transition-colors ${!params.category ? 'bg-brand/10 text-brand font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat: { id: string; title: string }) => (
                    <Link
                      key={cat.id}
                      href={buildFilterUrl({ category: cat.title })}
                      className={`text-sm px-2 py-1.5 rounded transition-colors ${params.category === cat.title ? 'bg-brand/10 text-brand font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3">
                <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wide mb-2">Price Range</h4>
                <div className="flex flex-col gap-1">
                  {priceRanges.map((range) => {
                    const isActive = params.minPrice === range.min && params.maxPrice === range.max;
                    return (
                      <Link
                        key={range.label}
                        href={buildFilterUrl({ minPrice: range.min, maxPrice: range.max })}
                        className={`text-sm px-2 py-1.5 rounded transition-colors ${isActive ? 'bg-brand/10 text-brand font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {range.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="bg-white border border-slate-200 rounded-sm px-4 py-3 mb-3 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-800">{products.length}</span> products found
                {params.category && <span className="ml-1">in <span className="font-semibold text-brand">{params.category}</span></span>}
              </p>
              <form method="GET" className="flex items-center gap-2">
                {params.category && <input type="hidden" name="category" value={params.category} />}
                {params.q && <input type="hidden" name="q" value={params.q} />}
                {params.minPrice && <input type="hidden" name="minPrice" value={params.minPrice} />}
                {params.maxPrice && <input type="hidden" name="maxPrice" value={params.maxPrice} />}
                <label className="text-xs text-slate-500">Sort by:</label>
                <select
                  name="sort"
                  defaultValue={params.sort || 'default'}
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  className="text-sm border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:border-brand bg-white"
                >
                  <option value="default">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </form>
            </div>

            <div className="flex flex-wrap gap-2 mb-3 md:hidden">
              <Link
                href={buildFilterUrl({ category: undefined })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!params.category ? 'bg-brand text-navy border-brand' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                All
              </Link>
              {categories.slice(0, 6).map((cat: { id: string; title: string }) => (
                <Link
                  key={cat.id}
                  href={buildFilterUrl({ category: cat.title })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${params.category === cat.title ? 'bg-brand text-navy border-brand' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  {cat.title}
                </Link>
              ))}
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-sm text-center py-20 text-slate-400">
                <p className="text-lg mb-2">No products found</p>
                <p className="text-sm mb-4">Try a different search or category</p>
                <Link href="/products" className="text-brand hover:underline text-sm font-medium">
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

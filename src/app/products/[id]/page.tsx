import Image from 'next/image';
import { serverFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Star } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { AddToCartButton } from './add-to-cart-button';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  try {
    return await serverFetch(`/products/${id}`);
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const reviews = await serverFetch(`/reviews/${id}`).catch(() => []);
  const related = await serverFetch(`/products/${id}/related`).catch(() => []);

  const displayPrice = product.price_after_discount ?? product.price;
  const hasDiscount = product.price_after_discount && product.price_after_discount < product.price;
  const discount = hasDiscount
    ? Math.round(((product.price - product.price_after_discount) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
            <Image
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-brand text-navy text-sm font-bold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.slice(1, 5).map((img: string, i: number) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                  <Image src={img} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-brand font-semibold uppercase tracking-wide mb-1">{product.brand_name}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{product.title}</h1>

          {product.rating !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} className={i <= Math.round(Number(product.rating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                ))}
              </div>
              <span className="text-sm text-slate-500">{Number(product.rating).toFixed(1)} ({product.num_reviews ?? 0} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-800">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span className="text-lg text-slate-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.description && (
            <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>
          )}

          <div className="mb-6">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${(product.stock_quantity ?? 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {(product.stock_quantity ?? 0) > 0 ? `In Stock (${product.stock_quantity} left)` : 'Out of Stock'}
            </span>
          </div>

          <AddToCartButton productId={product.id} disabled={(product.stock_quantity ?? 0) === 0} />
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review: { id: string; rating: number; comment: string; profiles?: { first_name?: string } }) => (
              <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className={i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{review.profiles?.first_name || 'Customer'}</span>
                </div>
                <p className="text-slate-700 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.slice(0, 4).map((p: { id: string; title: string; brand_name: string; price: number; price_after_discount?: number; images?: string[]; rating?: number; num_reviews?: number }) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

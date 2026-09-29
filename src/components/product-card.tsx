'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Truck } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getProductImages } from '@/lib/product-images';

interface Product {
  id: string;
  title: string;
  brand_name: string;
  price: number;
  price_after_discount?: number;
  image_url?: string;
  images?: string[];
  gallery_urls?: string[];
  rating?: number;
  num_reviews?: number;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const image = getProductImages(product)[0] || '/placeholder.png';
  const isInlineImage = image.startsWith('data:image/');
  const displayPrice = product.price_after_discount ?? product.price;
  const hasDiscount = product.price_after_discount && product.price_after_discount < product.price;
  const discount = hasDiscount
    ? Math.round(((product.price - product.price_after_discount!) / product.price) * 100)
    : 0;

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      toast.success('Added to cart');
    } catch {
      toast.error('Sign in to add to cart');
    }
  };

  const rating = product.rating ? Number(product.rating) : 0;
  const fullStars = Math.floor(rating);

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        'group bg-[rgba(255,253,249,0.92)] rounded-[0.75rem] border border-slate-200/80 hover:shadow-[0_20px_45px_rgba(23,32,51,0.14)] hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col',
        className
      )}
    >
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {isInlineImage ? (
          <img
            src={image}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={image.startsWith('http')}
          />
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-brand text-navy text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {discount}% off
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <p className="text-xs text-brand-dark font-bold uppercase tracking-wide">{product.brand_name}</p>
        <h3 className="text-sm text-slate-800 line-clamp-2 leading-snug font-semibold">{product.title}</h3>

        {rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              <span>{rating.toFixed(1)}</span>
              <Star size={9} className="fill-white" />
            </div>
            <span className="text-xs text-slate-500">({product.num_reviews ?? 0})</span>
          </div>
        )}

        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          {hasDiscount && (
            <p className="text-xs text-green-600 font-medium">Save {formatPrice(product.price - displayPrice)}</p>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <Truck size={11} className="text-slate-400" />
          <span className="text-xs text-slate-500">Free Delivery</span>
        </div>

        <button
          onClick={addToCart}
          className="mt-3 w-full py-2.5 bg-navy hover:bg-navy-800 text-white font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-1.5"
          aria-label="Add to cart"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

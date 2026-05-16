'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    title: string;
    brand_name: string;
    price: number;
    price_after_discount?: number;
    images?: string[];
  };
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await api.get('/cart');
      setCart(data);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    await api.patch(`/cart/${itemId}`, { quantity: qty });
    fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await api.delete(`/cart/${itemId}`);
    toast.success('Item removed');
    fetchCart();
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.products.price_after_discount ?? item.products.price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-400">Loading...</div>
  );

  if (cart.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={64} className="text-slate-300 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-slate-700 mb-2">Your cart is empty</h2>
      <p className="text-slate-500 mb-6">Add some products to get started</p>
      <Link href="/products" className="px-6 py-2.5 bg-brand text-navy font-bold rounded-full">
        Shop Now
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Your Cart ({cart.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const price = item.products.price_after_discount ?? item.products.price;
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                  <Image
                    src={item.products.images?.[0] || '/placeholder.png'}
                    alt={item.products.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">{item.products.brand_name}</p>
                  <p className="font-semibold text-slate-800 text-sm truncate">{item.products.title}</p>
                  <p className="text-brand font-bold mt-1">{formatPrice(price)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 border border-slate-200 rounded-lg">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-slate-100">
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-slate-100">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{formatPrice(price * item.quantity)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
          <h2 className="font-bold text-slate-800 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-slate-800">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block text-center py-3 bg-brand hover:bg-brand-dark text-navy font-bold rounded-xl transition-colors"
          >
            Proceed to Checkout
          </Link>
          {subtotal < 999 && (
            <p className="text-xs text-slate-500 text-center mt-3">
              Add {formatPrice(999 - subtotal)} more for free shipping
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

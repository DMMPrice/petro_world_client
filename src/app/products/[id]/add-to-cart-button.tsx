'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function AddToCartButton({ productId, disabled }: { productId: string; disabled: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
    setLoading(true);
    try {
      await api.post('/cart', { productId, quantity });
      toast.success(`${quantity} item(s) added to cart`);
    } catch {
      toast.error('Please sign in to add items to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700">Quantity</span>
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-slate-100 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 font-semibold text-slate-800">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-slate-100 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <button
        onClick={addToCart}
        disabled={disabled || loading}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand hover:bg-brand-dark disabled:bg-slate-200 disabled:text-slate-400 text-navy font-bold transition-colors"
      >
        <ShoppingCart size={20} />
        {loading ? 'Adding...' : disabled ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}

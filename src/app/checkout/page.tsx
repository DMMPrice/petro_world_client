'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

interface Address {
  id: string;
  name: string;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
}

interface CartItem {
  id: string;
  quantity: number;
  products: { id: string; price: number; price_after_discount?: number; title: string };
}

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    Promise.all([
      api.get('/addresses').catch(() => []),
      api.get('/cart').catch(() => []),
    ]).then(([addr, cartData]) => {
      setAddresses(addr);
      setCart(cartData);
      if (addr.length > 0) setSelectedAddress(addr[0].id);
    });
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.products.price_after_discount ?? item.products.price;
    return sum + price * item.quantity;
  }, 0);

  const placeOrder = async () => {
    if (!selectedAddress) { toast.error('Please select an address'); return; }
    setPlacing(true);
    try {
      const items = cart.map((item) => ({
        product_id: item.products.id,
        quantity: item.quantity,
        price_at_purchase: item.products.price_after_discount ?? item.products.price,
      }));
      await api.post('/orders', {
        addressId: selectedAddress,
        total: subtotal + (subtotal >= 999 ? 0 : 50),
        items,
        paymentMethod,
      });
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">Delivery Address</h2>
            {addresses.length === 0 ? (
              <p className="text-slate-500 text-sm">No saved addresses. <a href="/profile" className="text-brand underline">Add one in your profile.</a></p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-brand bg-brand/5' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{addr.name}</p>
                      <p className="text-slate-500 text-sm">{addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {['Cash on Delivery', 'Razorpay'].map((method) => (
                <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === method ? 'border-brand bg-brand/5' : 'border-slate-200'}`}>
                  <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span className="text-slate-700 font-medium text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
          <h2 className="font-bold text-slate-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-slate-600 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="truncate pr-2">{item.products.title} &times;{item.quantity}</span>
                <span>{formatPrice((item.products.price_after_discount ?? item.products.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600"><span>Shipping</span><span>{subtotal >= 999 ? 'Free' : formatPrice(50)}</span></div>
            <div className="flex justify-between font-bold text-slate-800 text-base">
              <span>Total</span><span>{formatPrice(subtotal + (subtotal >= 999 ? 0 : 50))}</span>
            </div>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing || cart.length === 0}
            className="mt-6 w-full py-3 bg-brand hover:bg-brand-dark disabled:bg-slate-200 disabled:text-slate-400 text-navy font-bold rounded-xl transition-colors"
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

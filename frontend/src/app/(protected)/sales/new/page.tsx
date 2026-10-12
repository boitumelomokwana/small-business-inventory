'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export default function NewSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock_quantity < 1) {
      setError('Product is out of stock');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        if (newQty > product.stock_quantity) {
          setError(`Only ${product.stock_quantity} units available`);
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, subtotal: newQty * product.price }
            : item
        );
      }
      return [...prev, { product, quantity: 1, subtotal: product.price }];
    });
    setError('');
  };

  const updateQuantity = (productId: string, newQty: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        if (newQty > item.product.stock_quantity) {
          setError(`Only ${item.product.stock_quantity} units available`);
          return item;
        }
        return { ...item, quantity: newQty, subtotal: newQty * item.product.price };
      }
      return item;
    }));
    setError('');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      await api.post('/sales', { items });
      router.push('/sales');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'An error occurred while recording sale');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Sale</h1>
          <Link
            href="/sales"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Price: R{p.price.toFixed(2)} | Stock: {p.stock_quantity}</p>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  disabled={p.stock_quantity === 0}
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Current Sale</h2>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">Cart is empty</p>
            ) : (
              <>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between py-3">
                      <div className="flex-1 pr-4">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">R{item.product.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                          className="w-12 rounded border border-slate-300 bg-white px-1 py-1 text-center text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="ml-4 text-right text-sm font-medium text-slate-900 dark:text-white">
                        R{item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-bold text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span>R{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={cart.length === 0 || isSaving}
                  className="w-full rounded-md bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {isSaving ? 'Processing...' : 'Complete Sale'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

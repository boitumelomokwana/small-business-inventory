'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (p: Product) => {
    if (p.stock_quantity === 0) return { label: 'OUT OF STOCK', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    if (p.stock_quantity <= p.low_stock_threshold) return { label: 'LOW STOCK', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    return { label: 'IN STOCK', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory</h1>
        <Link
          href="/products/add"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const status = getStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{p.category}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">R{p.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{p.stock_quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/products/${p.id}/adjust`}
                        className="text-green-600 hover:underline dark:text-green-400"
                      >
                        Adjust
                      </Link>
                      <Link
                        href={`/products/edit/${p.id}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

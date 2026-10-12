'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface SaleItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Sale {
  id: string;
  total_amount: number;
  created_at: string;
  items: SaleItem[];
}

export default function SaleDetailPage() {
  const params = useParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await api.get(`/sales/${params.id}`);
        setSale(response.data.data);
      } catch (err) {
        setError('Sale not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSale();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !sale) {
    return <div className="text-center py-10 text-red-500">{error || 'Sale not found'}</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/sales"
            className="rounded-md bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            Back to Sales
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sale Details</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">Sale ID: {sale.id.slice(0, 8)}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(sale.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium text-center">Qty</th>
              <th className="px-6 py-3 font-medium text-right">Unit Price</th>
              <th className="px-6 py-3 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sale.items.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.product_name}</td>
                <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{item.quantity}</td>
                <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">R{item.unit_price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">R{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 dark:bg-slate-700/30">
              <td colSpan={3} className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">Total Amount</td>
              <td className="px-6 py-4 text-right font-bold text-lg text-blue-600 dark:text-blue-400">
                R{sale.total_amount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Sale {
  id: string;
  total_amount: number;
  created_at: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await api.get('/sales');
        setSales(response.data.data);
      } catch (error) {
        console.error('Failed to fetch sales', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales History</h1>
        <Link
          href="/sales/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          New Sale
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Sale ID</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Total</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                  No sales recorded.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    #{sale.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {new Date(sale.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                    R{sale.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/sales/${sale.id}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

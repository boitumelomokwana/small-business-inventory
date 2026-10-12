'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Adjustment {
  id: string;
  quantity: number;
  type: 'INCREASE' | 'DECREASE';
  reason: string;
  created_at: string;
}

export default function AdjustStockPage() {
  const params = useParams();
  const router = useRouter();
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [formData, setFormData] = useState({
    quantity: '',
    type: 'INCREASE' as 'INCREASE' | 'DECREASE',
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdjustments();
  }, [params.id]);

  const fetchAdjustments = async () => {
    try {
      const response = await api.get(`/inventory/${params.id}/adjustments`);
      setAdjustments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch adjustments', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await api.post(`/inventory/${params.id}/adjust-stock`, {
        ...formData,
        quantity: parseInt(formData.quantity),
      });
      setFormData({ quantity: '', type: 'INCREASE', reason: '' });
      await fetchAdjustments();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'An error occurred while adjusting stock');
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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="rounded-md bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        >
          Back to Inventory
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Adjust Stock</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">New Adjustment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="INCREASE">Increase (+)</option>
                  <option value="DECREASE">Decrease (-)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Reason</label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="e.g. New stock received"
                  rows={3}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Apply Adjustment'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Adjustment History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Quantity</th>
                    <th className="px-6 py-3 font-medium">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {adjustments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                        No adjustments recorded.
                      </td>
                    </tr>
                  ) : (
                    adjustments.map((adj) => (
                      <tr key={adj.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {new Date(adj.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${adj.type === 'INCREASE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {adj.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {adj.type === 'INCREASE' ? `+${adj.quantity}` : `-${adj.quantity}`}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{adj.reason}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

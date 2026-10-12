'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface SaleReportItem {
  id: string;
  created_at: string;
  item_count: number;
  total_amount: number;
}

interface ReportData {
  totalRevenue: number;
  transactionCount: number;
  totalItemsSold: number;
  avgTransactionValue: number;
  sales: SaleReportItem[];
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await api.get(`/reports/sales?start=${startDate}&end=${endDate}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'An error occurred while fetching report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Reports</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <button
            onClick={fetchReport}
            disabled={isLoading}
            className="rounded-md bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <StatCard label="Total Revenue" value={`R${data.totalRevenue.toFixed(2)}`} />
            <StatCard label="Transactions" value={data.transactionCount} />
            <StatCard label="Items Sold" value={data.totalItemsSold} />
            <StatCard label="Avg. Transaction" value={`R${data.avgTransactionValue.toFixed(2)}`} />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Sale ID</th>
                  <th className="px-6 py-3 font-medium text-center">Items</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {data.sales.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      No sales for the selected period.
                    </td>
                  </tr>
                ) : (
                  data.sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {new Date(sale.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        #{sale.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                        {sale.item_count}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                        R{sale.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

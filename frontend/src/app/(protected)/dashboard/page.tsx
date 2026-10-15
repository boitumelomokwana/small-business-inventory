'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Receipt,
  Package,
  AlertTriangle,
  BadgeDollarSign,
} from 'lucide-react';
import api from '@/lib/api';

interface DashboardStats {
  totalProducts: number;
  totalStockUnits: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  todayRevenue: number;
  todaySalesCount: number;
  salesOverTime: Array<{ date: string; revenue: number }>;
  topProducts: Array<{ name: string; quantity: number }>;
}

interface Product {
  id: string;
  name: string;
  stock_quantity: number;
  low_stock_threshold: number;
}

interface Sale {
  id: string;
  total_amount: number | string;
  created_at: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState('7D');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get<{ data: DashboardStats }>('/dashboard'),
      api.get<{ data: Product[] }>('/products'),
      api.get<{ data: Sale[] }>('/sales?limit=5'),
    ])
      .then(([dashboardResponse, productsResponse, salesResponse]) => {
        if (!active) return;
        setStats(dashboardResponse.data.data);
        setProducts(productsResponse.data.data);
        setSales(salesResponse.data.data);
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message =
          (error as { response?: { data?: { error?: { message?: string } } } })
            .response?.data?.error?.message;
        setLoadError(message || 'Dashboard data could not be loaded. Please try again.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const ranges = ['Today', '7D', '30D'];
  const rangeLength = selectedRange === 'Today' ? 1 : selectedRange === '7D' ? 7 : 30;
  const chartData = (stats?.salesOverTime ?? [])
    .slice(-rangeLength)
    .map(({ date, revenue }) => ({
      name: new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
      }),
      revenue,
    }));
  const lowStockItems = products
    .filter((product) => product.stock_quantity <= product.low_stock_threshold)
    .slice(0, 5);
  const topProducts = stats?.topProducts ?? [];
  const recentSales = sales.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of your business performance &amp; inventory health
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  selectedRange === range
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Link
            href="/products/add"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-100"
          >
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {loadError}
        </p>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Revenue */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Revenue Today</span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BadgeDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {isLoading ? 'Loading...' : stats ? formatCurrency(stats.todayRevenue) : 'Unavailable'}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Revenue from today&apos;s sales
            </div>
          </div>
        </div>

        {/* Orders Processed */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sales Today</span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {isLoading ? 'Loading...' : stats?.todaySalesCount ?? 'Unavailable'}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Completed sales today
            </div>
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Units in Stock</span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {isLoading ? 'Loading...' : stats?.totalStockUnits ?? 'Unavailable'}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Across {stats?.totalProducts ?? '—'} products
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Low Stock Alerts</span>
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {isLoading ? 'Loading...' : stats?.lowStockProducts ?? 'Unavailable'}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {stats ? `${stats.outOfStockProducts} out of stock` : 'Stock status unavailable'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 62%, Right 38% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Sales Trend</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Daily revenue comparison over current period
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block"></span>
                <span>Revenue (R)</span>
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#f1f5f9' }}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8' }}
                    tickFormatter={(val) => `R${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
                    formatter={(value) => [
                      formatCurrency(Number(value ?? 0)),
                      'Revenue',
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Sales Activity */}
          <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Recent Sales Activity</h2>
              <Link
                href="/sales-orders"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                View all sales
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium pb-2">
                    <th className="pb-2 font-medium">Sale</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 font-semibold text-indigo-600">
                        <Link href={`/sales/${sale.id}`}>{sale.id.slice(0, 8)}</Link>
                      </td>
                      <td className="py-3 text-slate-600">
                        {new Date(sale.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-medium text-slate-900">
                        {formatCurrency(Number(sale.total_amount))}
                      </td>
                    </tr>
                  ))}
                  {!isLoading && !loadError && recentSales.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-slate-400">
                        No sales recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Low Stock Alerts</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Items requiring replenishment
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold">
              {stats?.lowStockProducts ?? '—'} alerts
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-800">{item.name}</h3>
                    <p className="text-[10px] text-slate-400">
                      Threshold: {item.low_stock_threshold}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-rose-600">
                      {item.stock_quantity} left
                    </p>
                  </div>
                </div>
              ))}
              {!isLoading && !loadError && lowStockItems.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-400">
                  No low-stock products.
                </p>
              )}
            </div>
          </div>

          {/* Top Performing Products */}
          <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Top Performing Products</h2>
              <Link
                href="/analytics"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                Analyze
              </Link>
            </div>

            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-100">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        {product.quantity} units sold
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {!isLoading && !loadError && topProducts.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-400">
                  Sales data will appear here after your first sale.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

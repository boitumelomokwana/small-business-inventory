'use client';

import React, { useState } from 'react';
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
  TrendingUp,
  Plus,
  ArrowUpRight,
  Receipt,
  Package,
  AlertTriangle,
  BadgeDollarSign,
} from 'lucide-react';

const chartData = [
  { name: 'Day 1', revenue: 2400 },
  { name: 'Day 2', revenue: 3100 },
  { name: 'Day 3', revenue: 3600 },
  { name: 'Day 4', revenue: 2900 },
  { name: 'Day 5', revenue: 4200 },
  { name: 'Day 6', revenue: 4800 },
  { name: 'Day 7', revenue: 3900 },
  { name: 'Day 8', revenue: 5200 },
  { name: 'Day 9', revenue: 4900 },
  { name: 'Day 10', revenue: 5800 },
];

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState('7D');

  const ranges = ['Today', '7D', '30D', 'Custom'];

  const recentOrders = [
    {
      id: '#SO-1082',
      customer: 'The Green Bowl',
      time: 'Today, 10:24 AM',
      product: 'Organic Apples (Case)',
      amount: 'R840.00',
      status: 'Delivered',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: '#SO-1081',
      customer: 'Bakehouse Cafe',
      time: 'Today, 08:15 AM',
      product: 'Unbleached Flour (50lb)',
      amount: 'R420.00',
      status: 'In Transit',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: '#SO-1080',
      customer: 'Pantry Express',
      time: 'Yesterday',
      product: 'Whole Almonds (Bulk)',
      amount: 'R1,250.00',
      status: 'Processing',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: '#SO-1079',
      customer: 'Fresh Mart',
      time: 'Oct 24, 2025',
      product: 'Avocados (Box)',
      amount: 'R980.00',
      status: 'Delivered',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const lowStockItems = [
    {
      name: 'Organic Bananas',
      sku: 'FRU-BAN-01',
      remaining: '12 lbs left',
      min: 'Min: 50 lbs',
    },
    {
      name: 'Almond Milk 1L',
      sku: 'BEV-ALM-12',
      remaining: '4 cases left',
      min: 'Min: 15 cases',
    },
    {
      name: 'Whole Wheat Bread',
      sku: 'BAK-WWB-08',
      remaining: '2 units left',
      min: 'Min: 20 units',
    },
    {
      name: 'Extra Virgin Olive Oil',
      sku: 'OIL-EVO-02',
      remaining: '5 btls left',
      min: 'Min: 20 btls',
    },
  ];

  const topProducts = [
    {
      name: 'Organic Avocados',
      units: '142 units sold',
      amount: 'R2,840.00',
      trend: '+15%',
      img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=80&h=80&q=80',
    },
    {
      name: 'Fresh Strawberries',
      units: '118 units sold',
      amount: 'R1,770.00',
      trend: '+8%',
      img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=80&h=80&q=80',
    },
    {
      name: 'Whole Bean Coffee...',
      units: '92 units sold',
      amount: 'R3,220.00',
      trend: '+12%',
      img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=80&h=80&q=80',
    },
  ];

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

          {/* Add Stock Button */}
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-100">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Revenue */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Sales Revenue</span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BadgeDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">R42,890.50</div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12.4%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Orders Processed */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Orders Processed</span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">642</div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+8.2%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Stock Value</span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">R186,400.00</div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+4.7%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
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
            <div className="text-xl font-bold text-slate-900 tracking-tight">8 Items</div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-amber-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+2 Items</span>
              <span className="text-slate-400 font-normal">vs last month</span>
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
                    formatter={(value: any) => [`R${value}`, 'Revenue']}
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
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Main Product</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 font-semibold text-indigo-600">{order.id}</td>
                      <td className="py-3">
                        <div className="font-medium text-slate-900">{order.customer}</div>
                        <div className="text-[10px] text-slate-400">{order.time}</div>
                      </td>
                      <td className="py-3 text-slate-600">{order.product}</td>
                      <td className="py-3 font-medium text-slate-900">{order.amount}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${order.badgeClass}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
                8 Alert
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <div key={item.sku} className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-800">{item.name}</h3>
                    <p className="text-[10px] text-slate-400">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-rose-600">{item.remaining}</p>
                    <p className="text-[10px] text-slate-400">{item.min}</p>
                  </div>
                </div>
              ))}
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
              {topProducts.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100"
                    />
                    <div>
                      <h3 className="text-xs font-semibold text-slate-900">{p.name}</h3>
                      <p className="text-[10px] text-slate-400">{p.units}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{p.amount}</p>
                    <p className="text-[10px] font-medium text-emerald-600 flex items-center justify-end">
                      <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
                      {p.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

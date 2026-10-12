'use client';

import React from 'react';
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
  BadgeDollarSign,
  Wallet,
  ShoppingCart,
  RotateCw,
  Plus,
  ArrowUpRight,
  Download,
} from 'lucide-react';

const weeklyData = [
  { name: 'Week 1', revenue: 21500 },
  { name: 'Week 2', revenue: 28400 },
  { name: 'Week 3', revenue: 39200 },
  { name: 'Week 4', revenue: 34100 },
  { name: 'Week 5', revenue: 49800 },
];

const topCategories = [
  {
    rank: '1.',
    name: 'Fresh Produce',
    amount: 'R48,320.00',
    percent: '(34%)',
    barWidth: '75%',
  },
  {
    rank: '2.',
    name: 'Beverages',
    amount: 'R32,150.00',
    percent: '(22%)',
    barWidth: '55%',
  },
  {
    rank: '3.',
    name: 'Bakery Products',
    amount: 'R18,420.00',
    percent: '(13%)',
    barWidth: '35%',
  },
  {
    rank: '4.',
    name: 'Dairy Alternatives',
    amount: 'R12,450.00',
    percent: '(9%)',
    barWidth: '25%',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Business Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dive deep into sales trend data, margins, and stock performance analytics
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-100 self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Gross Revenue */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Monthly Gross Revenue
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BadgeDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              R142,890.50
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+14.5%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Estimated Net Profit */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Estimated Net Profit
            </span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              R62,450.00
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+8.1%</span>
              <span className="text-slate-400 font-normal">margins steady</span>
            </div>
          </div>
        </div>

        {/* Avg. Order Value */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Avg. Order Value
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              R680.00
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+3.5%</span>
              <span className="text-slate-400 font-normal">spending growth</span>
            </div>
          </div>
        </div>

        {/* Stock Turnover Rate */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Stock Turnover Rate
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <RotateCw className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              4.2x / Year
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <span>100%</span>
              <span className="text-slate-400 font-normal">healthy limits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 65%, Right 35% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales and Revenue Performance Card */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Sales and Revenue Performance
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Daily grocer sales track, measured in South African Rand (R)
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block"></span>
              <span>Weekly Revenue</span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  tickFormatter={(val) => `R${val / 1000}k`}
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
                  formatter={(value: any) => [`R${value.toLocaleString()}`, 'Weekly Revenue']}
                />
                <Bar
                  dataKey="revenue"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Sales Categories Card */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Top Sales Categories
            </h2>
            <Link
              href="/inventory"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {topCategories.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    <span className="text-slate-400 mr-1.5">{cat.rank}</span>
                    {cat.name}
                  </span>
                  <span className="text-slate-600">
                    <strong className="text-slate-900 font-semibold">{cat.amount}</strong>{' '}
                    <span className="text-slate-400 text-[11px]">{cat.percent}</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: cat.barWidth }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

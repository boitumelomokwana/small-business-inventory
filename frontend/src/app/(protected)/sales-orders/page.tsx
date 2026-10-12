'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Package,
  BadgeDollarSign,
  AlertTriangle,
  Plus,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface OrderItem {
  id: string;
  customerName: string;
  customerAddress: string;
  itemsSummary: string;
  orderDate: string;
  totalValue: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
}

const mockOrders: OrderItem[] = [
  {
    id: '#SO-1082',
    customerName: 'The Green Bowl',
    customerAddress: 'Kloof Street, Cape Town',
    itemsSummary: 'Organic Avocados x4 cases, Orga...',
    orderDate: 'Today, 10:24 AM',
    totalValue: 'R840.00',
    status: 'Delivered',
  },
  {
    id: '#SO-1081',
    customerName: 'Bakehouse Cafe',
    customerAddress: 'Sea Point, Cape Town',
    itemsSummary: 'Stoneground Flour 50lb x4 bags',
    orderDate: 'Today, 08:15 AM',
    totalValue: 'R420.00',
    status: 'In Transit',
  },
  {
    id: '#SO-1080',
    customerName: 'Pantry Express',
    customerAddress: 'Rosebank, Johannesburg',
    itemsSummary: 'Whole Raw Almonds 10kg x1 sack',
    orderDate: 'Yesterday, 04:30 PM',
    totalValue: 'R1,250.00',
    status: 'Processing',
  },
  {
    id: '#SO-1079',
    customerName: 'Fresh Mart Retail',
    customerAddress: 'Centurion, Pretoria',
    itemsSummary: 'Fresh Strawberries x12 trays, Avo...',
    orderDate: 'Oct 24, 2025',
    totalValue: 'R980.00',
    status: 'Delivered',
  },
];

export default function SalesOrdersPage() {
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = ['All Orders', 'Processing', 'In Transit', 'Delivered'];

  const filteredOrders = mockOrders.filter((order) => {
    const matchesFilter =
      selectedFilter === 'All Orders' || order.status === selectedFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Transit':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Processing':
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sales Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage wholesale buyer orders, order fulfillment, and deliveries
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-100 self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" />
          <span>Create Order</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Orders Today */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              New Orders Today
            </span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              28 Orders
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+15%</span>
              <span className="text-slate-400 font-normal">vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Pending Fulfillment
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              14 Pending
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowDownRight className="w-3 h-3" />
              <span>-4 items</span>
              <span className="text-slate-400 font-normal">vs last hour</span>
            </div>
          </div>
        </div>

        {/* Delivered Value */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Delivered Value
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BadgeDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              R18,430.00
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>96.4%</span>
              <span className="text-slate-400 font-normal">completion rate</span>
            </div>
          </div>
        </div>

        {/* Returned / Cancelled */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Returned / Cancelled
            </span>
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              2 Orders
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowDownRight className="w-3 h-3" />
              <span>-0.2%</span>
              <span className="text-slate-400 font-normal">return rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs space-y-4">
        {/* Filter Tabs & Search / Date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedFilter === tab
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Date Picker */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order, buyer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-52"
              />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Select Date</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Items Summary</th>
                <th className="pb-3 font-medium">Order Date</th>
                <th className="pb-3 font-medium">Total Value</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition">
                  {/* Order ID */}
                  <td className="py-3 font-semibold text-indigo-600">
                    {order.id}
                  </td>

                  {/* Customer */}
                  <td className="py-3">
                    <div className="font-semibold text-slate-900">
                      {order.customerName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {order.customerAddress}
                    </div>
                  </td>

                  {/* Items Summary */}
                  <td className="py-3 text-slate-600">
                    {order.itemsSummary}
                  </td>

                  {/* Order Date */}
                  <td className="py-3 text-slate-600">
                    {order.orderDate}
                  </td>

                  {/* Total Value */}
                  <td className="py-3 font-medium text-slate-900">
                    {order.totalValue}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                        order.status
                      )}`}
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
  );
}

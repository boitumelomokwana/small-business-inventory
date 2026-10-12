'use client';

import React, { useState } from 'react';
import {
  Users,
  Building2,
  BadgeDollarSign,
  AlertTriangle,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface CustomerItem {
  id: string;
  name: string;
  businessType: string;
  email: string;
  segment: 'VIP Partner' | 'Wholesale' | 'At Risk';
  lastActiveOrder: string;
  totalOrders: string;
  lifetimeSpending: string;
  avatar: string;
}

const mockCustomers: CustomerItem[] = [
  {
    id: '1',
    name: 'The Green Bowl',
    businessType: 'Cape Town Cafe Co..',
    email: 'orders@greenbowl.co.za',
    segment: 'VIP Partner',
    lastActiveOrder: 'Today, 10:24 AM',
    totalOrders: '48 Orders',
    lifetimeSpending: 'R40,320.00',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: '2',
    name: 'Bakehouse Cafe',
    businessType: 'Independent Bakery',
    email: 'contact@bakehouse.co.za',
    segment: 'Wholesale',
    lastActiveOrder: 'Today, 08:15 AM',
    totalOrders: '12 Orders',
    lifetimeSpending: 'R14,690.00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: '3',
    name: 'Pantry Express',
    businessType: 'Retail Grocery Chain',
    email: 'purchasing@pantry.com',
    segment: 'VIP Partner',
    lastActiveOrder: 'Yesterday, 04:30 PM',
    totalOrders: '92 Orders',
    lifetimeSpending: 'R124,500.00',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: '4',
    name: 'Durban Organics',
    businessType: 'Local Farmstall',
    email: 'durbanorganic@telkomsa.co.za',
    segment: 'At Risk',
    lastActiveOrder: '30 Days Ago',
    totalOrders: '2 Orders',
    lifetimeSpending: 'R3,400.00',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80&q=80',
  },
];

export default function CustomersPage() {
  const [selectedSegment, setSelectedSegment] = useState('All Directory');
  const [searchQuery, setSearchQuery] = useState('');

  const segments = ['All Directory', 'Wholesale', 'VIP Partners', 'Dormant'];

  const filteredCustomers = mockCustomers.filter((customer) => {
    let matchesSegment = true;
    if (selectedSegment === 'Wholesale') {
      matchesSegment = customer.segment === 'Wholesale';
    } else if (selectedSegment === 'VIP Partners') {
      matchesSegment = customer.segment === 'VIP Partner';
    } else if (selectedSegment === 'Dormant') {
      matchesSegment = customer.segment === 'At Risk';
    }

    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.businessType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSegment && matchesSearch;
  });

  const getSegmentBadge = (segment: CustomerItem['segment']) => {
    switch (segment) {
      case 'VIP Partner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Wholesale':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'At Risk':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage retail &amp; wholesale buyer accounts, lifetime values, and segments
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-100 self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Retail Buyers */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Active Retail Buyers
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              1,142 Accounts
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+4.2%</span>
              <span className="text-slate-400 font-normal">this month</span>
            </div>
          </div>
        </div>

        {/* Wholesale / Cafe Partners */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Wholesale / Cafe Partners
            </span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              106 Businesses
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12</span>
              <span className="text-slate-400 font-normal">new signups</span>
            </div>
          </div>
        </div>

        {/* Average Lifetime Value */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Average Lifetime Value
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BadgeDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              R14,890.00
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+0.2%</span>
              <span className="text-slate-400 font-normal">spending growth</span>
            </div>
          </div>
        </div>

        {/* At-Risk Partners */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              At-Risk Partners
            </span>
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              3 Accounts
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowDownRight className="w-3 h-3" />
              <span>-1 account</span>
              <span className="text-slate-400 font-normal">recovered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs space-y-4">
        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Segment Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {segments.map((seg) => (
              <button
                key={seg}
                onClick={() => setSelectedSegment(seg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedSegment === seg
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {seg}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-60"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3 font-medium">Customer Name</th>
                <th className="pb-3 font-medium">Contact Email</th>
                <th className="pb-3 font-medium">Segment</th>
                <th className="pb-3 font-medium">Last Active Order</th>
                <th className="pb-3 font-medium">Total Orders</th>
                <th className="pb-3 font-medium text-right">Lifetime Spending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/50 transition">
                  {/* Name & Avatar */}
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-100"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{cust.name}</div>
                        <div className="text-[10px] text-slate-400">{cust.businessType}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Email */}
                  <td className="py-3 text-slate-600">{cust.email}</td>

                  {/* Segment Badge */}
                  <td className="py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getSegmentBadge(
                        cust.segment
                      )}`}
                    >
                      {cust.segment}
                    </span>
                  </td>

                  {/* Last Active Order */}
                  <td className="py-3 text-slate-600">{cust.lastActiveOrder}</td>

                  {/* Total Orders */}
                  <td className="py-3 text-slate-600">{cust.totalOrders}</td>

                  {/* Lifetime Spending */}
                  <td className="py-3 font-medium text-slate-900 text-right">
                    {cust.lifetimeSpending}
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

'use client';

import React, { useState } from 'react';
import {
  Package,
  BadgeDollarSign,
  AlertTriangle,
  Users2,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stockLevel: string;
  minLimit: string;
  unitPrice: string;
  totalValue: string;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Critical';
  image: string;
}

const mockProducts: ProductItem[] = [
  {
    id: '1',
    name: 'Organic Avocados',
    sku: 'FRU-AVO-02',
    category: 'Fresh Produce',
    stockLevel: '142 Boxes',
    minLimit: 'Min Limit: 40',
    unitPrice: 'R20.00',
    totalValue: 'R2,840.00',
    supplier: 'Island Farms',
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: '2',
    name: 'Stoneground Flour 50lb',
    sku: 'BAK-FLR-12',
    category: 'Bakery',
    stockLevel: '4 Units',
    minLimit: 'Min Limit: 15',
    unitPrice: 'R105.00',
    totalValue: 'R420.00',
    supplier: 'Grain Growers SA',
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: '3',
    name: 'Whole Raw Almonds 10kg',
    sku: 'NUT-ALM-Bulk',
    category: 'Pantry Essentials',
    stockLevel: '12 sacks',
    minLimit: 'Min Limit: 10',
    unitPrice: 'R104.16',
    totalValue: 'R1,250.00',
    supplier: 'Outback Wholesal...',
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: '4',
    name: 'Organic Bananas',
    sku: 'FRU-BAN-01',
    category: 'Fresh Produce',
    stockLevel: '2 lbs',
    minLimit: 'Min Limit: 50',
    unitPrice: 'R12.00',
    totalValue: 'R24.00',
    supplier: 'Island Farms',
    status: 'Critical',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=80&h=80&q=80',
  },
];

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Stock');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All Stock', 'Fresh Produce', 'Bakery', 'Beverages'];

  const filteredProducts = mockProducts.filter((p) => {
    const matchesCat =
      selectedCategory === 'All Stock' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getStatusBadge = (status: ProductItem['status']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low Stock':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your stock levels, suppliers, and replenishment parameters
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-100 self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inventory Items */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Inventory Items
            </span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              1,420 Lines
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+24 items</span>
              <span className="text-slate-400 font-normal">this week</span>
            </div>
          </div>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Inventory Value
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BadgeDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              R248,920.00
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+3.2%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Critical / Low Stock */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Critical / Low Stock
            </span>
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              8 Alerts
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <ArrowDownRight className="w-3 h-3" />
              <span>-2 items</span>
              <span className="text-slate-400 font-normal">recovered</span>
            </div>
          </div>
        </div>

        {/* Active Suppliers */}
        <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Active Suppliers
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              14 Partners
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
              <span>100%</span>
              <span className="text-slate-400 font-normal">delivery rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs space-y-4">
        {/* Filter Tabs & Search / Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Bulk Actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products, SKUs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-52"
              />
            </div>

            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
              Bulk Actions
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3 font-medium">Product &amp; SKU</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Stock Level / Limit</th>
                <th className="pb-3 font-medium">Unit Price</th>
                <th className="pb-3 font-medium">Total Value</th>
                <th className="pb-3 font-medium">Supplier</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  {/* Product & SKU */}
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-100"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.sku}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 text-slate-600">{p.category}</td>

                  {/* Stock Level / Limit */}
                  <td className="py-3">
                    <div className="font-medium text-slate-900">{p.stockLevel}</div>
                    <div className="text-[10px] text-slate-400">{p.minLimit}</div>
                  </td>

                  {/* Unit Price */}
                  <td className="py-3 text-slate-600">{p.unitPrice}</td>

                  {/* Total Value */}
                  <td className="py-3 font-medium text-slate-900">{p.totalValue}</td>

                  {/* Supplier */}
                  <td className="py-3 text-slate-600">{p.supplier}</td>

                  {/* Status Badge */}
                  <td className="py-3 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
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

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  Boxes
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const currentUser = user || {
    name: 'Local Grocer',
    email: 'admin@localgrocer.com'
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
      isActive: pathname === '/dashboard' || pathname === '/',
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Package,
      isActive: pathname.startsWith('/inventory') || pathname.startsWith('/products'),
    },
    {
      name: 'Sales Orders',
      href: '/sales-orders',
      icon: ShoppingCart,
      isActive: pathname.startsWith('/sales-orders') || pathname.startsWith('/sales'),
    },
    {
      name: 'Customers',
      href: '/customers',
      icon: Users,
      isActive: pathname.startsWith('/customers'),
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart2,
      isActive: pathname.startsWith('/analytics') || pathname.startsWith('/reports'),
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      isActive: pathname.startsWith('/settings'),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between">
        <div>
          {/* Logo & Brand */}
          <div className="px-6 py-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                STOCKsethu
              </h1>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                Tracker Pro
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3.5 space-y-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    item.isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      item.isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-8">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

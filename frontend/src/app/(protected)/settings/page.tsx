'use client';

import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState('Local Grocer Hub');
  const [adminEmail, setAdminEmail] = useState('admin@localgrocer.com');
  const [currency, setCurrency] = useState('ZAR - South African Rand (R)');
  const [numberFormat, setNumberFormat] = useState('ZA Standard (comma decimal)');
  const [dailyEmail, setDailyEmail] = useState(true);
  const [mobilePush, setMobilePush] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure system parameters, localized currency, regional formats, and user credentials
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-100 self-start sm:self-auto"
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Left 65%, Right 35% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Business Profile */}
          <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Business Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  Support / Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Currency & Regional Preferences */}
          <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Currency &amp; Regional Preferences
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  System Currency Preference
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-400 text-xs text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                >
                  <option>ZAR - South African Rand (R)</option>
                  <option>USD - US Dollar ($)</option>
                  <option>EUR - Euro (€)</option>
                  <option>GBP - British Pound (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  Regional Number Formatting
                </label>
                <select
                  value={numberFormat}
                  onChange={(e) => setNumberFormat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                >
                  <option>ZA Standard (comma decimal)</option>
                  <option>US Standard (dot decimal)</option>
                  <option>EU Standard (space thousand)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications & Alert Level Settings */}
          <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Notifications &amp; Alert Level Settings
              </h2>
            </div>

            <div className="space-y-4 pt-1">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-700">
                  Enable daily email summaries of low-stock parameters
                </span>
                <button
                  type="button"
                  onClick={() => setDailyEmail(!dailyEmail)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    dailyEmail ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ${
                      dailyEmail ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-700">
                  Allow mobile push integration updates for critical items
                </span>
                <button
                  type="button"
                  onClick={() => setMobilePush(!mobilePush)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    mobilePush ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ${
                      mobilePush ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) - Workspace Users */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Workspace Users</h2>
            </div>

            <div className="space-y-3.5 pt-1">
              {/* User 1 */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Local Grocer"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-100"
                />
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">Local Grocer</h3>
                  <p className="text-[10px] text-slate-400">Workspace Owner (Admin)</p>
                </div>
              </div>

              {/* User 2 */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Naledi Madiba"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-100"
                />
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">Naledi Madiba</h3>
                  <p className="text-[10px] text-slate-400">Stock Controller</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

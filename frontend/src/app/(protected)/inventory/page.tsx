'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeDollarSign,
  Box,
  LoaderCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import api from '@/lib/api';

type ProductRecord = {
  id: string;
  name: string;
  category: string;
  price: number | string;
  stock_quantity: number;
  low_stock_threshold: number;
};

type ProductFormValues = {
  name: string;
  category: string;
  price: string;
  stock_quantity: string;
  low_stock_threshold: string;
};

const emptyForm: ProductFormValues = {
  name: '',
  category: '',
  price: '',
  stock_quantity: '0',
  low_stock_threshold: '5',
};

const moneyFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
});

function formatMoney(value: number | string) {
  const amount = Number(value);
  return moneyFormatter.format(Number.isFinite(amount) ? amount : 0);
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object') {
    const candidate = error as {
      message?: string;
      response?: {
        data?: {
          message?: string;
          error?: { message?: string };
        };
      };
    };
    return (
      candidate.response?.data?.error?.message ??
      candidate.response?.data?.message ??
      candidate.message ??
      'The request could not be completed. Please try again.'
    );
  }
  return 'The request could not be completed. Please try again.';
}

function sortProducts(products: ProductRecord[]) {
  return [...products].sort((first, second) => first.name.localeCompare(second.name));
}

function getStockStatus(product: ProductRecord) {
  const stock = Number(product.stock_quantity);
  const threshold = Number(product.low_stock_threshold);

  if (stock <= 0) {
    return {
      label: 'Out of stock',
      classes: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }
  if (stock <= threshold) {
    return {
      label: 'Low stock',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }
  return {
    label: 'In stock',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [form, setForm] = useState<ProductFormValues>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadProducts() {
      setIsLoading(true);
      setPageError(null);
      try {
        const response = await api.get<{ success: boolean; data: ProductRecord[] }>('/products');
        if (isCurrent) setProducts(sortProducts(response.data.data ?? []));
      } catch (error) {
        if (isCurrent) setPageError(getErrorMessage(error));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadProducts();
    return () => {
      isCurrent = false;
    };
  }, []);

  const categories = useMemo(
    () => ['All categories', ...Array.from(new Set(products.map((product) => product.category))).sort()],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All categories' || product.category === selectedCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const totalUnits = products.reduce((sum, product) => sum + Number(product.stock_quantity), 0);
  const inventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.stock_quantity),
    0,
  );
  const lowStockCount = products.filter(
    (product) => Number(product.stock_quantity) <= Number(product.low_stock_threshold),
  ).length;

  function openCreateDialog() {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError(null);
    setIsDialogOpen(true);
  }

  function openEditDialog(product: ProductRecord) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
      low_stock_threshold: String(product.low_stock_threshold),
    });
    setFormError(null);
    setIsDialogOpen(true);
  }

  function closeDialog() {
    if (isSaving) return;
    setIsDialogOpen(false);
    setFormError(null);
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      low_stock_threshold: Number(form.low_stock_threshold),
    };

    if (!payload.name || !payload.category) {
      setFormError('Product name and category are required.');
      return;
    }
    if (
      !Number.isFinite(payload.price) ||
      payload.price < 0 ||
      !Number.isInteger(payload.stock_quantity) ||
      payload.stock_quantity < 0 ||
      !Number.isInteger(payload.low_stock_threshold) ||
      payload.low_stock_threshold < 0
    ) {
      setFormError('Enter a valid price and non-negative whole-number stock values.');
      return;
    }

    setIsSaving(true);
    try {
      const response = editingProduct
        ? await api.put<{ success: boolean; data: ProductRecord }>(
            `/products/${editingProduct.id}`,
            payload,
          )
        : await api.post<{ success: boolean; data: ProductRecord }>('/products', payload);
      const savedProduct = response.data.data;

      setProducts((current) =>
        sortProducts(
          editingProduct
            ? current.map((product) =>
                product.id === savedProduct.id ? savedProduct : product,
              )
            : [...current, savedProduct],
        ),
      );
      setSelectedCategory('All categories');
      setSearchTerm('');
      setIsDialogOpen(false);
      setEditingProduct(null);
      setForm(emptyForm);
      setPageError(null);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProduct(product: ProductRecord) {
    const confirmed = window.confirm(
      `Delete “${product.name}”? This removes it from inventory. Historical sale records are retained.`,
    );
    if (!confirmed) return;

    setDeletingProductId(product.id);
    setPageError(null);
    try {
      await api.delete(`/products/${product.id}`);
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setDeletingProductId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
          <p className="mt-1 text-xs text-slate-500">
            Products are saved to your account and update here after each successful change.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateDialog}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      {pageError && (
        <div role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span>{pageError}</span>
          {!isLoading && products.length === 0 && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="shrink-0 font-semibold underline"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Products" value={String(products.length)} icon={<Package className="h-4 w-4" />} />
        <SummaryCard label="Units in stock" value={totalUnits.toLocaleString()} icon={<Box className="h-4 w-4" />} />
        <SummaryCard label="Inventory value" value={formatMoney(inventoryValue)} icon={<BadgeDollarSign className="h-4 w-4" />} />
        <SummaryCard label="At or below stock limit" value={String(lowStockCount)} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium ${
                  selectedCategory === category
                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <label className="relative block w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <span className="sr-only">Search products</span>
            <input
              type="search"
              placeholder="Search name or category"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Stock / limit</th>
                <th className="px-3 py-3">Unit price</th>
                <th className="px-3 py-3">Stock value</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-14 text-center text-slate-500">
                    <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Loading products from your database…
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-14 text-center">
                    <Package className="mx-auto mb-2 h-7 w-7 text-slate-300" />
                    <p className="font-medium text-slate-700">
                      {products.length === 0 ? 'No products yet' : 'No matching products'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {products.length === 0
                        ? 'Add a product to start building your inventory.'
                        : 'Try another search or category.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70">
                      <td className="px-3 py-4 font-semibold text-slate-900">{product.name}</td>
                      <td className="px-3 py-4 text-slate-600">{product.category}</td>
                      <td className="px-3 py-4">
                        <span className="font-medium text-slate-900">{Number(product.stock_quantity)}</span>
                        <span className="text-slate-400"> / {Number(product.low_stock_threshold)}</span>
                      </td>
                      <td className="px-3 py-4 text-slate-600">{formatMoney(product.price)}</td>
                      <td className="px-3 py-4 font-medium text-slate-900">
                        {formatMoney(Number(product.price) * Number(product.stock_quantity))}
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditDialog(product)}
                            aria-label={`Edit ${product.name}`}
                            className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteProduct(product)}
                            disabled={deletingProductId === product.id}
                            aria-label={`Delete ${product.name}`}
                            className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                          >
                            {deletingProductId === product.id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="product-dialog-title" className="text-lg font-bold text-slate-900">
                  {editingProduct ? 'Edit product' : 'Add product'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingProduct ? 'Changes are saved to the database.' : 'The new product will be saved to the database.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                disabled={isSaving}
                aria-label="Close dialog"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(event) => void saveProduct(event)} className="space-y-4">
              <div>
                <label htmlFor="product-name" className="mb-1.5 block text-sm font-medium text-slate-700">Product name</label>
                <input
                  id="product-name"
                  autoFocus
                  required
                  maxLength={255}
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label htmlFor="product-category" className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
                <input
                  id="product-category"
                  required
                  maxLength={100}
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="product-price" className="mb-1.5 block text-sm font-medium text-slate-700">Unit price (ZAR)</label>
                  <input
                    id="product-price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label htmlFor="product-stock" className="mb-1.5 block text-sm font-medium text-slate-700">Stock quantity</label>
                  <input
                    id="product-stock"
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={form.stock_quantity}
                    onChange={(event) => setForm((current) => ({ ...current, stock_quantity: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label htmlFor="product-threshold" className="mb-1.5 block text-sm font-medium text-slate-700">Low-stock limit</label>
                  <input
                    id="product-threshold"
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={form.low_stock_threshold}
                    onChange={(event) => setForm((current) => ({ ...current, low_stock_threshold: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {formError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isSaving}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {isSaving ? 'Saving…' : editingProduct ? 'Save changes' : 'Save product'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">{icon}</span>
      </div>
      <div className="mt-3 text-xl font-bold tracking-tight text-slate-900">{value}</div>
    </div>
  );
}

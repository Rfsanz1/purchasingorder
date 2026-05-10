import { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  Tag,
  CreditCard,
  Banknote,
  Smartphone,
  Clock,
  X,
  Check,
  Pause,
  Play,
  Percent,
  Calculator,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatRupiah } from '../utils/format'
import { useAuthStore } from '../store/authStore'

interface CartItem {
  product_id: number
  product_name: string
  product_sku: string
  unit_id: number
  unit_name: string
  qty: number
  unit_price: number
  cost_price: number
  discount_pct: number
  discount_amount: number
  subtotal: number
}

interface Customer { id: number; name: string; phone: string; type: string; custom_discount_pct: number }

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Tunai', icon: Banknote, color: 'bg-emerald-500' },
  { id: 'transfer', label: 'Transfer', icon: CreditCard, color: 'bg-blue-500' },
  { id: 'qris', label: 'QRIS', icon: Smartphone, color: 'bg-purple-500' },
  { id: 'tempo', label: 'Tempo', icon: Clock, color: 'bg-amber-500' },
]

function calcItem(item: CartItem): CartItem {
  const gross = item.qty * item.unit_price
  const discount = item.discount_pct > 0 ? gross * item.discount_pct / 100 : item.discount_amount
  return { ...item, discount_amount: discount, subtotal: gross - discount }
}

export default function KasirPage() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  const searchRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerPanel, setShowCustomerPanel] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showHeld, setShowHeld] = useState(false)
  const [discountPct, setDiscountPct] = useState(0)
  const [taxPct, setTaxPct] = useState(0)
  const [payMethod, setPayMethod] = useState('cash')
  const [cashInput, setCashInput] = useState('')
  const [notes, setNotes] = useState('')

  const warehouseId = 1

  const { data: categories } = useQuery({
    queryKey: ['pos-categories'],
    queryFn: () => api.get('/categories/all').then((r) => r.data.data),
  })

  const { data: searchResults, isFetching: searching } = useQuery({
    queryKey: ['pos-search', search, categoryId],
    queryFn: () => api.get('/products/search', { params: { q: search || undefined, warehouse_id: warehouseId, category_id: categoryId || undefined } }).then((r) => r.data.data),
    enabled: search.length > 0 || Boolean(categoryId),
  })

  const { data: customerResults } = useQuery({
    queryKey: ['pos-customer-search', customerSearch],
    queryFn: () => api.get('/customers/search', { params: { q: customerSearch } }).then((r) => r.data.data),
    enabled: customerSearch.length > 0,
  })

  const { data: heldData, refetch: refetchHeld } = useQuery({
    queryKey: ['pos-held'],
    queryFn: () => api.get('/sales/held').then((r) => r.data.data),
    enabled: showHeld,
  })

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const discountAmt = discountPct > 0 ? subtotal * discountPct / 100 : 0
  const afterDiscount = subtotal - discountAmt
  const taxAmt = taxPct > 0 ? afterDiscount * taxPct / 100 : 0
  const grandTotal = afterDiscount + taxAmt
  const cashAmt = parseFloat(cashInput.replace(/[^0-9]/g, '')) || 0
  const change = Math.max(0, cashAmt - grandTotal)

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.findIndex((item) => item.product_id === product.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = calcItem({ ...updated[existing], qty: updated[existing].qty + 1 })
        return updated
      }
      return [
        ...prev,
        calcItem({
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          unit_id: product.unit_id,
          unit_name: product.unit?.abbreviation ?? '',
          qty: 1,
          unit_price: parseFloat(product.selling_price),
          cost_price: parseFloat(product.cost_price),
          discount_pct: customer?.custom_discount_pct ?? 0,
          discount_amount: 0,
          subtotal: parseFloat(product.selling_price),
        }),
      ]
    })
    setSearch('')
    searchRef.current?.focus()
  }

  const updateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev]
      const nextQty = updated[index].qty + delta
      if (nextQty <= 0) {
        updated.splice(index, 1)
        return updated
      }
      updated[index] = calcItem({ ...updated[index], qty: nextQty })
      return updated
    })
  }

  const setQty = (index: number, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((_, i) => i !== index)
      const updated = [...prev]
      updated[index] = calcItem({ ...updated[index], qty })
      return updated
    })
  }

  const setItemDiscount = (index: number, pct: number) => {
    setCart((prev) => {
      const updated = [...prev]
      updated[index] = calcItem({ ...updated[index], discount_pct: pct, discount_amount: 0 })
      return updated
    })
  }

  const removeItem = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index))

  const { mutate: submitSale, isPending: submitting } = useMutation({
    mutationFn: (payload: any) => api.post('/sales', payload),
    onSuccess: (res) => {
      toast.success(`Transaksi ${res.data.data.invoice_number} berhasil!`)
      setCart([])
      setCustomer(null)
      setShowPayment(false)
      setCashInput('')
      setNotes('')
      setDiscountPct(0)
      setTaxPct(0)
      qc.invalidateQueries({ queryKey: ['pos-dashboard-summary'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Transaksi gagal'),
  })

  const { mutate: holdTransaction } = useMutation({
    mutationFn: (payload: any) => api.post('/sales/hold', payload),
    onSuccess: () => {
      toast.success('Transaksi di-hold')
      setCart([])
      setCustomer(null)
    },
  })

  const handleCheckout = () => {
    if (cart.length === 0) return toast.error('Keranjang kosong!')
    setShowPayment(true)
  }

  const handleSubmit = () => {
    submitSale({
      warehouse_id: warehouseId,
      customer_id: customer?.id,
      customer_name: customer?.name,
      customer_phone: customer?.phone,
      discount_amount: discountAmt,
      discount_pct: discountPct,
      tax_pct: taxPct,
      tax_amount: taxAmt,
      notes,
      items: cart.map((item) => ({
        product_id: item.product_id,
        unit_id: item.unit_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        qty: item.qty,
        unit_price: item.unit_price,
        cost_price: item.cost_price,
        discount_pct: item.discount_pct,
        discount_amount: item.discount_amount,
        subtotal: item.subtotal,
      })),
      payments: [{ method: payMethod, amount: payMethod === 'cash' ? cashAmt : grandTotal }],
    })
  }

  const handleHold = () => {
    if (cart.length === 0) return toast.error('Tidak ada item untuk hold')
    holdTransaction({ cart_data: cart, grand_total: grandTotal, customer_id: customer?.id, notes })
  }

  const quickCash = [grandTotal, Math.ceil(grandTotal / 10000) * 10000, Math.ceil(grandTotal / 50000) * 50000, Math.ceil(grandTotal / 100000) * 100000]
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 4)

  return (
    <div className="grid h-full min-h-[calc(100vh-3.5rem)] grid-cols-1 gap-4 xl:grid-cols-[1.5fr_0.95fr]">
      <div className="space-y-4">
        <div className="card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Kasir</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Cari produk cepat atau scan barcode untuk checkout.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories?.slice(0, 4).map((category: any) => (
                <button key={category.id} onClick={() => setCategoryId(String(category.id))} className={clsx('rounded-full px-4 py-2 text-sm transition', categoryId === String(category.id) ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800')}>
                  {category.name}
                </button>
              ))}
              <button onClick={() => setCategoryId('')} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative rounded-[28px] border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk, nama, SKU, atau scan barcode..."
              className="input pl-12 bg-transparent py-4 text-sm text-slate-900 dark:text-slate-100"
            />
            {searching && <span className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent dark:border-slate-500" />}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Daftar Produk</p>
                <span className="badge badge-blue">{(searchResults ?? []).length} hasil</span>
              </div>

              {search.length === 0 && !categoryId ? (
                <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  Mulai pencarian produk atau pilih kategori untuk melihat daftar produk.
                </div>
              ) : (searchResults ?? []).length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  Produk tidak ditemukan.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                  {(searchResults ?? []).map((product: any) => {
                    const stock = product.inventories?.[0]?.qty_on_hand ?? 0
                    return (
                      <button key={product.id} onClick={() => addToCart(product)} className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 text-left transition hover:border-primary-300 hover:bg-primary-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-500 dark:hover:bg-slate-950">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{product.name}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">SKU {product.sku}</p>
                          </div>
                          <div className="rounded-2xl bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{formatRupiah(product.selling_price)}</div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{product.unit?.abbreviation ?? 'pcs'}</span>
                          <span className={clsx('rounded-full px-2 py-1', stock <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')}>
                            {stock} stok
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ringkasan Transaksi</p>
                  <span className="badge badge-blue">{cart.length} item</span>
                </div>
                <div className="space-y-3">
                  {cart.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      Keranjang kosong. Tambahkan produk untuk memulai transaksi.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <div key={index} className="rounded-[24px] border border-slate-200 p-4 dark:border-slate-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.product_name}</p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.product_sku} · {item.unit_name}</p>
                            </div>
                            <button onClick={() => removeItem(index)} className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] items-center">
                            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-2 dark:bg-slate-900">
                              <button onClick={() => updateQty(index, -1)} className="h-8 w-8 rounded-2xl bg-white text-slate-700 shadow-sm hover:bg-slate-200 dark:bg-slate-950 dark:text-slate-200">
                                <Minus size={14} />
                              </button>
                              <input type="number" value={item.qty} min={1} onChange={(e) => setQty(index, Number(e.target.value) || 1)} className="w-16 border-0 bg-transparent text-center text-sm font-semibold text-slate-900 outline-none dark:text-slate-100" />
                              <button onClick={() => updateQty(index, 1)} className="h-8 w-8 rounded-2xl bg-primary-600 text-white shadow-sm hover:bg-primary-700">
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="grid gap-2">
                              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                <span>Diskon</span>
                                <input type="number" min={0} max={100} value={item.discount_pct} onChange={(e) => setItemDiscount(index, Number(e.target.value) || 0)} className="w-16 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" />
                              </div>
                              <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                                <span>Subtotal</span>
                                <span>{formatRupiah(item.subtotal)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Diskon ({discountPct}%)</span>
                    <span>{formatRupiah(discountAmt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Pajak ({taxPct}%)</span>
                    <span>{formatRupiah(taxAmt)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
                    <span>Total</span>
                    <span>{formatRupiah(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <button onClick={handleHold} disabled={cart.length === 0} className="btn-secondary w-full btn-sm">
                  <Pause size={16} /> Hold Transaksi
                </button>
                <button onClick={() => { setShowHeld(true); refetchHeld() }} className="btn-secondary w-full btn-sm">
                  <Play size={16} /> Recall Transaksi
                </button>
                <button onClick={handleCheckout} disabled={cart.length === 0} className="btn-primary w-full btn-lg">
                  <ShoppingCart size={18} /> Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pelanggan</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pilih customer untuk diskon dan riwayat.</p>
            </div>
          </div>
          {customer ? (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-3xl bg-primary-500 text-white">{customer.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{customer.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{customer.phone} · {customer.type}</p>
                </div>
              </div>
              <button onClick={() => setCustomer(null)} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                Hapus pelanggan
              </button>
            </div>
          ) : (
            <div className="relative rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                onFocus={() => setShowCustomerPanel(true)}
                onBlur={() => setTimeout(() => setShowCustomerPanel(false), 200)}
                placeholder="Cari pelanggan..."
                className="input pl-12 bg-transparent text-sm text-slate-900 dark:text-slate-100"
              />
              {showCustomerPanel && (customerResults ?? []).length > 0 && (
                <div className="absolute inset-x-4 top-full z-10 mt-2 rounded-[28px] border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                  {(customerResults ?? []).map((customerItem: any) => (
                    <button key={customerItem.id} onMouseDown={() => { setCustomer(customerItem); setCustomerSearch(''); setShowCustomerPanel(false) }} className="w-full rounded-2xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                      <p className="font-semibold">{customerItem.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{customerItem.phone}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card rounded-[28px] border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Detail Pembayaran</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pilih metode dan masukkan jumlah.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">{cart.length} item</div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Transaksi</div>
              <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(grandTotal)}</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Diskon Global %</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="number" min={0} max={100} value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value))} className="input pl-12" />
                </div>
              </div>
              <div>
                <label className="label">Pajak %</label>
                <div className="relative">
                  <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="number" min={0} max={100} value={taxPct} onChange={(e) => setTaxPct(Number(e.target.value))} className="input pl-12" />
                </div>
              </div>
            </div>

            <div>
              <label className="label">Catatan Transaksi</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="input resize-none" placeholder="Masukkan keterangan seperti diskon khusus atau catatan pelanggan." />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Metode Pembayaran</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <button key={method.id} type="button" onClick={() => setPayMethod(method.id)} className={clsx('flex items-center gap-3 rounded-3xl border p-3 text-sm transition', payMethod === method.id ? 'border-primary-500 bg-primary-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200')}>
                    <span className={clsx('grid h-10 w-10 place-items-center rounded-2xl text-white', method.color)}>
                      <method.icon size={18} />
                    </span>
                    <div className="text-left">
                      <p className="font-semibold">{method.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {payMethod === 'cash' && (
              <div className="space-y-3">
                <div>
                  <label className="label">Uang Diterima</label>
                  <input type="text" value={cashInput} onChange={(e) => setCashInput(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="input text-right text-lg font-semibold" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickCash.map((value) => (
                    <button key={value} type="button" onClick={() => setCashInput(String(value))} className="rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">{formatRupiah(value)}</button>
                  ))}
                </div>
                {cashAmt >= grandTotal && (
                  <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="font-semibold">Kembalian</div>
                    <div className="mt-2 text-xl font-semibold">{formatRupiah(change)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Konfirmasi Pembayaran</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Periksa detail sebelum menyelesaikan transaksi.</p>
              </div>
              <button onClick={() => setShowPayment(false)} className="rounded-2xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-4 py-5 md:grid-cols-2">
              <div className="rounded-[28px] bg-slate-100 p-5 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Total Tagihan</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(grandTotal)}</p>
              </div>
              <div className="rounded-[28px] bg-slate-100 p-5 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Metode</p>
                <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{PAYMENT_METHODS.find((method) => method.id === payMethod)?.label}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleSubmit} disabled={submitting || (payMethod === 'cash' && cashAmt < grandTotal)} className="btn-success w-full btn-lg">
                {submitting ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
              <button onClick={() => setShowPayment(false)} className="btn-secondary w-full btn-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showHeld && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transaksi Di-hold</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pilih transaksi untuk direcall.</p>
              </div>
              <button onClick={() => setShowHeld(false)} className="rounded-2xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {(heldData ?? []).length === 0 ? (
                <div className="rounded-3xl border border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  Tidak ada transaksi yang di-hold.
                </div>
              ) : (
                (heldData ?? []).map((hold: any) => (
                  <div key={hold.id} className="flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 p-4 dark:border-slate-800">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{hold.hold_code}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{hold.customer?.name ?? 'Umum'} · {hold.cart_data?.length ?? 0} item</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(hold.grand_total)}</p>
                      <button onClick={async () => {
                        setCart(hold.cart_data ?? [])
                        await api.delete(`/sales/held/${hold.id}`)
                        setShowHeld(false)
                        toast.success('Transaksi di-recall')
                      }} className="btn-primary btn-sm">Recall</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

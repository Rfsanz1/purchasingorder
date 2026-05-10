import { useState, useRef, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search, Plus, Minus, Trash2, ShoppingCart, User, Tag,
  CreditCard, Banknote, Smartphone, Clock, X, Check,
  Pause, Play, Percent, Calculator, ChevronDown,
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
  { id: 'cash',     label: 'Tunai',    icon: Banknote,    color: 'bg-emerald-500' },
  { id: 'transfer', label: 'Transfer', icon: CreditCard,  color: 'bg-blue-500' },
  { id: 'qris',     label: 'QRIS',     icon: Smartphone,  color: 'bg-purple-500' },
  { id: 'tempo',    label: 'Tempo',    icon: Clock,       color: 'bg-amber-500' },
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
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerPanel, setShowCustomerPanel] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showHeld, setShowHeld] = useState(false)
  const [discountTotal, setDiscountTotal] = useState(0)
  const [discountPct, setDiscountPct] = useState(0)
  const [taxPct, setTaxPct] = useState(0)
  const [payMethod, setPayMethod] = useState('cash')
  const [cashInput, setCashInput] = useState('')
  const [notes, setNotes] = useState('')
  const warehouseId = 1

  // Search products
  const { data: searchResults, isFetching: searching } = useQuery({
    queryKey: ['pos-search', search],
    queryFn: () => search.length > 0
      ? api.get(`/products/search?q=${search}&warehouse_id=${warehouseId}`).then(r => r.data.data)
      : Promise.resolve([]),
    enabled: search.length > 0,
  })

  // Search customers
  const { data: customerResults } = useQuery({
    queryKey: ['pos-customer-search', customerSearch],
    queryFn: () => customerSearch.length > 0
      ? api.get(`/customers/search?q=${customerSearch}`).then(r => r.data.data)
      : Promise.resolve([]),
    enabled: customerSearch.length > 0,
  })

  // Held transactions
  const { data: heldData, refetch: refetchHeld } = useQuery({
    queryKey: ['pos-held'],
    queryFn: () => api.get('/sales/held').then(r => r.data.data),
    enabled: showHeld,
  })

  // Cart math
  const subtotal = cart.reduce((s, i) => s + i.subtotal, 0)
  const discountAmt = discountPct > 0 ? subtotal * discountPct / 100 : discountTotal
  const afterDiscount = subtotal - discountAmt
  const taxAmt = taxPct > 0 ? afterDiscount * taxPct / 100 : 0
  const grandTotal = afterDiscount + taxAmt
  const cashAmt = parseFloat(cashInput.replace(/\D/g, '')) || 0
  const change = Math.max(0, cashAmt - grandTotal)

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.findIndex(i => i.product_id === product.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = calcItem({ ...updated[existing], qty: updated[existing].qty + 1 })
        return updated
      }
      const newItem: CartItem = {
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
      }
      return [...prev, calcItem(newItem)]
    })
    setSearch('')
    searchRef.current?.focus()
  }

  const updateQty = (idx: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev]
      const newQty = updated[idx].qty + delta
      if (newQty <= 0) {
        updated.splice(idx, 1)
        return updated
      }
      updated[idx] = calcItem({ ...updated[idx], qty: newQty })
      return updated
    })
  }

  const setQty = (idx: number, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter((_, i) => i !== idx))
      return
    }
    setCart(prev => {
      const updated = [...prev]
      updated[idx] = calcItem({ ...updated[idx], qty })
      return updated
    })
  }

  const setItemDiscount = (idx: number, pct: number) => {
    setCart(prev => {
      const updated = [...prev]
      updated[idx] = calcItem({ ...updated[idx], discount_pct: pct, discount_amount: 0 })
      return updated
    })
  }

  const removeItem = (idx: number) => setCart(prev => prev.filter((_, i) => i !== idx))

  const { mutate: submitSale, isPending: submitting } = useMutation({
    mutationFn: (data: any) => api.post('/sales', data),
    onSuccess: (res) => {
      toast.success(`Transaksi ${res.data.data.invoice_number} berhasil!`)
      setCart([])
      setCustomer(null)
      setShowPayment(false)
      setCashInput('')
      setNotes('')
      setDiscountTotal(0)
      setDiscountPct(0)
      setTaxPct(0)
      qc.invalidateQueries({ queryKey: ['pos-dashboard-summary'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Transaksi gagal'),
  })

  const { mutate: holdTransaction } = useMutation({
    mutationFn: (data: any) => api.post('/sales/hold', data),
    onSuccess: () => {
      toast.success('Transaksi di-hold')
      setCart([])
      setCustomer(null)
    },
  })

  const handleCheckout = () => {
    if (cart.length === 0) { toast.error('Keranjang kosong!'); return }
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
      items: cart.map(i => ({
        product_id: i.product_id,
        unit_id: i.unit_id,
        product_name: i.product_name,
        product_sku: i.product_sku,
        qty: i.qty,
        unit_price: i.unit_price,
        cost_price: i.cost_price,
        discount_pct: i.discount_pct,
        discount_amount: i.discount_amount,
        subtotal: i.subtotal,
      })),
      payments: [{ method: payMethod, amount: payMethod === 'cash' ? cashAmt : grandTotal }],
    })
  }

  const handleHold = () => {
    if (cart.length === 0) return
    holdTransaction({ cart_data: cart, grand_total: grandTotal, customer_id: customer?.id, notes })
  }

  // Quick cash buttons
  const quickCash = [grandTotal, Math.ceil(grandTotal / 10000) * 10000, Math.ceil(grandTotal / 50000) * 50000, Math.ceil(grandTotal / 100000) * 100000]
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)

  return (
    <div className="flex h-full gap-4 -m-6 p-0 bg-gray-100">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col min-w-0 p-4 gap-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input ref={searchRef} type="text" placeholder="Cari produk, scan barcode..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 pr-4 text-sm h-11 w-full rounded-xl border-gray-200 shadow-sm"
            autoFocus
          />
          {searching && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />}
        </div>

        {/* Search results dropdown */}
        {search.length > 0 && (searchResults ?? []).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg max-h-72 overflow-y-auto scrollbar-thin animate-slide-up">
            {(searchResults ?? []).map((p: any) => {
              const stock = p.inventories?.[0]?.qty_on_hand ?? 0
              return (
                <button key={p.id} onClick={() => addToCart(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 text-left border-b border-gray-50 last:border-0 transition-colors">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="text-primary-600" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.sku} · Stok: {stock} {p.unit?.abbreviation}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-primary-600">{formatRupiah(p.selling_price)}</div>
                    <div className="text-xs text-gray-400">/{p.unit?.abbreviation}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {search.length > 0 && !searching && (searchResults ?? []).length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center text-sm text-gray-400">Produk tidak ditemukan</div>
        )}

        {/* Cart */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Keranjang</span>
              {cart.length > 0 && <span className="badge badge-blue">{cart.length} item</span>}
            </div>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-red-500 hover:text-red-700 font-medium">Kosongkan</button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3">
              <ShoppingCart size={40} />
              <p className="text-sm">Cari produk atau scan barcode untuk menambah</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 group">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.product_name}</div>
                    <div className="text-xs text-gray-400">{formatRupiah(item.unit_price)}/{item.unit_name}</div>
                  </div>
                  {/* Discount */}
                  <div className="flex items-center gap-1">
                    <Tag size={12} className="text-gray-300" />
                    <input type="number" min={0} max={100} value={item.discount_pct || ''}
                      onChange={e => setItemDiscount(idx, parseFloat(e.target.value) || 0)}
                      placeholder="0" className="w-10 text-center text-xs border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:border-primary-400"
                    />
                    <span className="text-xs text-gray-400">%</span>
                  </div>
                  {/* Qty */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button onClick={() => updateQty(idx, -1)} className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Minus size={13} />
                    </button>
                    <input type="number" value={item.qty} min={1}
                      onChange={e => setQty(idx, parseFloat(e.target.value) || 0)}
                      className="w-10 text-center text-sm font-bold bg-transparent border-0 focus:outline-none"
                    />
                    <button onClick={() => updateQty(idx, 1)} className="w-7 h-7 rounded-md bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="w-24 text-right">
                    <div className="text-sm font-bold text-gray-900">{formatRupiah(item.subtotal)}</div>
                    {item.discount_amount > 0 && <div className="text-xs text-red-500">-{formatRupiah(item.discount_amount)}</div>}
                  </div>
                  <button onClick={() => removeItem(idx)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Summary */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-3 p-4 border-l border-gray-200 bg-white">
        {/* Customer */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pelanggan</label>
            {customer && <button onClick={() => setCustomer(null)} className="text-xs text-red-400 hover:text-red-600">Hapus</button>}
          </div>
          {customer ? (
            <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
              <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {customer.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-primary-900">{customer.name}</div>
                <div className="text-xs text-primary-500">{customer.phone}</div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Cari pelanggan..."
                value={customerSearch}
                onFocus={() => setShowCustomerPanel(true)}
                onBlur={() => setTimeout(() => setShowCustomerPanel(false), 200)}
                onChange={e => setCustomerSearch(e.target.value)}
                className="input pl-7 text-xs h-9"
              />
              {showCustomerPanel && (customerResults ?? []).length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                  {(customerResults ?? []).map((c: any) => (
                    <button key={c.id} onMouseDown={() => { setCustomer(c); setCustomerSearch(''); setShowCustomerPanel(false) }}
                      className="w-full text-left px-3 py-2 hover:bg-primary-50 text-xs border-b border-gray-50 last:border-0">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-gray-400">{c.phone} · {c.type}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Discount & Tax */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Diskon %</label>
            <div className="relative">
              <Percent size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" min={0} max={100} value={discountPct || ''}
                onChange={e => { setDiscountPct(parseFloat(e.target.value) || 0); setDiscountTotal(0) }}
                placeholder="0" className="input pl-6 text-xs h-8" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Pajak %</label>
            <div className="relative">
              <Calculator size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" min={0} max={100} value={taxPct || ''}
                onChange={e => setTaxPct(parseFloat(e.target.value) || 0)}
                placeholder="0" className="input pl-6 text-xs h-8" />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Subtotal</span><span className="font-medium text-gray-700">{formatRupiah(subtotal)}</span>
          </div>
          {discountAmt > 0 && (
            <div className="flex justify-between text-xs text-red-500">
              <span>Diskon</span><span>-{formatRupiah(discountAmt)}</span>
            </div>
          )}
          {taxAmt > 0 && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Pajak ({taxPct}%)</span><span>{formatRupiah(taxAmt)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-800">Total</span>
            <span className="text-xl font-extrabold text-primary-600">{formatRupiah(grandTotal)}</span>
          </div>
        </div>

        {/* Notes */}
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Catatan transaksi..." rows={2}
          className="input text-xs resize-none" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={handleHold} disabled={cart.length === 0}
            className="btn-secondary btn-sm flex items-center justify-center gap-1.5">
            <Pause size={14} /> Hold
          </button>
          <button onClick={() => { setShowHeld(true); refetchHeld() }}
            className="btn-secondary btn-sm flex items-center justify-center gap-1.5">
            <Play size={14} /> Recall
          </button>
        </div>

        <button onClick={handleCheckout} disabled={cart.length === 0}
          className="btn-primary btn-lg w-full mt-auto text-base font-bold shadow-lg shadow-primary-200">
          <ShoppingCart size={18} />
          Bayar {cart.length > 0 && `(${cart.length})`}
        </button>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">Pembayaran</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Total */}
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <div className="text-xs text-primary-600 font-medium mb-1">Total Pembayaran</div>
                <div className="text-3xl font-extrabold text-primary-700">{formatRupiah(grandTotal)}</div>
              </div>

              {/* Method */}
              <div className="grid grid-cols-4 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={clsx('flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
                      payMethod === m.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300')}>
                    <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', m.color)}>
                      <m.icon size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Cash input */}
              {payMethod === 'cash' && (
                <div>
                  <label className="label">Uang Diterima</label>
                  <input type="text" value={cashInput}
                    onChange={e => setCashInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="0" className="input text-xl font-bold text-right h-12"
                  />
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {quickCash.map(v => (
                      <button key={v} onClick={() => setCashInput(String(v))}
                        className="text-xs bg-gray-100 hover:bg-primary-100 hover:text-primary-700 rounded-lg py-1.5 font-medium transition-colors">
                        {(v / 1000).toFixed(0)}rb
                      </button>
                    ))}
                  </div>
                  {cashAmt >= grandTotal && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex justify-between items-center">
                      <span className="text-sm text-emerald-700 font-medium">Kembalian</span>
                      <span className="text-xl font-extrabold text-emerald-600">{formatRupiah(change)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 pt-0">
              <button onClick={handleSubmit} disabled={submitting || (payMethod === 'cash' && cashAmt < grandTotal)}
                className="btn-success w-full btn-lg text-base font-bold">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  <><Check size={18} /> Proses Pembayaran</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Held Transactions Modal */}
      {showHeld && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">Transaksi Di-hold</h2>
              <button onClick={() => setShowHeld(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              {(heldData ?? []).length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">Tidak ada transaksi yang di-hold</p>
              ) : (
                (heldData ?? []).map((h: any) => (
                  <div key={h.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl mb-2 hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{h.hold_code}</div>
                      <div className="text-xs text-gray-400">{h.customer?.name ?? 'Umum'} · {h.cart_data?.length ?? 0} item</div>
                    </div>
                    <div className="text-sm font-bold text-primary-600">{formatRupiah(h.grand_total)}</div>
                    <button onClick={() => {
                      setCart(h.cart_data ?? [])
                      api.delete(`/sales/held/${h.id}`)
                      setShowHeld(false)
                      toast.success('Transaksi di-recall')
                    }} className="btn-primary btn-sm">Recall</button>
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

// package icon import fix
function Package({ className, size }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.55 4.24M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
      <path d="M3 6.11 12 1l9 5.11v11.78L12 23 3 17.89z" />
    </svg>
  )
}

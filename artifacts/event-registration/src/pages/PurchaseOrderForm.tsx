import { useState, FormEvent, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  User, Phone, MapPin, Package, Hash, DollarSign,
  Truck, UserCheck, MessageSquare, ChevronDown, Plus, Trash2,
  Search, Check,
} from "lucide-react";

const SALES_DATA: Record<string, string> = {
  "Lehan":    "+62 857-2982-4485",
  "Agus":     "+62 857-3084-5708",
  "Imam":     "+62 858-9233-3127",
  "Agung":    "0882-3368-4224",
  "Andre":    "+62 821-3763-3912",
  "Priyanto": "+62 823-3479-2357",
  "Wiwid":    "+62 857-4115-6110",
  "Dhani":    "+62 812-1599-2058",
};
const SALES_NAMES = Object.keys(SALES_DATA);

interface KledoContact {
  id: number;
  name: string;
  mobile_phone?: string;
  email?: string;
}

interface KledoProduct {
  id: number;
  finance_account_id?: number;
  name: string;
  code: string;
  price: number;
  base_price: number;
  unit?: { id: number; name: string };
}

interface OrderItem {
  id: string;
  selectedProduct: KledoProduct | null;
  namaProduk: string;
  jumlahProduk: string;
  hargaProduk: string;
}

interface FormData {
  namaKontak: string;
  nomorTelepon: string;
  alamat: string;
  pesan: string;
  ongkir: string;
  salesPerson: string;
}

const EMPTY_FORM: FormData = {
  namaKontak: "",
  nomorTelepon: "",
  alamat: "",
  pesan: "",
  ongkir: "",
  salesPerson: "",
};

const newItem = (): OrderItem => ({
  id: Math.random().toString(36).slice(2),
  selectedProduct: null,
  namaProduk: "",
  jumlahProduk: "1",
  hargaProduk: "",
});

function formatRupiahInput(val: string): string {
  const num = val.replace(/\D/g, "");
  if (!num) return "";
  return parseInt(num, 10).toLocaleString("id-ID");
}

function parseRupiah(val: string): number {
  return parseInt(val.replace(/\./g, "").replace(/\D/g, "") || "0", 10);
}

function validate(form: FormData, items: OrderItem[]): string | null {
  if (!form.namaKontak.trim()) return "Nama konsumen wajib diisi";
  if (items.length === 0) return "Minimal 1 produk harus dipilih";
  for (let i = 0; i < items.length; i++) {
    if (!items[i].namaProduk.trim()) return `Produk ke-${i + 1}: nama produk wajib dipilih`;
  }
  if (!form.salesPerson) return "Sales person wajib dipilih";
  return null;
}

// Searchable product combobox
function ProductCombobox({ value, onSelect, onClear, placeholder }: {
  value: KledoProduct | null;
  onSelect: (p: KledoProduct) => void;
  onClear: () => void;
  placeholder?: string;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<KledoProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setFocused(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const doSearch = (q: string) => {
    if (debounce.current) clearTimeout(debounce.current);
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/kledo/products?search=${encodeURIComponent(q)}&page=1`);
        const data = await res.json();
        setResults((data.products || []) as KledoProduct[]);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
  };

  const handleSelect = (p: KledoProduct) => {
    onSelect(p); setSearch(""); setOpen(false); setFocused(false);
  };

  const handleClear = () => {
    onClear(); setSearch(""); setResults([]); setOpen(false);
  };

  const floated = !!value || focused || !!search;

  return (
    <div className="po-field po-field--combo" ref={wrapRef} style={{ marginBottom: 0 }}>
      <span className={`po-icon${focused ? " po-icon--focus" : ""}`}><Package size={15} /></span>

      {value ? (
        <div className="po-product-selected" onClick={() => { handleClear(); setFocused(true); }}>
          <div className="po-product-selected-name">{value.name}</div>
          <div className="po-product-selected-meta">{value.code} · Rp {(value.price || value.base_price || 0).toLocaleString("id-ID")}</div>
          <button type="button" className="po-product-clear" onClick={e => { e.stopPropagation(); handleClear(); }}>✕</button>
        </div>
      ) : (
        <input
          className="po-input po-combobox-input"
          placeholder=" "
          value={search}
          onChange={e => { setSearch(e.target.value); doSearch(e.target.value); }}
          onFocus={() => { setFocused(true); if (search.length >= 2) setOpen(true); }}
          autoComplete="off"
        />
      )}

      <label className={`po-label${floated ? " po-label--float" : ""}${focused ? " po-label--focus" : ""}`}>
        {placeholder || "Nama Produk"} <span className="po-required">*</span>
      </label>

      {open && results.length > 0 && (
        <ul className="po-combo-dropdown">
          {results.map(p => (
            <li key={p.id} className="po-combo-item" onMouseDown={() => handleSelect(p)}>
              <div className="po-combo-item-name">{p.name}</div>
              <div className="po-combo-item-meta">
                <span className="po-combo-sku">{p.code}</span>
                {(p.price > 0 || p.base_price > 0) && <span className="po-combo-price">Rp {(p.price || p.base_price).toLocaleString("id-ID")}</span>}
                {p.unit && <span className="po-combo-unit">/ {p.unit.name}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {open && !loading && search.length >= 2 && results.length === 0 && (
        <div className="po-combo-empty">Produk tidak ditemukan</div>
      )}
    </div>
  );
}

// Searchable contact combobox — search kontak yang sudah ada di Kledo
function ContactCombobox({ value, onChange, onSelect }: {
  value: string;
  onChange: (name: string) => void;
  onSelect: (contact: KledoContact) => void;
}) {
  const [results, setResults] = useState<KledoContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setFocused(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const doSearch = (q: string) => {
    onChange(q);
    if (debounce.current) clearTimeout(debounce.current);
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/kledo/contacts?search=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults((data.contacts || []) as KledoContact[]);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
  };

  const handleSelect = (c: KledoContact) => {
    onSelect(c);
    setOpen(false);
    setFocused(false);
    setResults([]);
  };

  const floated = !!value || focused;

  return (
    <div className="po-field po-field--combo" ref={wrapRef}>
      <span className={`po-icon${focused ? " po-icon--focus" : ""}`}><User size={15} /></span>
      <input
        className="po-input po-combobox-input"
        placeholder=" "
        value={value}
        onChange={e => doSearch(e.target.value)}
        onFocus={() => { setFocused(true); if (value.length >= 2) setOpen(true); }}
        autoComplete="off"
      />
      <label className={`po-label${floated ? " po-label--float" : ""}${focused ? " po-label--focus" : ""}`}>
        Nama Kontak <span className="po-required">*</span>
      </label>

      {loading && value.length >= 2 && (
        <div className="po-combo-dropdown" style={{ padding: "8px 12px", color: "#888", fontSize: 13 }}>
          Mencari kontak...
        </div>
      )}

      {!loading && open && results.length > 0 && (
        <ul className="po-combo-dropdown">
          {results.map(c => (
            <li key={c.id} className="po-combo-item" onMouseDown={() => handleSelect(c)}>
              <div className="po-combo-item-name">{c.name}</div>
              {c.mobile_phone && (
                <div className="po-combo-item-meta">
                  <span className="po-combo-sku">{c.mobile_phone}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && open && value.length >= 2 && results.length === 0 && (
        <div className="po-combo-dropdown" style={{ padding: "8px 12px", color: "#888", fontSize: 13 }}>
          Tidak ada kontak cocok — akan dibuat kontak baru
        </div>
      )}
    </div>
  );
}

function FormDropdown({
  label, value, options, onChange, disabled, required, icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="addr-dd" ref={wrapRef}>
      <button
        type="button"
        className={[
          "addr-trigger",
          open ? "addr-trigger--open" : "",
          value ? "addr-trigger--filled" : "",
          disabled ? "addr-trigger--disabled" : "",
        ].filter(Boolean).join(" ")}
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
      >
        <span className="addr-trigger-icon">{icon ?? <MapPin size={15} />}</span>
        <span className="addr-trigger-body">
          <span className="addr-trigger-label">{label}{required && <span className="po-required"> *</span>}</span>
          <span className={`addr-trigger-value${!value ? " addr-trigger-value--empty" : ""}`}>
            {value || (disabled ? "Pilih kecamatan dulu" : `Pilih ${label}`)}
          </span>
        </span>
        <ChevronDown size={15} className={`addr-chevron${open ? " addr-chevron--up" : ""}`} />
      </button>

      {open && (
        <div className="addr-panel">
          <div className="addr-search-row">
            <Search size={13} className="addr-search-icon" />
            <input
              ref={searchRef}
              className="addr-search"
              placeholder={`Cari ${label.toLowerCase()}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" className="addr-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <ul className="addr-list">
            {filtered.length === 0 ? (
              <li className="addr-empty">Tidak ditemukan</li>
            ) : filtered.map(opt => (
              <li
                key={opt}
                className={`addr-option${value === opt ? " addr-option--active" : ""}`}
                onMouseDown={() => { onChange(opt); setOpen(false); setSearch(""); }}
              >
                <Check size={12} className="addr-option-check" />
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FormInput({
  label, required, hint, icon, value, onChange, onFocus, onBlur,
  inputMode, placeholder, maxLength, type = "text",
}: {
  label: string; required?: boolean; hint?: string; icon?: React.ReactNode;
  value: string; onChange: (v: string) => void;
  onFocus?: () => void; onBlur?: () => void;
  type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string; maxLength?: number;
}) {
  return (
    <div className="fi-group">
      <label className="fi-label">{label}{required && <span className="po-required"> *</span>}</label>
      <div className={`fi-input-wrap${icon ? " fi-input-wrap--icon" : ""}`}>
        {icon && <span className="fi-icon">{icon}</span>}
        <input
          className={`fi-input${icon ? " fi-input--padded" : ""}`}
          type={type} inputMode={inputMode}
          placeholder={placeholder || ""}
          value={value} maxLength={maxLength}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus} onBlur={onBlur}
        />
      </div>
      {hint && <p className="fi-hint">{hint}</p>}
    </div>
  );
}

function FormTextarea({
  label, required, hint, value, onChange, onFocus, onBlur, placeholder, rows = 2,
}: {
  label: string; required?: boolean; hint?: string;
  value: string; onChange: (v: string) => void;
  onFocus?: () => void; onBlur?: () => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div className="fi-group">
      <label className="fi-label">{label}{required && <span className="po-required"> *</span>}</label>
      <textarea
        className="fi-textarea"
        placeholder={placeholder || ""}
        value={value} rows={rows}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus} onBlur={onBlur}
      />
      {hint && <p className="fi-hint">{hint}</p>}
    </div>
  );
}

export default function PurchaseOrderForm() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [items, setItems] = useState<OrderItem[]>([newItem()]);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }));

  const updateItem = (id: string, patch: Partial<OrderItem>) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));

  const addItem = () => setItems(prev => [...prev, newItem()]);
  const removeItem = (id: string) => setItems(prev => prev.filter(it => it.id !== id));

  const handleSelectProduct = (itemId: string, p: KledoProduct) => {
    updateItem(itemId, {
      selectedProduct: p,
      namaProduk: p.name,
      hargaProduk: (p.price || p.base_price) > 0 ? (p.price || p.base_price).toLocaleString("id-ID") : "",
    });
  };

  const handleClearProduct = (itemId: string) => {
    updateItem(itemId, { selectedProduct: null, namaProduk: "", hargaProduk: "" });
  };

  const subtotal = items.reduce((s, it) => {
    const harga = parseRupiah(it.hargaProduk);
    const qty = parseInt(it.jumlahProduk || "0");
    return s + harga * (qty || 1);
  }, 0);
  const ongkirValue = parseRupiah(form.ongkir);
  const total = subtotal + ongkirValue;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validate(form, items);
    if (err) {
      Swal.fire({ icon: "error", title: "Oops!", text: err, confirmButtonColor: "#0097e6" });
      return;
    }

    setSubmitting(true);
    Swal.fire({ title: "Mengirim pesanan...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      // Referensi otomatis dari sales mapping
      const referensi = `Sales: ${form.salesPerson} - ${SALES_DATA[form.salesPerson] || "-"}`;

      const res = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaKontak: form.namaKontak,
          nomorTelepon: form.nomorTelepon || "",
          alamat: form.alamat || "",
          alamatKledo: form.alamat || "",
          patokanLokasi: form.pesan || "",
          salesPerson: form.salesPerson,
          referensi,
          biayaPengiriman: ongkirValue || null,
          metodePembayaran: "CASH",
          // Items array (mendukung multi-produk)
          items: items.map(it => ({
            namaProduk: it.namaProduk,
            jumlahProduk: parseInt(it.jumlahProduk) || 1,
            hargaProduk: parseRupiah(it.hargaProduk),
            kledoProductId: it.selectedProduct?.id ?? null,
            kledoFinanceAccountId: it.selectedProduct?.finance_account_id ?? null,
            kledoUnitId: it.selectedProduct?.unit?.id ?? null,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "Pesanan Terkirim!",
          html:
            `<p>Order ID: <b>#${data.orderId}</b></p>` +
            (data.kledoInvoiceNumber
              ? `<p style="margin-top:6px;color:#0097e6;">📑 Invoice Kledo: <b>${data.kledoInvoiceNumber}</b></p>`
              : "") +
            (data.whatsappSent
              ? `<p style="margin-top:6px;color:#27ae60;">✅ Invoice WA telah dikirim ke nomor kamu</p>`
              : `<p style="margin-top:6px;color:#888;">📋 Pesanan telah dicatat</p>`),
          confirmButtonColor: "#0097e6",
        });
        setForm(EMPTY_FORM);
        setItems([newItem()]);
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.error || "Terjadi kesalahan", confirmButtonColor: "#0097e6" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Koneksi Error", text: "Tidak dapat menghubungi server. Coba lagi.", confirmButtonColor: "#0097e6" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="po-bg">
      <div className="po-card">
        <div className="po-header">
          <div className="po-header-icon">🛍️</div>
          <h1 className="po-title">Purchase Order</h1>
          <p className="po-subtitle">
            Form ini dibuat untuk memudahkan tim marketing agar dapat menangani
            lebih dari tiga konsumen dalam satu waktu, serta telah diintegrasikan
            dengan WhatsApp Admin sehingga invoice akan keluar otomatis.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── 1. Nama Konsumen ── */}
          <div className="addr-card">
            <div className="addr-card-header">
              <User size={14} />
              <span>Data Konsumen</span>
            </div>
            <div className="addr-card-body">
              <ContactCombobox
                value={form.namaKontak}
                onChange={v => set("namaKontak", v)}
                onSelect={c => {
                  set("namaKontak", c.name);
                  if (c.mobile_phone) set("nomorTelepon", c.mobile_phone);
                }}
              />

              {/* ── 2. Nomor Telepon ── */}
              <FormInput
                label="Nomor Telepon"
                icon={<Phone size={15} />}
                value={form.nomorTelepon}
                onChange={v => set("nomorTelepon", v)}
                placeholder="contoh: 08780000000"
                inputMode="tel"
              />

              {/* ── 3. Alamat ── */}
              <FormTextarea
                label="Alamat"
                value={form.alamat}
                onChange={v => set("alamat", v)}
                placeholder="Contoh: Jl. Merdeka No. 5, RT 01/RW 02, Temanggung"
                rows={2}
              />
            </div>
          </div>

          {/* ── 4. Nama Produk ── */}
          <div className="addr-card">
            <div className="addr-card-header">
              <Package size={14} />
              <span>Produk</span>
            </div>
            <div className="addr-card-body">
              <p className="fi-hint" style={{ marginTop: 0, marginBottom: 2 }}>
                Ketik minimal 2 huruf untuk mencari produk dari Kledo. Bisa tambah lebih dari 1 produk.
              </p>

              {items.map((item, idx) => (
                <div key={item.id} className="po-item-block">
                  {items.length > 1 && (
                    <div className="po-item-header">
                      <span className="po-item-label">Produk {idx + 1}</span>
                      <button type="button" className="po-item-remove" onClick={() => removeItem(item.id)}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  )}

                  <ProductCombobox
                    value={item.selectedProduct}
                    onSelect={p => handleSelectProduct(item.id, p)}
                    onClear={() => handleClearProduct(item.id)}
                    placeholder={items.length > 1 ? `Nama Produk ${idx + 1}` : "Nama Produk"}
                  />

                  <div className="fi-2col" style={{ marginTop: 10 }}>
                    <div className="fi-group" style={{ marginBottom: 0 }}>
                      <label className="fi-label">Jumlah</label>
                      <div className="fi-input-wrap fi-input-wrap--icon">
                        <span className="fi-icon"><Hash size={14} /></span>
                        <input className="fi-input fi-input--padded" type="number" min="1"
                          placeholder="1"
                          value={item.jumlahProduk}
                          onChange={e => updateItem(item.id, { jumlahProduk: e.target.value })} />
                      </div>
                    </div>
                    <div className="fi-group" style={{ marginBottom: 0 }}>
                      <label className="fi-label">Harga (Rp)</label>
                      <div className="fi-input-wrap fi-input-wrap--icon">
                        <span className="fi-icon"><DollarSign size={14} /></span>
                        <input className="fi-input fi-input--padded" inputMode="numeric"
                          placeholder="0"
                          value={item.hargaProduk}
                          onChange={e => updateItem(item.id, { hargaProduk: formatRupiahInput(e.target.value) })} />
                      </div>
                    </div>
                  </div>

                  {item.hargaProduk && item.jumlahProduk && (
                    <div className="po-item-subtotal">
                      {parseInt(item.jumlahProduk) > 1
                        ? `${parseInt(item.jumlahProduk)} × Rp ${parseRupiah(item.hargaProduk).toLocaleString("id-ID")} = `
                        : ""}
                      <strong>Rp {(parseRupiah(item.hargaProduk) * (parseInt(item.jumlahProduk) || 1)).toLocaleString("id-ID")}</strong>
                    </div>
                  )}
                </div>
              ))}

              <button type="button" className="po-add-item" onClick={addItem}>
                <Plus size={15} /> Tambah Produk
              </button>

              <FormInput
                label="Biaya Pengiriman / Ongkir (Rp)"
                icon={<Truck size={15} />}
                value={form.ongkir}
                onChange={v => set("ongkir", formatRupiahInput(v))}
                placeholder="0 — kosongkan jika gratis"
                inputMode="numeric"
                hint="Opsional"
              />

              {(subtotal > 0 || ongkirValue > 0) && (
                <div className="po-total-preview">
                  {subtotal > 0 && <div className="po-total-sub">Subtotal produk: Rp {subtotal.toLocaleString("id-ID")}</div>}
                  {ongkirValue > 0 && <div className="po-total-sub">Ongkir: Rp {ongkirValue.toLocaleString("id-ID")}</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Total</span>
                    <span className="po-total-value">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 5. Pesan / Catatan ── */}
          <div className="addr-card">
            <div className="addr-card-header">
              <MessageSquare size={14} />
              <span>Pesan / Catatan</span>
            </div>
            <div className="addr-card-body">
              <FormTextarea
                label="Pesan / Catatan"
                value={form.pesan}
                onChange={v => set("pesan", v)}
                placeholder="Contoh: depan kolam, pagar besi biru…"
                rows={2}
              />
            </div>
          </div>

          {/* ── 6. Sales Person ── */}
          <div className="addr-card">
            <div className="addr-card-header">
              <UserCheck size={14} />
              <span>Sales Person</span>
            </div>
            <div className="addr-card-body">
              <FormDropdown
                label="Sales Person" required
                icon={<UserCheck size={15} />}
                value={form.salesPerson}
                options={SALES_NAMES}
                onChange={v => set("salesPerson", v)}
              />
              {form.salesPerson && (
                <p className="fi-hint" style={{ marginTop: 4 }}>
                  Referensi Kledo: <strong>Sales: {form.salesPerson} - {SALES_DATA[form.salesPerson]}</strong>
                </p>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="po-btn">
            {submitting ? "Mengirim..." : "📤 Kirim Pesanan"}
          </button>
        </form>
      </div>
    </div>
  );
}

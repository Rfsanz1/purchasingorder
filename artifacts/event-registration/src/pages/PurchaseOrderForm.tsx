import { useState, FormEvent, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  User, Phone, MapPin, Package, Hash, DollarSign,
  Truck, UserCheck, MessageSquare, ChevronDown, Plus, Trash2,
  Search, Check,
} from "lucide-react";
import { SALES_SCOPES } from "@/lib/salesFilters";

const SALES_DATA: Record<string, string> = {
  "Lehan":       "+62 857-2982-4485",
  "Agus":        "+62 857-3084-5708",
  "Ivan":        "+62 857-1820-0975",
  "Dias":        "+62 852-2996-0722",
  "Rio Brandon": "+62 859-5282-5277",
  "Imam":        "+62 858-9233-3127",
  "Agung":       "0882-3368-4224",
  "Andre":       "+62 821-3763-3912",
  "Priyanto":    "+62 823-3479-2357",
  "Wiwid":       "+62 857-4115-6110",
  "Dhani":       "+62 812-1599-2058",
};
const SALES_NAMES = Object.keys(SALES_DATA);

interface KledoContact {
  id: number;
  name: string;
  mobile_phone?: string;
  email?: string;
  address?: string;
}

interface KledoProduct {
  id: number;
  finance_account_id?: number;
  name: string;
  code: string;
  price: number;
  base_price: number;
  unit?: { id: number; name: string };
  pos_product_category_id?: number | null;
}

interface OrderItem {
  id: string;
  selectedProduct: KledoProduct | null;
  namaProduk: string;
  jumlahProduk: string;
  hargaProduk: string;
}

type MetodePembayaran = "CASH" | "Debit" | "Transfer";

interface FormData {
  namaKontak: string;
  nomorTelepon: string;
  alamat: string;
  pesan: string;
  ongkir: string;
  salesPerson: string;
  metodePembayaran: MetodePembayaran;
  bankAccountId: string;          // sebagai string untuk dropdown
  buktiTransferDataUrl: string;   // base64 dataURL (opsional)
}

const EMPTY_FORM: FormData = {
  namaKontak: "",
  nomorTelepon: "",
  alamat: "",
  pesan: "",
  ongkir: "",
  salesPerson: "",
  metodePembayaran: "CASH",
  bankAccountId: "",
  buktiTransferDataUrl: "",
};

// Daftar bank transfer & EDC yang ada di Kledo
const TRANSFER_BANKS: { id: number; label: string }[] = [
  { id: 1470, label: "BCA GIRO – 155 91 99999 (a.n. INDARTO WIBOWO)" },
  { id: 3,    label: "MANDIRI – 136 000 4780612 (a.n. DIAN PURNAMA)" },
  { id: 1456, label: "BNI – 0822 705 836 (a.n. INDARTO WIBOWO)" },
  { id: 1464, label: "BRI – 0262 01 000031 562 (a.n. DIAN PURNAMA REZA T.)" },
];
const EDC_BANKS: { id: number; label: string }[] = [
  { id: 1465, label: "BCA EDC" },
  { id: 1457, label: "BRI EDC" },
];

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
  if (form.metodePembayaran === "Transfer" && !form.bankAccountId) return "Pilih bank tujuan transfer";
  if (form.metodePembayaran === "Debit" && !form.bankAccountId) return "Pilih mesin EDC yang dipakai";
  return null;
}

// Searchable product combobox
function ProductCombobox({ value, onSelect, onClear, placeholder, salesPerson }: {
  value: KledoProduct | null;
  onSelect: (p: KledoProduct) => void;
  onClear: () => void;
  placeholder?: string;
  salesPerson?: string;
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
        // Bila sales merek-spesifik (mis. Lehan/Kansai), tambahkan keyword
        // mereknya ke query agar hasil dari Kledo lebih relevan sejak awal.
        const scope = salesPerson ? SALES_SCOPES[salesPerson.toLowerCase()] : null;
        const brandHint =
          salesPerson?.toLowerCase() === "lehan"    ? "aqua" :
          salesPerson?.toLowerCase() === "wiwid"    ? "steko" :
          salesPerson?.toLowerCase() === "priyanto" ? "changhong" :
          salesPerson?.toLowerCase() === "agus"     ? "tcl" :
          salesPerson?.toLowerCase() === "andre"    ? "rsa" :
          salesPerson?.toLowerCase() === "imam"     ? "sanken" :
          salesPerson?.toLowerCase() === "dhani"    ? "artugo" :
          salesPerson?.toLowerCase() === "rio brandon" ? "kansai" :
          "";
        const finalQ = brandHint && !q.toLowerCase().includes(brandHint)
          ? `${brandHint} ${q}` : q;

        const res = await fetch(`${baseUrl}/api/kledo/products?search=${encodeURIComponent(finalQ)}&page=1`);
        const data = await res.json();
        let products = (data.products || []) as KledoProduct[];

        // Filter berdasarkan kategori sales — biar tidak kecampur lintas kategori
        if (scope) {
          products = products.filter(p => scope.matchProduct({
            name: p.name,
            categoryId: p.pos_product_category_id ?? null,
          }));
        }

        setResults(products);
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

// Searchable phone combobox — cari kontak yang pernah membeli berdasarkan nomor HP
function PhoneCombobox({ value, onChange, onSelect }: {
  value: string;
  onChange: (phone: string) => void;
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
    const digits = q.replace(/\D/g, "");
    if (digits.length < 3) { setResults([]); setOpen(false); return; }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/kledo/contacts?search=${encodeURIComponent(digits)}`);
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

  return (
    <div className="fi-group" ref={wrapRef} style={{ position: "relative" }}>
      <label className="fi-label">Nomor Telepon</label>
      <div className="fi-input-wrap fi-input-wrap--icon">
        <span className="fi-icon"><Phone size={15} /></span>
        <input
          className="fi-input fi-input--padded"
          type="text"
          inputMode="tel"
          placeholder="contoh: 08780000000 — ketik untuk cari konsumen lama"
          value={value}
          onChange={e => doSearch(e.target.value)}
          onFocus={() => { setFocused(true); if (value.replace(/\D/g, "").length >= 3) setOpen(true); }}
          autoComplete="off"
        />
      </div>

      {focused && loading && value.replace(/\D/g, "").length >= 3 && (
        <div className="po-combo-dropdown" style={{ padding: "8px 12px", color: "#888", fontSize: 13 }}>
          Mencari konsumen…
        </div>
      )}

      {!loading && open && results.length > 0 && (
        <ul className="po-combo-dropdown">
          {results.map(c => (
            <li key={c.id} className="po-combo-item" onMouseDown={() => handleSelect(c)}>
              <div className="po-combo-item-name">{c.name}</div>
              <div className="po-combo-item-meta">
                {c.mobile_phone && <span className="po-combo-sku">{c.mobile_phone}</span>}
                {c.address && <span className="po-combo-unit" style={{ marginLeft: 8 }}>{c.address}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && open && value.replace(/\D/g, "").length >= 3 && results.length === 0 && (
        <div className="po-combo-dropdown" style={{ padding: "8px 12px", color: "#888", fontSize: 13 }}>
          Tidak ada konsumen dengan nomor ini — akan dipakai sebagai nomor baru
        </div>
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

function BankCombobox({
  options, value, onChange, placeholder, icon,
}: {
  options: { id: number; label: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon?: string;
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

  const selected = options.find(o => String(o.id) === value) || null;
  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  const parseLabel = (label: string) => {
    const dashIdx = label.indexOf("–");
    if (dashIdx === -1) return { name: label, meta: "" };
    return { name: label.slice(0, dashIdx).trim(), meta: label.slice(dashIdx + 1).trim() };
  };

  return (
    <div className="bank-combo" ref={wrapRef}>
      {selected ? (
        <div className="bank-combo-selected" onClick={() => setOpen(true)}>
          <div className="bank-combo-selected-icon">{icon ?? "🏦"}</div>
          <div className="bank-combo-selected-body">
            <div className="bank-combo-selected-name">{parseLabel(selected.label).name}</div>
            {parseLabel(selected.label).meta && (
              <div className="bank-combo-selected-meta">{parseLabel(selected.label).meta}</div>
            )}
          </div>
          <button
            type="button"
            className="bank-combo-clear"
            onClick={e => { e.stopPropagation(); onChange(""); }}
          >✕</button>
        </div>
      ) : (
        <button
          type="button"
          className="bank-combo-trigger"
          onClick={() => setOpen(v => !v)}
        >
          <span className="bank-combo-trigger-icon">{icon ?? "🏦"}</span>
          <span className="bank-combo-trigger-text">{placeholder}</span>
          <ChevronDown size={16} className={`bank-combo-chev${open ? " up" : ""}`} />
        </button>
      )}

      {open && (
        <div className="bank-combo-panel">
          {options.length > 4 && (
            <div className="bank-combo-search-row">
              <Search size={14} className="bank-combo-search-icon" />
              <input
                ref={searchRef}
                className="bank-combo-search"
                placeholder="Cari bank…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}
          <ul className="bank-combo-list">
            {filtered.length === 0 ? (
              <li className="bank-combo-empty">Tidak ditemukan</li>
            ) : filtered.map(opt => {
              const { name, meta } = parseLabel(opt.label);
              const active = String(opt.id) === value;
              return (
                <li
                  key={opt.id}
                  className={`bank-combo-item${active ? " active" : ""}`}
                  onMouseDown={() => { onChange(String(opt.id)); setOpen(false); setSearch(""); }}
                >
                  <div className="bank-combo-item-icon">{icon ?? "🏦"}</div>
                  <div className="bank-combo-item-body">
                    <div className="bank-combo-item-name">{name}</div>
                    {meta && <div className="bank-combo-item-meta">{meta}</div>}
                  </div>
                  {active && <Check size={16} className="bank-combo-item-check" />}
                </li>
              );
            })}
          </ul>
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
    const basePrice = p.price || p.base_price || 0;
    // Otomatis tambahkan profit 15% ke harga produk
    const priceWithProfit = basePrice > 0 ? Math.round(basePrice * 1.15) : 0;
    updateItem(itemId, {
      selectedProduct: p,
      namaProduk: p.name,
      hargaProduk: priceWithProfit > 0 ? priceWithProfit.toLocaleString("id-ID") : "",
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
          metodePembayaran: form.metodePembayaran,
          kledoBankAccountId: form.bankAccountId ? parseInt(form.bankAccountId, 10) : null,
          buktiTransferBase64: form.metodePembayaran === "Transfer" ? (form.buktiTransferDataUrl || null) : null,
          // Items array (mendukung multi-produk)
          items: items.map(it => ({
            namaProduk: it.namaProduk,
            jumlahProduk: parseInt(it.jumlahProduk) || 1,
            hargaProduk: parseRupiah(it.hargaProduk),
            kledoProductId: it.selectedProduct?.id ?? null,
            kledoFinanceAccountId: it.selectedProduct?.finance_account_id ?? null,
            kledoUnitId: it.selectedProduct?.unit?.id ?? null,
            kategoriId: it.selectedProduct?.pos_product_category_id ?? null,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: data.kledoInvoiceNumber ? "success" : "warning",
          title: data.kledoInvoiceNumber ? "Pesanan Terkirim!" : "Pesanan Dicatat, Invoice Gagal",
          html:
            `<p>Order ID: <b>#${data.orderId}</b></p>` +
            (data.kledoInvoiceNumber
              ? `<p style="margin-top:6px;color:#0097e6;">📑 Invoice Kledo: <b>${data.kledoInvoiceNumber}</b></p>`
              : `<p style="margin-top:8px;color:#e67e22;font-weight:600;">⚠️ Invoice Kledo tidak terbuat</p><p style="margin-top:4px;color:#888;font-size:13px;">Nama produk tidak ditemukan di Kledo — periksa ejaan produk</p>`) +
            (data.whatsappSent
              ? `<p style="margin-top:6px;color:#27ae60;">✅ Notifikasi WA telah dikirim</p>`
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
                  setForm(p => ({
                    ...p,
                    namaKontak: c.name,
                    nomorTelepon: c.mobile_phone || p.nomorTelepon,
                    alamat: c.address || p.alamat,
                  }));
                }}
              />

              {/* ── 2. Nomor Telepon — bisa cari konsumen lama dari nomor HP ── */}
              <PhoneCombobox
                value={form.nomorTelepon}
                onChange={v => set("nomorTelepon", v)}
                onSelect={c => {
                  setForm(p => ({
                    ...p,
                    namaKontak: c.name,
                    nomorTelepon: c.mobile_phone || p.nomorTelepon,
                    alamat: c.address || p.alamat,
                  }));
                }}
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
                    salesPerson={form.salesPerson}
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

          {/* ── 5b. Metode Pembayaran ── */}
          <div className="addr-card pay-card">
            <div className="addr-card-header">
              <span style={{ fontSize: 14 }}>💳</span>
              <span>Metode Pembayaran</span>
            </div>
            <div className="addr-card-body">
              <div className="pay-method-grid">
                {([
                  { v: "CASH", icon: "💵", label: "Cash", desc: "Bayar tunai di tempat" },
                  { v: "Debit", icon: "💳", label: "Debit (EDC)", desc: "Gesek kartu via mesin EDC" },
                  { v: "Transfer", icon: "🏦", label: "Transfer", desc: "Transfer ke rekening toko" },
                ] as const).map(m => {
                  const active = form.metodePembayaran === m.v;
                  return (
                    <label key={m.v} className={`pay-method-card${active ? " active" : ""}`}>
                      <input
                        type="radio"
                        name="metodePembayaran"
                        value={m.v}
                        checked={active}
                        onChange={() => setForm(p => ({ ...p, metodePembayaran: m.v, bankAccountId: "", buktiTransferDataUrl: "" }))}
                      />
                      <div className="pay-method-icon">{m.icon}</div>
                      <div className="pay-method-text">
                        <div className="pay-method-label">{m.label}</div>
                        <div className="pay-method-desc">{m.desc}</div>
                      </div>
                      <div className="pay-method-check">{active ? "✓" : ""}</div>
                    </label>
                  );
                })}
              </div>

              {form.metodePembayaran === "Debit" && (
                <div className="pay-detail-box">
                  <label className="pay-detail-label">
                    Mesin EDC <span style={{ color: "#e74c3c" }}>*</span>
                  </label>
                  <BankCombobox
                    options={EDC_BANKS}
                    value={form.bankAccountId}
                    onChange={v => set("bankAccountId", v)}
                    placeholder="Pilih mesin EDC…"
                    icon="💳"
                  />
                </div>
              )}

              {form.metodePembayaran === "Transfer" && (
                <div className="pay-detail-box">
                  <label className="pay-detail-label">
                    Bank Tujuan Transfer <span style={{ color: "#e74c3c" }}>*</span>
                  </label>
                  <BankCombobox
                    options={TRANSFER_BANKS}
                    value={form.bankAccountId}
                    onChange={v => set("bankAccountId", v)}
                    placeholder="Pilih bank tujuan transfer…"
                    icon="🏦"
                  />

                  <div className="pay-bukti-section">
                    <div className="pay-bukti-title">
                      📸 Bukti Transfer
                      <span className="pay-bukti-badge">Foto via Kamera</span>
                    </div>

                    {!form.buktiTransferDataUrl ? (
                      <label className="pay-camera-btn">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => set("buktiTransferDataUrl", String(reader.result || ""));
                            reader.readAsDataURL(file);
                          }}
                          style={{ display: "none" }}
                        />
                        <span className="pay-camera-icon">📷</span>
                        <span className="pay-camera-text">
                          <strong>Ambil Foto Bukti Transfer</strong>
                          <small>Klik untuk membuka kamera HP</small>
                        </span>
                      </label>
                    ) : (
                      <div className="pay-bukti-preview">
                        <img src={form.buktiTransferDataUrl} alt="Preview bukti TF" className="pay-bukti-img" />
                        <div className="pay-bukti-actions">
                          <label className="pay-bukti-retake">
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => set("buktiTransferDataUrl", String(reader.result || ""));
                                reader.readAsDataURL(file);
                              }}
                              style={{ display: "none" }}
                            />
                            🔄 Foto Ulang
                          </label>
                          <button
                            type="button"
                            className="pay-bukti-remove"
                            onClick={() => set("buktiTransferDataUrl", "")}
                          >
                            ✕ Hapus
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="pay-bukti-hint">
                      {form.buktiTransferDataUrl
                        ? "✅ Bukti transfer siap dikirim — invoice akan otomatis Lunas di Kledo & foto diteruskan ke grup admin."
                        : "Foto bukti transfer akan otomatis dikirim ke grup admin di WhatsApp. Jika belum, invoice tetap dibuat namun status belum Lunas."}
                    </p>
                  </div>
                </div>
              )}
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

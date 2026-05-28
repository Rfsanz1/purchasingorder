'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/useAuthStore';
import api from '../lib/api';
import {
  ShoppingCart, Plus, Minus, Trash2, CreditCard,
  Banknote, Smartphone, QrCode, Bell, LogOut, Search,
  Package, RefreshCw, X, Tag, Users, Receipt,
} from 'lucide-react';

const C = '#059669';
const CLT = '#ECFDF5';
const CBG = '#F0FDF4';

interface Product { id: number; name: string; price: number; emoji: string; category: string; stock?: number; }
interface CartItem extends Product { qty: number; }

const DEMO_PRODUCTS: Product[] = [
  { id:1, name:'Semen Portland 40kg', price:50000, emoji:'🏗️', category:'Material', stock:200 },
  { id:2, name:'Cat Tembok 5L', price:55000, emoji:'🎨', category:'Cat', stock:50 },
  { id:3, name:'Pipa PVC 4"', price:25000, emoji:'🚰', category:'Plumbing', stock:80 },
  { id:4, name:'Besi Beton 10mm', price:50000, emoji:'⚙️', category:'Besi', stock:150 },
  { id:5, name:'Keramik 60x60', price:40000, emoji:'🪟', category:'Keramik', stock:300 },
  { id:6, name:'Triplek 9mm', price:85000, emoji:'🌲', category:'Kayu', stock:40 },
  { id:7, name:'Kabel NYM 2x1.5', price:15000, emoji:'⚡', category:'Listrik', stock:500 },
  { id:8, name:'Genteng Beton', price:8000, emoji:'🏠', category:'Atap', stock:1000 },
  { id:9, name:'Lem Kayu Super', price:12000, emoji:'🔧', category:'Aksesori', stock:100 },
  { id:10, name:'Bata Merah', price:1500, emoji:'🧱', category:'Material', stock:5000 },
  { id:11, name:'Pasir Halus /kg', price:2000, emoji:'⬛', category:'Material', stock:10000 },
  { id:12, name:'Plamir Tembok', price:35000, emoji:'🪣', category:'Cat', stock:60 },
];

const CATEGORIES = ['Semua', 'Material', 'Cat', 'Plumbing', 'Besi', 'Keramik', 'Kayu', 'Listrik', 'Atap', 'Aksesori'];
const PAY_METHODS = [
  { key:'cash', label:'Tunai', icon:Banknote },
  { key:'transfer', label:'Transfer', icon:Smartphone },
  { key:'card', label:'Kartu', icon:CreditCard },
  { key:'qris', label:'QRIS', icon:QrCode },
] as const;
type PayMethod = typeof PAY_METHODS[number]['key'];

export default function POSPage() {
  const { token, user, loadProfile, logout } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>('cash');
  const [cashInput, setCashInput] = useState('');
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [member, setMember] = useState('');
  const [mounted, setMounted] = useState(false);
  const [receipt, setReceipt] = useState<{ no: string; total: number; method: string } | null>(null);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      if (!user) await loadProfile().catch(() => { logout(); router.replace('/login'); });
      try {
        const res = await api.get('/pos/products');
        if (res.data?.length) setProducts(res.data);
      } catch { }
      setLoading(false);
      setTimeout(() => setMounted(true), 60);
    };
    init();
  }, [token]);

  if (!token || loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:CBG }}>
      <svg style={{ width:28, height:28, animation:'spin .8s linear infinite', color:C }} viewBox="0 0 24 24" fill="none">
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <circle opacity=".2" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
        <path opacity=".8" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
      </svg>
    </div>
  );

  const addToCart = (p: Product) => setCart(prev => {
    const ex = prev.find(c => c.id === p.id);
    return ex ? prev.map(c => c.id === p.id ? { ...c, qty: c.qty+1 } : c) : [...prev, { ...p, qty:1 }];
  });

  const updateQty = (id: number, delta: number) =>
    setCart(prev => prev.map(c => c.id===id ? { ...c, qty: Math.max(0, c.qty+delta) } : c).filter(c => c.qty > 0));

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal - discount + tax;
  const kembalian = payMethod === 'cash' ? (parseInt(cashInput||'0') - total) : 0;

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const no = `TRX-${Date.now()}`;
    try {
      await api.post('/pos/transactions', {
        items: cart.map(c => ({ productId: c.id, qty: c.qty, price: c.price })),
        total, paymentMethod: payMethod, cashInput: parseInt(cashInput||'0'), voucher, member,
      });
    } catch { }
    setReceipt({ no, total, method: PAY_METHODS.find(m => m.key===payMethod)?.label ?? payMethod });
    setCart([]); setCashInput(''); setVoucher(''); setDiscount(0); setMember(''); setPaying(false);
  };

  const applyVoucher = () => {
    if (voucher.toUpperCase() === 'DISKON10') setDiscount(Math.round(subtotal * 0.1));
    else if (voucher.toUpperCase() === 'DISKON50K') setDiscount(50000);
    else alert('Voucher tidak valid');
  };

  if (receipt) return (
    <div style={{ minHeight:'100vh', backgroundColor:CBG, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ backgroundColor:'#fff', borderRadius:20, padding:32, maxWidth:380, width:'100%', textAlign:'center', boxShadow:`0 12px 40px ${C}20` }}>
        <div style={{ width:64, height:64, borderRadius:'50%', backgroundColor:CLT, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <Receipt size={28} style={{ color:C }} />
        </div>
        <h2 style={{ fontSize:20, fontWeight:800, color:'#064E3B', margin:'0 0 8px' }}>Pembayaran Berhasil!</h2>
        <p style={{ fontSize:13, color:'#6B7280', margin:'0 0 24px' }}>{receipt.no}</p>
        <div style={{ backgroundColor:CBG, borderRadius:14, padding:16, marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:13, color:'#6B7280' }}>Total Bayar</span>
            <span style={{ fontSize:15, fontWeight:800, color:'#064E3B' }}>Rp {receipt.total.toLocaleString('id-ID')}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:13, color:'#6B7280' }}>Metode</span>
            <span style={{ fontSize:13, fontWeight:600, color:C }}>{receipt.method}</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setReceipt(null)} style={{ flex:1, padding:'12px', borderRadius:12, border:`2px solid ${C}`, background:'#fff', color:C, fontSize:13, fontWeight:700, cursor:'pointer' }}>Transaksi Baru</button>
          <button onClick={() => router.push('/orders')} style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background:C, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>Lihat Riwayat</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', backgroundColor:CBG, opacity: mounted?1:0, transition:'opacity .4s', fontFamily:'Inter,sans-serif' }}>

      {/* LEFT: Products */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <header style={{ height:56, backgroundColor:'#fff', borderBottom:`1px solid ${CLT}`, display:'flex', alignItems:'center', padding:'0 16px', gap:12, flexShrink:0 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,#047857,${C})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:12 }}>POS</div>
          <span style={{ fontSize:14, fontWeight:700, color:'#064E3B', flex:1 }}>Kasir — {user?.name}</span>
          <div style={{ position:'relative', flex:1, maxWidth:280 }}>
            <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk…"
              style={{ width:'100%', padding:'7px 12px 7px 32px', borderRadius:10, border:`1.5px solid ${CLT}`, outline:'none', fontSize:13, backgroundColor:'#FAFAFA', boxSizing:'border-box' }} />
          </div>
          <button onClick={() => router.push('/orders')} style={{ padding:'6px 10px', border:'none', borderRadius:8, backgroundColor:CLT, color:C, fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}><Receipt size={13}/> Riwayat</button>
          <button onClick={() => router.push('/sessions')} style={{ padding:'6px 10px', border:'none', borderRadius:8, backgroundColor:CLT, color:'#047857', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}><Bell size={13}/> Sesi</button>
          <button onClick={() => { logout(); router.replace('/login'); }} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 10px', border:'none', borderRadius:8, backgroundColor:'#FEF2F2', color:'#DC2626', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            <LogOut size={12}/> Keluar
          </button>
        </header>

        {/* Category tabs */}
        <div style={{ display:'flex', gap:8, padding:'10px 16px', backgroundColor:'#fff', borderBottom:`1px solid ${CLT}`, overflowX:'auto', flexShrink:0 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding:'5px 14px', borderRadius:100, border:'none', flexShrink:0, fontSize:12.5, fontWeight:600, cursor:'pointer',
                backgroundColor: activeCategory===cat ? C : CLT,
                color: activeCategory===cat ? '#fff' : '#374151' }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
            {filtered.map(p => (
              <button key={p.id} onClick={() => addToCart(p)}
                style={{ padding:'12px 10px', borderRadius:14, backgroundColor:'#fff', border:`1.5px solid ${CLT}`, cursor:'pointer', textAlign:'left', transition:'all .2s' }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor=C; b.style.boxShadow=`0 4px 16px ${C}25`; b.style.transform='translateY(-1px)'; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor=CLT; b.style.boxShadow='none'; b.style.transform='none'; }}
              >
                <p style={{ fontSize:22, margin:'0 0 6px' }}>{p.emoji}</p>
                <p style={{ fontSize:11.5, fontWeight:600, color:'#1E1B4B', margin:'0 0 4px', lineHeight:1.3 }}>{p.name}</p>
                <p style={{ fontSize:12.5, fontWeight:700, color:C, margin:0 }}>Rp {p.price.toLocaleString('id-ID')}</p>
                {p.stock !== undefined && <p style={{ fontSize:10, color:'#9CA3AF', margin:'2px 0 0' }}>Stok: {p.stock}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div style={{ width:340, flexShrink:0, backgroundColor:'#fff', borderLeft:`1px solid ${CLT}`, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'14px 16px 10px', borderBottom:`1px solid ${CLT}`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#064E3B', margin:0, display:'flex', alignItems:'center', gap:8 }}>
              <ShoppingCart size={16} style={{ color:C }}/> Keranjang
              {cart.length>0 && <span style={{ fontSize:11, fontWeight:700, backgroundColor:C, color:'#fff', borderRadius:100, padding:'1px 7px' }}>{cart.length}</span>}
            </h3>
            {cart.length>0 && <button onClick={() => setCart([])} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#DC2626', border:'none', background:'none', cursor:'pointer', fontWeight:600 }}><RefreshCw size={12}/> Kosongkan</button>}
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'8px 16px' }}>
          {cart.length===0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12, opacity:.4 }}>
              <Package size={40} style={{ color:C }}/>
              <p style={{ fontSize:13, color:'#9CA3AF', margin:0 }}>Keranjang kosong</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:`1px solid ${CLT}` }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{item.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, fontWeight:600, color:'#1E1B4B', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</p>
                <p style={{ fontSize:12, color:C, fontWeight:700, margin:0 }}>Rp {(item.price*item.qty).toLocaleString('id-ID')}</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                <button onClick={() => updateQty(item.id,-1)} style={{ width:22, height:22, borderRadius:6, border:`1px solid ${CLT}`, background:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#9CA3AF' }}><Minus size={11}/></button>
                <span style={{ fontSize:13, fontWeight:700, color:'#1E1B4B', minWidth:18, textAlign:'center' }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id,1)} style={{ width:22, height:22, borderRadius:6, border:'none', backgroundColor:C, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><Plus size={11}/></button>
                <button onClick={() => setCart(p => p.filter(c => c.id !== item.id))} style={{ width:22, height:22, borderRadius:6, border:'none', backgroundColor:'#FEF2F2', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#DC2626' }}><Trash2 size={11}/></button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + Payment */}
        <div style={{ padding:'12px 16px', borderTop:`1px solid ${CLT}`, flexShrink:0 }}>
          {/* Voucher & Member */}
          {!paying && (
            <div style={{ marginBottom:10 }}>
              <div style={{ display:'flex', gap:6, marginBottom:6 }}>
                <div style={{ position:'relative', flex:1 }}>
                  <Tag size={12} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }}/>
                  <input value={voucher} onChange={e => setVoucher(e.target.value)} placeholder="Kode voucher"
                    style={{ width:'100%', padding:'7px 8px 7px 26px', borderRadius:8, border:`1.5px solid ${CLT}`, outline:'none', fontSize:12, boxSizing:'border-box' }}/>
                </div>
                <button onClick={applyVoucher} disabled={!voucher} style={{ padding:'7px 10px', borderRadius:8, border:'none', backgroundColor: voucher ? C : '#E5E7EB', color: voucher ? '#fff' : '#9CA3AF', fontSize:12, fontWeight:600, cursor: voucher ? 'pointer' : 'not-allowed' }}>Pakai</button>
              </div>
              <div style={{ position:'relative' }}>
                <Users size={12} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }}/>
                <input value={member} onChange={e => setMember(e.target.value)} placeholder="Cari member pelanggan…"
                  style={{ width:'100%', padding:'7px 8px 7px 26px', borderRadius:8, border:`1.5px solid ${CLT}`, outline:'none', fontSize:12, boxSizing:'border-box' }}/>
              </div>
            </div>
          )}

          {/* Totals */}
          <div style={{ marginBottom:12 }}>
            {[
              { label:'Subtotal', value:subtotal },
              ...(discount > 0 ? [{ label:`Diskon (${voucher})`, value:-discount }] : []),
              { label:'PPN 11%', value:tax },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:12, color:'#6B7280' }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:600, color: row.value < 0 ? '#16A34A' : '#374151' }}>
                  {row.value < 0 ? '-' : ''}Rp {Math.abs(row.value).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, borderTop:`1px solid ${CLT}`, marginTop:4 }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#064E3B' }}>TOTAL</span>
              <span style={{ fontSize:20, fontWeight:800, color:'#064E3B' }}>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {!paying ? (
            <button onClick={() => setPaying(true)} disabled={cart.length===0}
              style={{ width:'100%', padding:'13px', borderRadius:14, border:'none', background: cart.length===0 ? '#E5E7EB' : `linear-gradient(135deg,#047857,${C})`, color: cart.length===0 ? '#9CA3AF' : '#fff', fontSize:14, fontWeight:700, cursor: cart.length===0 ? 'not-allowed' : 'pointer', boxShadow: cart.length>0 ? `0 6px 20px ${C}40` : 'none' }}>
              💰 Bayar Sekarang
            </button>
          ) : (
            <div>
              {/* Payment method */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
                {PAY_METHODS.map(m => (
                  <button key={m.key} onClick={() => setPayMethod(m.key)}
                    style={{ padding:'8px 6px', borderRadius:10, border:`2px solid ${payMethod===m.key ? C : CLT}`, backgroundColor: payMethod===m.key ? `${C}12` : '#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontSize:12, fontWeight:600, color: payMethod===m.key ? C : '#6B7280' }}>
                    <m.icon size={13}/> {m.label}
                  </button>
                ))}
              </div>
              {payMethod==='cash' && (
                <div style={{ marginBottom:10 }}>
                  <input type="number" placeholder="Nominal uang diterima…" value={cashInput} onChange={e => setCashInput(e.target.value)}
                    style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:`1.5px solid ${CLT}`, outline:'none', fontSize:13, fontWeight:600, boxSizing:'border-box', marginBottom:6 }}/>
                  {parseInt(cashInput||'0') >= total && (
                    <p style={{ fontSize:13, color:'#047857', fontWeight:700, margin:0, padding:'8px 12px', backgroundColor:CLT, borderRadius:8 }}>
                      Kembalian: Rp {kembalian.toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <button onClick={() => { setPaying(false); setCashInput(''); }} style={{ padding:'11px', borderRadius:12, border:`1.5px solid #E5E7EB`, background:'#fff', color:'#6B7280', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><X size={14}/> Batal</button>
                <button onClick={handleCheckout}
                  disabled={payMethod==='cash' && parseInt(cashInput||'0') < total}
                  style={{ padding:'11px', borderRadius:12, border:'none', background:`linear-gradient(135deg,#047857,${C})`, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', opacity: payMethod==='cash' && parseInt(cashInput||'0') < total ? .5 : 1 }}>
                  ✓ Konfirmasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

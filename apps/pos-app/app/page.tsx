'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/useAuthStore';
import api from '../lib/api';
import {
  Monitor, ShoppingCart, Plus, Minus, Trash2, CreditCard,
  Banknote, Bell, LogOut, Search, Package, RefreshCw, X,
} from 'lucide-react';

const APP_COLOR = '#E64A19';

interface Product { id: number; name: string; price: number; emoji: string; category: string; }
interface CartItem extends Product { qty: number; }

const DEMO_PRODUCTS: Product[] = [
  { id:1, name:'Semen Portland 40kg', price:50000, emoji:'🏗️', category:'Material' },
  { id:2, name:'Cat Tembok 5L', price:55000, emoji:'🎨', category:'Cat' },
  { id:3, name:'Pipa PVC 4"', price:25000, emoji:'🚰', category:'Plumbing' },
  { id:4, name:'Besi Beton 10mm', price:50000, emoji:'⚙️', category:'Besi' },
  { id:5, name:'Keramik 60x60', price:40000, emoji:'🪟', category:'Keramik' },
  { id:6, name:'Triplek 9mm', price:85000, emoji:'🌲', category:'Kayu' },
  { id:7, name:'Kabel NYM 2x1.5', price:15000, emoji:'⚡', category:'Listrik' },
  { id:8, name:'Genteng Beton', price:8000, emoji:'🏠', category:'Atap' },
  { id:9, name:'Lem Kayu Super', price:12000, emoji:'🔧', category:'Aksesori' },
  { id:10, name:'Bata Merah', price:1500, emoji:'🧱', category:'Material' },
  { id:11, name:'Pasir Halus /kg', price:2000, emoji:'⬛', category:'Material' },
  { id:12, name:'Plamir Tembok', price:35000, emoji:'🪣', category:'Cat' },
];

export default function POSPage() {
  const { token, user, loadProfile, logout } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cashInput, setCashInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      if (!user) await loadProfile().catch(() => { logout(); router.replace('/login'); });
      try {
        const res = await api.get('/pos/products');
        if (res.data?.length) setProducts(res.data);
      } catch { /* use demo */ }
      setLoading(false);
      setTimeout(() => setMounted(true), 60);
    };
    init();
  }, [token]);

  if (!token || loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#FFF7ED' }}>
      <svg style={{ width:28, height:28, animation:'spin .8s linear infinite', color:APP_COLOR }} viewBox="0 0 24 24" fill="none">
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <circle opacity=".2" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path opacity=".8" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
      </svg>
    </div>
  );

  const addToCart = (p: Product) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      return ex ? prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...p, qty:1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const kembalian = paymentMethod === 'cash' ? (parseInt(cashInput || '0') - total) : 0;
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await api.post('/pos/transactions', {
        items: cart.map(c => ({ productId: c.id, qty: c.qty, price: c.price })),
        total, paymentMethod, cashInput: parseInt(cashInput || '0'),
      });
    } catch { /* offline mode */ }
    setCart([]);
    setCashInput('');
    setPaying(false);
    alert(`✅ Transaksi berhasil! Total: Rp ${total.toLocaleString('id-ID')}`);
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', backgroundColor:'#FFF7ED', opacity: mounted ? 1 : 0, transition:'opacity .4s' }}>
      {/* LEFT: Products */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <header style={{ height:56, backgroundColor:'#fff', borderBottom:'1px solid #FED7AA', display:'flex', alignItems:'center', padding:'0 16px', gap:12, flexShrink:0 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${APP_COLOR},#FB923C)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>
            <Monitor size={14} />
          </div>
          <span style={{ fontSize:14, fontWeight:700, color:APP_COLOR, flex:1 }}>POS Kasir — {user?.name}</span>
          <div style={{ position:'relative', flex:1, maxWidth:280 }}>
            <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk…"
              style={{ width:'100%', padding:'7px 12px 7px 32px', borderRadius:10, border:'1.5px solid #FED7AA', outline:'none', fontSize:13, backgroundColor:'#FAFAFA', boxSizing:'border-box' }} />
          </div>
          <button style={{ padding:8, border:'none', background:'none', cursor:'pointer', color:'#9CA3AF' }}><Bell size={18} /></button>
          <button onClick={() => { logout(); router.replace('/login'); }} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 10px', border:'none', borderRadius:8, backgroundColor:'#FEF2F2', color:'#DC2626', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            <LogOut size={12} /> Tutup Kasir
          </button>
        </header>

        <div style={{ flex:1, overflowY:'auto', padding:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10 }}>
            {filtered.map(p => (
              <button key={p.id} onClick={() => addToCart(p)}
                style={{ padding:'14px 12px', borderRadius:14, backgroundColor:'#fff', border:'1.5px solid #FED7AA', cursor:'pointer', textAlign:'left', transition:'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = APP_COLOR; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${APP_COLOR}20`; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#FED7AA'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
              >
                <p style={{ fontSize:24, margin:'0 0 6px' }}>{p.emoji}</p>
                <p style={{ fontSize:11.5, fontWeight:600, color:'#1E1B4B', margin:'0 0 4px', lineHeight:1.3 }}>{p.name}</p>
                <p style={{ fontSize:12, fontWeight:700, color:APP_COLOR, margin:0 }}>Rp {p.price.toLocaleString('id-ID')}</p>
                <p style={{ fontSize:10, color:'#9CA3AF', margin:'2px 0 0' }}>{p.category}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div style={{ width:340, flexShrink:0, backgroundColor:'#fff', borderLeft:'1px solid #FED7AA', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px 16px 12px', borderBottom:'1px solid #FEF3C7', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#7C2D12', margin:0, display:'flex', alignItems:'center', gap:8 }}>
              <ShoppingCart size={16} style={{ color:APP_COLOR }} /> Keranjang
            </h3>
            {cart.length > 0 && <button onClick={() => setCart([])} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#DC2626', border:'none', background:'none', cursor:'pointer', fontWeight:600 }}><RefreshCw size={12} /> Kosongkan</button>}
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'8px 16px' }}>
          {cart.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12, opacity:.5 }}>
              <Package size={40} style={{ color:'#FED7AA' }} />
              <p style={{ fontSize:13, color:'#9CA3AF', margin:0 }}>Keranjang masih kosong</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #FEF3C7' }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{item.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12.5, fontWeight:600, color:'#1E1B4B', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</p>
                <p style={{ fontSize:12, color:APP_COLOR, fontWeight:700, margin:0 }}>Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                <button onClick={() => updateQty(item.id, -1)} style={{ width:24, height:24, borderRadius:6, border:'1px solid #FED7AA', background:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#9CA3AF' }}><Minus size={12} /></button>
                <span style={{ fontSize:13, fontWeight:700, color:'#1E1B4B', minWidth:20, textAlign:'center' }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} style={{ width:24, height:24, borderRadius:6, border:'none', backgroundColor:APP_COLOR, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><Plus size={12} /></button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding:'14px 16px', borderTop:'1px solid #FED7AA', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <span style={{ fontSize:14, fontWeight:600, color:'#374151' }}>Total</span>
            <span style={{ fontSize:20, fontWeight:800, color:'#7C2D12' }}>Rp {total.toLocaleString('id-ID')}</span>
          </div>

          {!paying ? (
            <button onClick={() => setPaying(true)} disabled={cart.length === 0}
              style={{ width:'100%', padding:'13px', borderRadius:14, border:'none', background: cart.length === 0 ? '#E5E7EB' : `linear-gradient(135deg,${APP_COLOR},#FB923C)`, color: cart.length === 0 ? '#9CA3AF' : '#fff', fontSize:14, fontWeight:700, cursor: cart.length === 0 ? 'not-allowed' : 'pointer', boxShadow: cart.length === 0 ? 'none' : `0 6px 20px ${APP_COLOR}40`, transition:'all .2s' }}>
              Proses Pembayaran
            </button>
          ) : (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                {(['cash', 'card'] as const).map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    style={{ padding:'10px', borderRadius:12, border:`2px solid ${paymentMethod === m ? APP_COLOR : '#FED7AA'}`, backgroundColor: paymentMethod === m ? `${APP_COLOR}15` : '#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:13, fontWeight:600, color: paymentMethod === m ? APP_COLOR : '#6B7280' }}>
                    {m === 'cash' ? <><Banknote size={15} /> Tunai</> : <><CreditCard size={15} /> Kartu</>}
                  </button>
                ))}
              </div>
              {paymentMethod === 'cash' && (
                <div style={{ marginBottom:12 }}>
                  <input type="number" placeholder="Uang diterima…" value={cashInput} onChange={e => setCashInput(e.target.value)}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #FED7AA', outline:'none', fontSize:14, fontWeight:600, boxSizing:'border-box', marginBottom:8 }} />
                  {parseInt(cashInput||'0') >= total && <p style={{ fontSize:13, color:'#16A34A', fontWeight:700, margin:0 }}>Kembalian: Rp {kembalian.toLocaleString('id-ID')}</p>}
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <button onClick={() => { setPaying(false); setCashInput(''); }} style={{ padding:'11px', borderRadius:12, border:'1.5px solid #E5E7EB', background:'#fff', color:'#6B7280', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><X size={14} /> Batal</button>
                <button onClick={handleCheckout} disabled={paymentMethod === 'cash' && parseInt(cashInput||'0') < total}
                  style={{ padding:'11px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${APP_COLOR},#FB923C)`, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', opacity: paymentMethod === 'cash' && parseInt(cashInput||'0') < total ? .5 : 1 }}>
                  ✓ Bayar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

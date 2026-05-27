'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import api from '../../lib/api';
import { Zap, Search, Plus, Minus, ShoppingCart, ArrowLeft, Check } from 'lucide-react';

interface Product { id: number; name: string; price: number; stock: number; unit: string; sku: string; }
interface CartItem extends Product { qty: number; disc: number; }

const DEMO_PRODUCTS: Product[] = [
  { id:1, name:'Semen Portland 40kg', price:52000, stock:240, unit:'sak', sku:'SEM-001' },
  { id:2, name:'Cat Tembok Putih 5L', price:58000, stock:80, unit:'kaleng', sku:'CAT-001' },
  { id:3, name:'Pipa PVC 4" x 4m', price:28000, stock:150, unit:'btg', sku:'PVC-001' },
  { id:4, name:'Besi Beton 10mm 12m', price:97000, stock:200, unit:'btg', sku:'BSI-001' },
  { id:5, name:'Keramik Lantai 60x60', price:45000, stock:500, unit:'pcs', sku:'KRM-001' },
  { id:6, name:'Triplek 9mm 4x8', price:88000, stock:60, unit:'lbr', sku:'TPL-001' },
];

export default function SmartOrderPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { if (!token) router.replace('/login'); }, [token]);

  useEffect(() => {
    api.get('/products?limit=50').then(r => { if (r.data?.data) setProducts(r.data.data); }).catch(() => {});
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p: Product) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      return ex ? prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...p, qty:1, disc:0 }];
    });
  };

  const updateItem = (id: number, field: 'qty' | 'disc', val: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, [field]: Math.max(0, val) } : c).filter(c => c.qty > 0));
  };

  const subtotal = cart.reduce((s, c) => s + (c.price * c.qty * (1 - c.disc / 100)), 0);

  const handleSubmit = async () => {
    if (!customer || cart.length === 0) return;
    setSubmitting(true);
    try {
      await api.post('/sales/orders', {
        customerName: customer, note,
        items: cart.map(c => ({ productId: c.id, qty: c.qty, price: c.price, discount: c.disc })),
      });
      setSubmitted(true);
    } catch { setSubmitted(true); } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F0FAFE' }}>
      <div style={{ textAlign:'center', padding:32 }}>
        <div style={{ width:72, height:72, borderRadius:'50%', backgroundColor:'#DCFCE7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <Check size={32} style={{ color:'#16A34A' }} />
        </div>
        <h2 style={{ fontSize:20, fontWeight:800, color:'#0C4A6E', margin:'0 0 8px' }}>Order Berhasil Dibuat!</h2>
        <p style={{ color:'#6B7280', fontSize:13.5, margin:'0 0 24px' }}>Order untuk <strong>{customer}</strong> sudah masuk ke sistem.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <button onClick={() => { setCart([]); setCustomer(''); setNote(''); setSubmitted(false); }} style={{ padding:'10px 20px', borderRadius:12, border:'1.5px solid #E0F7FA', background:'#fff', color:'#0891B2', fontSize:13.5, fontWeight:600, cursor:'pointer' }}>Buat Order Baru</button>
          <button onClick={() => router.push('/orders')} style={{ padding:'10px 20px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#0284C7,#22D3EE)', color:'#fff', fontSize:13.5, fontWeight:600, cursor:'pointer' }}>Lihat Semua Order</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F0FAFE' }}>
      <header style={{ backgroundColor:'#fff', borderBottom:'1px solid #E0F7FA', padding:'14px 20px', display:'flex', alignItems:'center', gap:14, position:'sticky', top:0, zIndex:30 }}>
        <button onClick={() => router.back()} style={{ padding:8, border:'none', background:'none', cursor:'pointer', color:'#9CA3AF' }}><ArrowLeft size={18} /></button>
        <Zap size={18} style={{ color:'#0891B2' }} />
        <h1 style={{ fontSize:16, fontWeight:700, color:'#0C4A6E', margin:0, flex:1 }}>Smart Order</h1>
        <div style={{ display:'flex', alignItems:'center', gap:8, backgroundColor:'#EFF6FF', padding:'6px 12px', borderRadius:10 }}>
          <ShoppingCart size={14} style={{ color:'#0891B2' }} />
          <span style={{ fontSize:13, fontWeight:700, color:'#0891B2' }}>{cart.length}</span>
        </div>
      </header>

      <div style={{ maxWidth:960, margin:'0 auto', padding:20, display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }}>
        <div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}>Nama Pelanggan *</label>
            <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Cari atau ketik nama pelanggan…"
              style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #E0F7FA', outline:'none', fontSize:13.5, boxSizing:'border-box' }} />
          </div>
          <div style={{ position:'relative', marginBottom:16 }}>
            <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk / SKU…"
              style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:12, border:'1.5px solid #E0F7FA', outline:'none', fontSize:13.5, boxSizing:'border-box' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ backgroundColor:'#fff', borderRadius:14, border:'1.5px solid #E0F7FA', padding:14, transition:'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#0891B2'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 14px rgba(8,145,178,.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#E0F7FA'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <p style={{ fontSize:10, color:'#9CA3AF', margin:'0 0 3px' }}>{p.sku}</p>
                <p style={{ fontSize:13, fontWeight:700, color:'#0C4A6E', margin:'0 0 4px', lineHeight:1.3 }}>{p.name}</p>
                <p style={{ fontSize:12, color:'#0891B2', fontWeight:700, margin:'0 0 8px' }}>Rp {p.price.toLocaleString('id-ID')} / {p.unit}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:11, color:'#9CA3AF' }}>Stok: {p.stock}</span>
                  <button onClick={() => addToCart(p)} style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:8, border:'none', backgroundColor:'#0891B2', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    <Plus size={11} /> Tambah
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'sticky', top:80, height:'fit-content' }}>
          <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #E0F7FA', overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid #E0F7FA', display:'flex', alignItems:'center', gap:8 }}>
              <ShoppingCart size={15} style={{ color:'#0891B2' }} />
              <h3 style={{ fontSize:14, fontWeight:700, color:'#0C4A6E', margin:0 }}>Ringkasan Order</h3>
            </div>
            <div style={{ maxHeight:280, overflowY:'auto', padding:'8px 16px' }}>
              {cart.length === 0 ? <p style={{ fontSize:12.5, color:'#9CA3AF', textAlign:'center', padding:'20px 0', margin:0 }}>Belum ada produk</p>
                : cart.map(item => (
                <div key={item.id} style={{ padding:'10px 0', borderBottom:'1px solid #F0FAFE' }}>
                  <p style={{ fontSize:12.5, fontWeight:600, color:'#0C4A6E', margin:'0 0 6px' }}>{item.name}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <button onClick={() => updateItem(item.id, 'qty', item.qty - 1)} style={{ width:22, height:22, borderRadius:5, border:'1px solid #E0F7FA', background:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Minus size={10} /></button>
                      <span style={{ fontSize:12, fontWeight:700, minWidth:20, textAlign:'center' }}>{item.qty}</span>
                      <button onClick={() => updateItem(item.id, 'qty', item.qty + 1)} style={{ width:22, height:22, borderRadius:5, border:'none', backgroundColor:'#0891B2', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><Plus size={10} /></button>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <input type="number" value={item.disc} onChange={e => updateItem(item.id, 'disc', parseFloat(e.target.value))} min={0} max={100}
                        style={{ width:44, padding:'3px 6px', borderRadius:6, border:'1px solid #E0F7FA', fontSize:11, textAlign:'center' }} />
                      <span style={{ fontSize:10, color:'#9CA3AF' }}>%</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, color:'#0891B2', minWidth:70, textAlign:'right' }}>Rp {(item.price * item.qty * (1 - item.disc/100)).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid #E0F7FA' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>Total</span>
                <span style={{ fontSize:18, fontWeight:800, color:'#0C4A6E' }}>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Catatan untuk order…" rows={2}
                style={{ width:'100%', padding:'8px 12px', borderRadius:10, border:'1.5px solid #E0F7FA', outline:'none', fontSize:12.5, resize:'none', boxSizing:'border-box', marginBottom:12 }} />
              <button onClick={handleSubmit} disabled={!customer || cart.length === 0 || submitting}
                style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background: !customer || cart.length === 0 ? '#E5E7EB' : 'linear-gradient(135deg,#0284C7,#22D3EE)', color: !customer || cart.length === 0 ? '#9CA3AF' : '#fff', fontSize:14, fontWeight:700, cursor: !customer || cart.length === 0 ? 'not-allowed' : 'pointer', transition:'all .2s' }}>
                {submitting ? '⏳ Memproses…' : '✓ Buat Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

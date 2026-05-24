'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { SETTINGS_CONFIG, SETTINGS_NAV } from '../../../lib/nav-configs';
import { Bot, Send, Sparkles } from 'lucide-react';

const INITIAL_MESSAGES = [
  { role: 'bot', text: 'Halo! Saya asisten AI ERP Gentong Mas. Saya dapat membantu Anda dengan pertanyaan seputar penjualan, stok, keuangan, dan operasional. Apa yang ingin Anda tanyakan?' },
];

const QUICK_PROMPTS = [
  'Berapa total revenue bulan ini?',
  'Produk apa yang stoknya hampir habis?',
  'Tampilkan 5 pelanggan terbesar',
  'Ringkasan pembelian minggu ini',
];

export default function AiChatbotPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  useEffect(() => { if (!token) router.push('/login'); }, [token]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text },
      { role: 'bot', text: `Saya menerima pertanyaan Anda: "${text}". Fitur AI chatbot sedang dalam pengembangan dan akan segera tersedia. Terima kasih atas kesabaran Anda!` }
    ]);
    setInput('');
  };

  if (!token) return null;

  return (
    <AppShell {...SETTINGS_CONFIG} navItems={SETTINGS_NAV} activeHref="/ai/chatbot">
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(113,75,103,.12)' }}>
            <Bot className="h-5 w-5" style={{ color: '#714B67' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>AI Chatbot ERP</h1>
            <p className="text-sm" style={{ color: '#A5A3AE' }}>Tanyakan apa saja tentang bisnis Anda</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(113,75,103,.1)', color: '#714B67' }}>
            <Sparkles className="h-3.5 w-3.5" /> GPT-4 Powered
          </span>
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_PROMPTS.map((q) => (
            <button key={q} onClick={() => send(q)} className="px-3 py-1.5 rounded-full text-xs font-medium transition"
              style={{ border: '1.5px solid #EDE8F5', color: '#714B67', backgroundColor: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5F2FB'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
              {q}
            </button>
          ))}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 bg-white rounded-2xl p-4" style={{ border: '1.5px solid #EDE8F5' }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'bot' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(113,75,103,.12)' }}>
                  <Bot className="h-4 w-4" style={{ color: '#714B67' }} />
                </div>
              )}
              <div className="max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm" style={{
                backgroundColor: m.role === 'user' ? '#714B67' : '#F5F2FB',
                color: m.role === 'user' ? 'white' : '#433C50',
                borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: m.role === 'bot' ? 4 : 16,
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl px-4 py-3 text-sm"
            style={{ border: '1.5px solid #EDE8F5', color: '#433C50', outline: 'none' }}
            placeholder="Ketik pertanyaan Anda..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(input); }}
            onFocus={e => { e.target.style.borderColor = '#714B67'; }}
            onBlur={e => { e.target.style.borderColor = '#EDE8F5'; }}
          />
          <button onClick={() => send(input)} className="flex items-center justify-center h-11 w-11 rounded-xl text-white transition"
            style={{ backgroundColor: '#714B67' }}>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

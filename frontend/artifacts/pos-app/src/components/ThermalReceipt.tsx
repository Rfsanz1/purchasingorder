import { Printer, X } from 'lucide-react'
import { formatDateTime } from '../utils/format'

export interface ReceiptData {
  invoice_number: string
  created_at: string
  cashier_name: string
  customer_name?: string | null
  customer_phone?: string | null
  items: Array<{
    product_name: string
    product_sku?: string
    qty: number
    unit_name?: string
    unit_price: number
    discount_pct?: number
    discount_amount?: number
    subtotal: number
  }>
  subtotal: number
  discount_amount: number
  discount_pct?: number
  tax_amount: number
  tax_pct?: number
  grand_total: number
  payments: Array<{ method: string; amount: number }>
  paid_amount: number
  change_amount: number
  notes?: string | null
}

const STORE_NAME = 'TOKO BANGUNAN'
const STORE_TAGLINE = 'Solusi Material Terpercaya'
const STORE_PHONE = '(021) 000-0000'
const STORE_ADDRESS = 'Jl. Raya Toko No. 1, Jakarta'

const PAY_LABEL: Record<string, string> = {
  cash: 'Tunai',
  transfer: 'Transfer Bank',
  qris: 'QRIS',
  tempo: 'Tempo/Kredit',
}

function rupiah(n: number | string) {
  const num = typeof n === 'string' ? parseFloat(n) : n
  return 'Rp ' + (isNaN(num) ? '0' : num.toLocaleString('id-ID'))
}

function line(char = '-', len = 48) {
  return char.repeat(len)
}

function padBoth(left: string, right: string, total = 48) {
  const spaces = total - left.length - right.length
  return left + ' '.repeat(Math.max(1, spaces)) + right
}

function center(text: string, total = 48) {
  const pad = Math.max(0, Math.floor((total - text.length) / 2))
  return ' '.repeat(pad) + text
}

export function buildReceiptHtml(data: ReceiptData): string {
  const now = formatDateTime(data.created_at)
  const lines: string[] = []
  const push = (s: string) => lines.push(s)

  push(center(STORE_NAME))
  push(center(STORE_TAGLINE))
  push(center(STORE_PHONE))
  push(center(STORE_ADDRESS))
  push(line())
  push(`No : ${data.invoice_number}`)
  push(`Tgl: ${now}`)
  push(`Kasir: ${data.cashier_name}`)
  if (data.customer_name) push(`Customer: ${data.customer_name}`)
  push(line())
  push(center('DETAIL PEMBELIAN'))
  push(line())

  for (const item of data.items) {
    const name = item.product_name.length > 32
      ? item.product_name.substring(0, 31) + '…'
      : item.product_name
    push(name)
    const unit = item.unit_name ? ` ${item.unit_name}` : ''
    const qty = `${item.qty}${unit} x ${rupiah(item.unit_price)}`
    const sub = rupiah(item.subtotal)
    push(padBoth('  ' + qty, sub))
    if (item.discount_pct && item.discount_pct > 0 && item.discount_amount) {
      push(`  Diskon ${item.discount_pct}%: -${rupiah(item.discount_amount)}`)
    }
  }

  push(line())
  push(padBoth('Subtotal', rupiah(data.subtotal)))
  if (data.discount_amount > 0) {
    const dLabel = data.discount_pct ? `Diskon (${data.discount_pct}%)` : 'Diskon'
    push(padBoth(dLabel, `-${rupiah(data.discount_amount)}`))
  }
  if (data.tax_amount > 0) {
    const tLabel = data.tax_pct ? `Pajak (${data.tax_pct}%)` : 'Pajak'
    push(padBoth(tLabel, rupiah(data.tax_amount)))
  }
  push(line('='))
  push(padBoth('TOTAL', rupiah(data.grand_total)))
  push(line('='))

  for (const p of data.payments) {
    push(padBoth(PAY_LABEL[p.method] ?? p.method, rupiah(p.amount)))
  }
  if (data.change_amount > 0) {
    push(padBoth('Kembalian', rupiah(data.change_amount)))
  }

  if (data.notes) {
    push(line())
    push(`Catatan: ${data.notes}`)
  }

  push(line())
  push(center('Terima kasih atas kunjungan Anda!'))
  push(center('Barang yang sudah dibeli'))
  push(center('tidak dapat dikembalikan.'))
  push(line())
  push(center('*** SIMPAN STRUK INI ***'))

  return lines.join('\n')
}

export function printThermalReceipt(data: ReceiptData) {
  const text = buildReceiptHtml(data)
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Struk ${data.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #000;
    background: #fff;
    width: 302px;
    padding: 8px 4px;
  }
  pre {
    white-space: pre-wrap;
    word-break: break-all;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
  @media print {
    @page { margin: 0; size: 80mm auto; }
    body { width: 100%; padding: 2mm; }
  }
</style>
</head>
<body>
<pre>${escaped}</pre>
</body>
</html>`

  const w = window.open('', '_blank', 'width=360,height=700,toolbar=0,scrollbars=1')
  if (!w) {
    alert('Popup diblokir browser. Izinkan popup untuk mencetak struk.')
    return
  }
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => {
    w.print()
  }, 400)
}

interface Props {
  data: ReceiptData
  onClose: () => void
}

export default function ThermalReceipt({ data, onClose }: Props) {
  const text = buildReceiptHtml(data)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-sm flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-primary-600" />
            <span className="text-sm font-bold text-gray-900">Struk Pembayaran</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div
            className="mx-auto rounded-lg bg-white shadow-inner border border-dashed border-gray-300"
            style={{ width: '302px', padding: '12px 8px' }}
          >
            <pre
              className="whitespace-pre-wrap break-all text-black"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '11px',
                lineHeight: '1.55',
              }}
            >
              {text}
            </pre>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 px-5 py-4">
          <button onClick={onClose} className="btn-secondary flex-1 btn-sm">
            Tutup
          </button>
          <button
            onClick={() => printThermalReceipt(data)}
            className="btn-primary flex-1 btn-sm"
          >
            <Printer size={15} />
            Cetak Struk
          </button>
        </div>
      </div>
    </div>
  )
}

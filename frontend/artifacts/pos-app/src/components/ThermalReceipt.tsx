import { Printer, X } from 'lucide-react'

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

const STORE_NAME = 'TOKO BANGUNAN GENTONG MAS'
const STORE_ADDRESS = 'Jl. Raya Toko No. 1, Jakarta'
const STORE_PHONE = '(021) 000-0000'

const PAY_LABEL: Record<string, string> = {
  cash: 'Tunai',
  transfer: 'Transfer Bank',
  qris: 'QRIS',
  tempo: 'Tempo/Kredit',
}

function rupiah(n: number | string) {
  const num = typeof n === 'string' ? parseFloat(n) : n
  if (isNaN(num)) return 'Rp 0'
  return 'Rp ' + num.toLocaleString('id-ID')
}

function formatTgl(iso: string) {
  try {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return iso
  }
}

function buildReceiptHtml(data: ReceiptData): string {
  const tgl = formatTgl(data.created_at)
  const customerLine = data.customer_name
    ? `<tr><td>Pelanggan</td><td>:</td><td><b>${data.customer_name}</b>${data.customer_phone ? ' / ' + data.customer_phone : ''}</td></tr>`
    : ''

  const itemRows = data.items.map((item) => {
    const name = item.product_name
    const unit = item.unit_name ? ` ${item.unit_name}` : ''
    const qtyPrice = `${item.qty}${unit} × ${rupiah(item.unit_price)}`
    const discRow = item.discount_pct && item.discount_pct > 0 && item.discount_amount
      ? `<tr class="disc-row"><td colspan="2" style="padding-left:8px;font-size:10px;color:#555">Diskon ${item.discount_pct}%</td><td style="text-align:right;font-size:10px;color:#555">-${rupiah(item.discount_amount)}</td></tr>`
      : ''
    return `
      <tr class="item-name-row"><td colspan="3"><b>${name}</b></td></tr>
      <tr class="item-price-row">
        <td colspan="2" style="padding-left:8px;color:#444">${qtyPrice}</td>
        <td style="text-align:right;font-weight:600">${rupiah(item.subtotal)}</td>
      </tr>
      ${discRow}`
  }).join('')

  const discountRow = data.discount_amount > 0
    ? `<tr><td colspan="2">${data.discount_pct ? `Diskon (${data.discount_pct}%)` : 'Diskon'}</td><td style="text-align:right;color:#c00">-${rupiah(data.discount_amount)}</td></tr>`
    : ''
  const taxRow = data.tax_amount > 0
    ? `<tr><td colspan="2">${data.tax_pct ? `Pajak (${data.tax_pct}%)` : 'Pajak'}</td><td style="text-align:right">${rupiah(data.tax_amount)}</td></tr>`
    : ''

  const paymentRows = data.payments.map((p) =>
    `<tr><td colspan="2">${PAY_LABEL[p.method] ?? p.method}</td><td style="text-align:right">${rupiah(p.amount)}</td></tr>`
  ).join('')

  const changeRow = data.change_amount > 0
    ? `<tr><td colspan="2">Kembalian</td><td style="text-align:right;color:#080">${rupiah(data.change_amount)}</td></tr>`
    : ''

  const notesRow = data.notes
    ? `<div class="notes">Catatan: ${data.notes}</div>`
    : ''

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Nota ${data.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    line-height: 1.45;
    color: #000;
    background: #fff;
    width: 302px;
    padding: 6px 4px 16px;
  }

  .header {
    text-align: center;
    margin-bottom: 6px;
  }
  .header .store-name {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .header .store-sub {
    font-size: 10px;
    color: #444;
    margin-top: 1px;
  }

  .divider {
    border: none;
    border-top: 1px dashed #000;
    margin: 5px 0;
  }
  .divider-solid {
    border: none;
    border-top: 1px solid #000;
    margin: 5px 0;
  }
  .divider-double {
    border: none;
    border-top: 3px double #000;
    margin: 5px 0;
  }

  .meta-table {
    width: 100%;
    font-size: 11px;
    border-collapse: collapse;
  }
  .meta-table td { padding: 1px 2px; vertical-align: top; }
  .meta-table td:nth-child(2) { padding: 1px 4px; white-space: nowrap; }

  .section-title {
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    margin: 4px 0 2px;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5px;
  }
  .items-table td { padding: 1.5px 2px; vertical-align: top; }
  .item-name-row td { padding-top: 4px; }
  .item-price-row td { padding-bottom: 2px; }

  .summary-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5px;
  }
  .summary-table td { padding: 1.5px 2px; vertical-align: middle; }
  .summary-table td:last-child { text-align: right; white-space: nowrap; }

  .total-row td {
    font-size: 13px;
    font-weight: 700;
    padding: 3px 2px;
  }

  .payment-section {
    margin-top: 2px;
  }
  .payment-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .notes {
    font-size: 10px;
    color: #555;
    margin-top: 4px;
    font-style: italic;
  }

  .footer {
    text-align: center;
    font-size: 10px;
    color: #333;
    margin-top: 8px;
    line-height: 1.6;
  }

  @media print {
    @page {
      margin: 0;
      size: 80mm auto;
    }
    body {
      width: 100%;
      padding: 3mm 2mm 10mm;
    }
  }
</style>
</head>
<body>

<div class="header">
  <div class="store-name">${STORE_NAME}</div>
  <div class="store-sub">${STORE_ADDRESS}</div>
  <div class="store-sub">Telp: ${STORE_PHONE}</div>
</div>

<hr class="divider">

<table class="meta-table">
  <tr><td>No. Nota</td><td>:</td><td><b>${data.invoice_number}</b></td></tr>
  <tr><td>Tanggal</td><td>:</td><td>${tgl}</td></tr>
  <tr><td>Kasir</td><td>:</td><td>${data.cashier_name}</td></tr>
  ${customerLine}
</table>

<hr class="divider">
<div class="section-title">DAFTAR BELANJA</div>
<hr class="divider">

<table class="items-table">
  ${itemRows}
</table>

<hr class="divider-solid">

<table class="summary-table">
  <tr><td colspan="2">Subtotal</td><td>${rupiah(data.subtotal)}</td></tr>
  ${discountRow}
  ${taxRow}
</table>

<hr class="divider-double">

<table class="summary-table">
  <tr class="total-row"><td colspan="2">TOTAL</td><td>${rupiah(data.grand_total)}</td></tr>
</table>

<hr class="divider-double">

<div class="payment-section">
  <div class="payment-label">PEMBAYARAN</div>
  <table class="summary-table">
    ${paymentRows}
    ${changeRow}
  </table>
</div>

${notesRow}

<hr class="divider">

<div class="footer">
  Terima kasih telah berbelanja!<br>
  Barang yang sudah dibeli<br>tidak dapat dikembalikan.<br>
  <b>*** SIMPAN NOTA INI ***</b>
</div>

</body>
</html>`
}

export function printThermalReceipt(data: ReceiptData) {
  const html = buildReceiptHtml(data)
  const w = window.open('', '_blank', 'width=380,height=760,toolbar=0,scrollbars=1,resizable=1')
  if (!w) {
    alert('Popup diblokir browser. Izinkan popup untuk mencetak struk.')
    return
  }
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 500)
}

interface Props {
  data: ReceiptData
  onClose: () => void
}

export default function ThermalReceipt({ data, onClose }: Props) {
  const html = buildReceiptHtml(data)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-xs flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <Printer size={17} className="text-primary-600" />
            <span className="text-sm font-bold text-gray-900">Preview Nota Termal</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>

        {/* Preview iframe — render HTML yang sama persis seperti print */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-3">
          <div className="mx-auto shadow-md" style={{ width: '302px', background: '#fff' }}>
            <iframe
              srcDoc={html}
              style={{
                width: '302px',
                border: 'none',
                display: 'block',
                minHeight: '400px',
              }}
              scrolling="no"
              onLoad={(e) => {
                const iframe = e.currentTarget
                try {
                  const body = iframe.contentDocument?.body
                  if (body) {
                    iframe.style.height = body.scrollHeight + 'px'
                  }
                } catch {}
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 px-5 py-3">
          <button onClick={onClose} className="btn-secondary flex-1 btn-sm">
            Tutup
          </button>
          <button onClick={() => printThermalReceipt(data)} className="btn-primary flex-1 btn-sm">
            <Printer size={14} />
            Cetak Nota
          </button>
        </div>
      </div>
    </div>
  )
}

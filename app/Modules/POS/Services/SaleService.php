<?php

namespace App\Modules\POS\Services;

use App\Models\Pos\PosSale;
use App\Models\Pos\PosSaleItem;
use App\Models\Pos\PosSalePayment;
use App\Models\Pos\PosReceivable;
use App\Modules\POS\Repositories\SaleRepository;
use App\Modules\POS\Repositories\InventoryRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SaleService
{
    public function __construct(
        private readonly SaleRepository $saleRepo,
        private readonly InventoryRepository $invRepo,
    ) {}

    public function list(array $filters, int $perPage = 20)
    {
        return $this->saleRepo->paginate($filters, $perPage);
    }

    public function find(int $id): ?PosSale
    {
        return $this->saleRepo->find($id);
    }

    public function createSale(array $data, int $cashierId): PosSale
    {
        return DB::transaction(function () use ($data, $cashierId) {
            $invoiceNumber = $this->saleRepo->getNextInvoiceNumber();

            $subtotal = collect($data['items'])->sum(fn($item) =>
                ($item['qty'] * $item['unit_price']) - ($item['discount_amount'] ?? 0)
            );
            $discountAmount = $data['discount_amount'] ?? 0;
            $taxAmount      = $data['tax_amount'] ?? 0;
            $grandTotal     = $subtotal - $discountAmount + $taxAmount + ($data['shipping_cost'] ?? 0);
            $paidAmount     = collect($data['payments'] ?? [])->sum('amount');

            $sale = $this->saleRepo->create([
                'invoice_number' => $invoiceNumber,
                'customer_id'    => $data['customer_id'] ?? null,
                'cashier_id'     => $cashierId,
                'warehouse_id'   => $data['warehouse_id'],
                'session_id'     => $data['session_id'] ?? null,
                'status'         => 'completed',
                'sale_type'      => $data['sale_type'] ?? 'pos',
                'subtotal'       => $subtotal,
                'discount_amount'=> $discountAmount,
                'discount_pct'   => $data['discount_pct'] ?? 0,
                'tax_amount'     => $taxAmount,
                'tax_pct'        => $data['tax_pct'] ?? 0,
                'shipping_cost'  => $data['shipping_cost'] ?? 0,
                'grand_total'    => $grandTotal,
                'paid_amount'    => $paidAmount,
                'change_amount'  => max(0, $paidAmount - $grandTotal),
                'payment_status' => $paidAmount >= $grandTotal ? 'paid' : ($paidAmount > 0 ? 'partial' : 'unpaid'),
                'notes'          => $data['notes'] ?? null,
                'customer_name'  => $data['customer_name'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $lineDiscount = $item['discount_amount'] ?? 0;
                $lineSubtotal = ($item['qty'] * $item['unit_price']) - $lineDiscount;

                PosSaleItem::create([
                    'sale_id'         => $sale->id,
                    'product_id'      => $item['product_id'],
                    'unit_id'         => $item['unit_id'],
                    'product_name'    => $item['product_name'],
                    'product_sku'     => $item['product_sku'] ?? '',
                    'qty'             => $item['qty'],
                    'unit_price'      => $item['unit_price'],
                    'cost_price'      => $item['cost_price'] ?? 0,
                    'discount_amount' => $lineDiscount,
                    'discount_pct'    => $item['discount_pct'] ?? 0,
                    'tax_amount'      => $item['tax_amount'] ?? 0,
                    'subtotal'        => $lineSubtotal,
                    'notes'           => $item['notes'] ?? null,
                ]);

                $this->deductStock($item, $data['warehouse_id'], $sale->id);
            }

            foreach ($data['payments'] ?? [] as $payment) {
                PosSalePayment::create([
                    'sale_id'   => $sale->id,
                    'method'    => $payment['method'],
                    'reference' => $payment['reference'] ?? null,
                    'amount'    => $payment['amount'],
                    'bank_name' => $payment['bank_name'] ?? null,
                    'paid_at'   => now(),
                ]);
            }

            if ($sale->payment_status !== 'paid' && $data['customer_id'] ?? null) {
                $remaining = $grandTotal - $paidAmount;
                PosReceivable::create([
                    'code'        => 'RCV-' . strtoupper(Str::random(8)),
                    'sale_id'     => $sale->id,
                    'customer_id' => $data['customer_id'],
                    'amount'      => $remaining,
                    'paid_amount' => 0,
                    'remaining'   => $remaining,
                    'due_date'    => now()->addDays($data['payment_term_days'] ?? 30),
                    'status'      => 'unpaid',
                ]);
            }

            return $this->saleRepo->find($sale->id);
        });
    }

    private function deductStock(array $item, int $warehouseId, int $saleId): void
    {
        $inv = $this->invRepo->getOrCreate($item['product_id'], $warehouseId);
        $before = (float) $inv->qty_on_hand;
        $this->invRepo->adjustStock($item['product_id'], $warehouseId, -$item['qty']);
        $this->invRepo->recordMovement([
            'product_id'     => $item['product_id'],
            'warehouse_id'   => $warehouseId,
            'unit_id'        => $item['unit_id'],
            'type'           => 'out',
            'reference_type' => 'sale',
            'reference_id'   => $saleId,
            'qty'            => $item['qty'],
            'qty_before'     => $before,
            'qty_after'      => max(0, $before - $item['qty']),
            'cost_price'     => $item['cost_price'] ?? 0,
        ]);
    }

    public function cancelSale(int $id): PosSale
    {
        return DB::transaction(function () use ($id) {
            $sale = $this->saleRepo->find($id);
            $sale->update(['status' => 'cancelled']);

            foreach ($sale->items as $item) {
                $inv    = $this->invRepo->getOrCreate($item->product_id, $sale->warehouse_id);
                $before = (float) $inv->qty_on_hand;
                $this->invRepo->adjustStock($item->product_id, $sale->warehouse_id, $item->qty);
                $this->invRepo->recordMovement([
                    'product_id'     => $item->product_id,
                    'warehouse_id'   => $sale->warehouse_id,
                    'unit_id'        => $item->unit_id,
                    'type'           => 'return_in',
                    'reference_type' => 'sale',
                    'reference_id'   => $sale->id,
                    'qty'            => $item->qty,
                    'qty_before'     => $before,
                    'qty_after'      => $before + $item->qty,
                    'cost_price'     => $item->cost_price,
                ]);
            }

            return $this->saleRepo->find($sale->id);
        });
    }
}

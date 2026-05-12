<?php

namespace App\Observers;

use App\Models\ErpPurchaseOrder;
use App\Models\Product;
use App\Models\ErpStockMovement;
use App\Models\ErpJournalEntry;
use App\Models\ErpJournalEntryLine;
use App\Models\ErpChartOfAccount;
use App\Models\ErpSupplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ErpPurchaseOrderObserver
{
    /**
     * Handle the ErpPurchaseOrder "created" event.
     * PURCHASE → INVENTORY: Tambah stok otomatis
     * PURCHASE → ACCOUNTING: Catat hutang supplier
     */
    public function created(ErpPurchaseOrder $purchaseOrder): void
    {
        DB::transaction(function () use ($purchaseOrder) {
            try {
                $items = $purchaseOrder->items ?? [];

                foreach ($items as $item) {
                    $productId = $item['product_id'] ?? null;
                    $quantity = (int) ($item['quantity'] ?? 0);
                    $unitPrice = (float) ($item['unit_price'] ?? 0);

                    if ($productId && $quantity > 0) {
                        $product = Product::find($productId);

                        if ($product) {
                            // Tambah stok
                            $product->increment('stok', $quantity);

                            // Update HPP (average cost)
                            $this->updateAverageCost($product, $quantity, $unitPrice);

                            // Catat stock movement
                            ErpStockMovement::create([
                                'product_id' => $product->id,
                                'movement_type' => 'in',
                                'quantity' => $quantity,
                                'reference_type' => 'purchase_order',
                                'reference_id' => $purchaseOrder->id,
                                'notes' => "Pembelian PO #{$purchaseOrder->po_number}",
                                'created_at' => now(),
                            ]);
                        }
                    }
                }

                // Catat hutang supplier
                if ($purchaseOrder->supplier_id) {
                    $supplier = ErpSupplier::find($purchaseOrder->supplier_id);
                    if ($supplier) {
                        $supplier->increment('hutang', $purchaseOrder->total_amount);
                    }
                }

                // Buat jurnal untuk pembelian
                $this->createPurchaseJournal($purchaseOrder);

                Log::info("Purchase Order {$purchaseOrder->po_number} processed: stock increased, supplier debt recorded");

            } catch (\Exception $e) {
                Log::error("Failed to process purchase order {$purchaseOrder->po_number}: " . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Handle the ErpPurchaseOrder "updated" event.
     */
    public function updated(ErpPurchaseOrder $purchaseOrder): void
    {
        // Jika status berubah ke received, pastikan stok sudah ditambah
        if ($purchaseOrder->wasChanged('status') && $purchaseOrder->status === 'received') {
            // Logic untuk goods receipt
            $this->processGoodsReceipt($purchaseOrder);
        }
    }

    private function updateAverageCost(Product $product, int $quantity, float $unitPrice): void
    {
        $currentStock = $product->stok - $quantity; // stok sebelum penambahan
        $currentValue = $currentStock * $product->hpp;
        $newValue = $quantity * $unitPrice;
        $totalValue = $currentValue + $newValue;
        $totalQuantity = $currentStock + $quantity;

        if ($totalQuantity > 0) {
            $newHpp = $totalValue / $totalQuantity;
            $product->update(['hpp' => round($newHpp)]);
        }
    }

    private function createPurchaseJournal(ErpPurchaseOrder $purchaseOrder): void
    {
        // Cari akun
        $inventoryAccount = ErpChartOfAccount::where('account_code', '1200')->first(); // Inventory
        $payableAccount = ErpChartOfAccount::where('account_code', '2000')->first(); // Accounts Payable

        if (!$inventoryAccount || !$payableAccount) {
            Log::warning("Chart of accounts not found for purchase journal");
            return;
        }

        // Buat journal entry
        $journal = ErpJournalEntry::create([
            'journal_number' => 'PO-' . $purchaseOrder->id . '-' . time(),
            'date' => now(),
            'description' => "Pembelian PO #{$purchaseOrder->po_number}",
            'reference_type' => 'purchase',
            'reference_id' => $purchaseOrder->id,
            'total_debit' => $purchaseOrder->total_amount,
            'total_credit' => $purchaseOrder->total_amount,
        ]);

        // Debit: Inventory
        ErpJournalEntryLine::create([
            'journal_entry_id' => $journal->id,
            'account_id' => $inventoryAccount->id,
            'debit' => $purchaseOrder->total_amount,
            'credit' => 0,
            'description' => 'Inventory Increase',
        ]);

        // Credit: Accounts Payable
        ErpJournalEntryLine::create([
            'journal_entry_id' => $journal->id,
            'account_id' => $payableAccount->id,
            'debit' => 0,
            'credit' => $purchaseOrder->total_amount,
            'description' => 'Supplier Payable',
        ]);
    }

    private function processGoodsReceipt(ErpPurchaseOrder $purchaseOrder): void
    {
        // Logic untuk menerima barang
        // Bisa buat ErpGoodsReceipt model jika perlu
        Log::info("Goods receipt processed for PO {$purchaseOrder->po_number}");
    }
}
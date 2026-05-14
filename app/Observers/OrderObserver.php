<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\Product;
use App\Models\ErpStockMovement;
use App\Models\ErpJournalEntry;
use App\Models\ErpJournalEntryLine;
use App\Models\ErpChartOfAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     * SALES → INVENTORY: Kurangi stok otomatis
     * SALES → ACCOUNTING: Buat jurnal otomatis
     */
    public function created(Order $order): void
    {
        DB::transaction(function () use ($order) {
            try {
                // raw_items already cast to array by Eloquent model
                $items = is_array($order->raw_items) ? $order->raw_items : [];

                if (empty($items)) {
                    // Fallback: parse dari nama_produk dan jumlah_produk
                    $items = [
                        [
                            'nama_produk' => $order->nama_produk,
                            'jumlah_produk' => $order->jumlah_produk,
                            'harga_produk' => $order->harga_produk,
                        ]
                    ];
                }

                foreach ($items as $item) {
                    $productName = $item['nama_produk'] ?? '';
                    $quantity = (int) ($item['jumlah_produk'] ?? 1);
                    $price = (int) ($item['harga_produk'] ?? 0);

                    // Cari produk berdasarkan nama
                    $product = Product::where('nama_produk', $productName)->first();

                    if ($product && $quantity > 0) {
                        // Kurangi stok
                        $product->decrement('stok', $quantity);

                        // Catat stock movement
                        ErpStockMovement::create([
                            'product_id' => $product->id,
                            'movement_type' => 'out',
                            'quantity' => $quantity,
                            'reference_type' => 'order',
                            'reference_id' => $order->id,
                            'notes' => "Penjualan Order #{$order->order_id}",
                            'created_at' => now(),
                        ]);

                        // Jika ada HPP, hitung COGS
                        if ($product->hpp > 0) {
                            $cogs = $product->hpp * $quantity;

                            // Buat jurnal untuk penjualan
                            $this->createSalesJournal($order, $product, $quantity, $price, $cogs);
                        }
                    }
                }

                Log::info("Order {$order->order_id} processed: stock reduced, journal created");

            } catch (\Exception $e) {
                Log::error("Failed to process order {$order->order_id}: " . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        // Jika status berubah, update inventory jika perlu
        if ($order->wasChanged('status_pengiriman')) {
            // Misalnya, jika cancelled, kembalikan stok
            if (in_array($order->status_pengiriman, ['cancelled', 'refunded'])) {
                $this->restoreStock($order);
            }
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        // Kembalikan stok jika order dihapus
        $this->restoreStock($order);
    }

    private function restoreStock(Order $order): void
    {
        // raw_items already cast to array by Eloquent model
        $items = is_array($order->raw_items) ? $order->raw_items : [];

        if (empty($items)) {
            $items = [
                [
                    'nama_produk' => $order->nama_produk,
                    'jumlah_produk' => $order->jumlah_produk,
                ]
            ];
        }

        foreach ($items as $item) {
            $productName = $item['nama_produk'] ?? '';
            $quantity = (int) ($item['jumlah_produk'] ?? 1);

            $product = Product::where('nama_produk', $productName)->first();

            if ($product && $quantity > 0) {
                $product->increment('stok', $quantity);

                ErpStockMovement::create([
                    'product_id' => $product->id,
                    'movement_type' => 'in',
                    'quantity' => $quantity,
                    'reference_type' => 'order_cancelled',
                    'reference_id' => $order->id,
                    'notes' => "Pengembalian stok Order #{$order->order_id}",
                    'created_at' => now(),
                ]);
            }
        }
    }

    private function createSalesJournal(Order $order, Product $product, int $quantity, int $price, int $cogs): void
    {
        // Cari akun penjualan dan COGS
        $salesAccount = ErpChartOfAccount::where('account_code', '4000')->first(); // Penjualan
        $cogsAccount = ErpChartOfAccount::where('account_code', '5000')->first(); // COGS
        $inventoryAccount = ErpChartOfAccount::where('account_code', '1200')->first(); // Inventory

        if (!$salesAccount || !$cogsAccount || !$inventoryAccount) {
            Log::warning("Chart of accounts not found for sales journal");
            return;
        }

        $totalSales = $price * $quantity;

        // Buat journal entry
        $journal = ErpJournalEntry::create([
            'journal_number' => 'SJ-' . $order->id . '-' . time(),
            'date' => now(),
            'description' => "Penjualan Order #{$order->order_id} - {$product->nama_produk}",
            'reference_type' => 'sales',
            'reference_id' => $order->id,
            'total_debit' => $totalSales,
            'total_credit' => $totalSales,
        ]);

        // Debit: Kas/Piutang (simplified)
        ErpJournalEntryLine::create([
            'journal_entry_id' => $journal->id,
            'account_id' => $salesAccount->id,
            'debit' => $totalSales,
            'credit' => 0,
            'description' => 'Penjualan',
        ]);

        // Credit: Penjualan
        ErpJournalEntryLine::create([
            'journal_entry_id' => $journal->id,
            'account_id' => $salesAccount->id,
            'debit' => 0,
            'credit' => $totalSales,
            'description' => 'Penjualan',
        ]);

        // COGS Journal
        $cogsJournal = ErpJournalEntry::create([
            'journal_number' => 'COGS-' . $order->id . '-' . time(),
            'date' => now(),
            'description' => "COGS Order #{$order->order_id} - {$product->nama_produk}",
            'reference_type' => 'cogs',
            'reference_id' => $order->id,
            'total_debit' => $cogs,
            'total_credit' => $cogs,
        ]);

        // Debit: COGS
        ErpJournalEntryLine::create([
            'journal_entry_id' => $cogsJournal->id,
            'account_id' => $cogsAccount->id,
            'debit' => $cogs,
            'credit' => 0,
            'description' => 'Cost of Goods Sold',
        ]);

        // Credit: Inventory
        ErpJournalEntryLine::create([
            'journal_entry_id' => $cogsJournal->id,
            'account_id' => $inventoryAccount->id,
            'debit' => 0,
            'credit' => $cogs,
            'description' => 'Inventory Reduction',
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Pos\PosSale;
use App\Models\Pos\PosSaleItem;
use App\Models\Product;
use App\Models\Customer;
use App\Models\ErpStockMovement;
use App\Models\ErpJournalEntry;
use App\Models\ErpJournalEntryLine;
use App\Models\ErpChartOfAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PosController extends Controller
{
    public function index()
    {
        $products = Product::where('stok', '>', 0)->get();
        $customers = Customer::all();

        return view('pos.index', compact('products', 'customers'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'payment_amount' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {
            // Buat POS sale
            $sale = PosSale::create([
                'customer_id' => $request->customer_id,
                'total_amount' => 0, // akan dihitung
                'payment_method' => $request->payment_method,
                'payment_amount' => $request->payment_amount,
                'change_amount' => $request->payment_amount - collect($request->items)->sum(fn($item) => $item['quantity'] * $item['price']),
                'status' => 'completed',
                'created_by' => auth()->id(),
            ]);

            $totalAmount = 0;

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $quantity = $item['quantity'];
                $price = $item['price'];
                $subtotal = $quantity * $price;

                // Kurangi stok
                $product->decrement('stok', $quantity);

                // Catat stock movement
                ErpStockMovement::create([
                    'product_id' => $product->id,
                    'movement_type' => 'out',
                    'quantity' => $quantity,
                    'reference_type' => 'pos_sale',
                    'reference_id' => $sale->id,
                    'notes' => "POS Sale #{$sale->id}",
                ]);

                // Buat sale item
                PosSaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $price,
                    'subtotal' => $subtotal,
                ]);

                $totalAmount += $subtotal;

                // Jika ada HPP, hitung COGS
                if ($product->hpp > 0) {
                    $cogs = $product->hpp * $quantity;
                    $this->createCogsJournal($sale, $product, $quantity, $cogs);
                }
            }

            // Update total
            $sale->update(['total_amount' => $totalAmount]);

            // Buat jurnal penjualan
            $this->createSalesJournal($sale, $totalAmount);

            Log::info("POS Sale {$sale->id} completed: stock reduced, journals created");
        });

        return response()->json(['success' => true, 'message' => 'Transaksi berhasil']);
    }

    public function receipt($id)
    {
        $sale = PosSale::with(['items.product', 'customer'])->findOrFail($id);
        return view('pos.receipt', compact('sale'));
    }

    private function createSalesJournal(PosSale $sale, float $totalAmount): void
    {
        $cashAccount = ErpChartOfAccount::where('account_code', '1000')->first(); // Kas
        $salesAccount = ErpChartOfAccount::where('account_code', '4000')->first(); // Penjualan

        if (!$cashAccount || !$salesAccount) {
            Log::warning("Chart of accounts not found for POS sales journal");
            return;
        }

        $journal = ErpJournalEntry::create([
            'journal_number' => 'POS-' . $sale->id . '-' . time(),
            'date' => now(),
            'description' => "POS Sale #{$sale->id}",
            'reference_type' => 'pos_sale',
            'reference_id' => $sale->id,
            'total_debit' => $totalAmount,
            'total_credit' => $totalAmount,
        ]);

        // Debit: Kas
        ErpJournalEntryLine::create([
            'journal_entry_id' => $journal->id,
            'account_id' => $cashAccount->id,
            'debit' => $totalAmount,
            'credit' => 0,
            'description' => 'Cash Receipt',
        ]);

        // Credit: Penjualan
        ErpJournalEntryLine::create([
            'journal_entry_id' => $journal->id,
            'account_id' => $salesAccount->id,
            'debit' => 0,
            'credit' => $totalAmount,
            'description' => 'Sales Revenue',
        ]);
    }

    private function createCogsJournal(PosSale $sale, Product $product, int $quantity, float $cogs): void
    {
        $cogsAccount = ErpChartOfAccount::where('account_code', '5000')->first(); // COGS
        $inventoryAccount = ErpChartOfAccount::where('account_code', '1200')->first(); // Inventory

        if (!$cogsAccount || !$inventoryAccount) return;

        $journal = ErpJournalEntry::create([
            'journal_number' => 'COGS-POS-' . $sale->id . '-' . time(),
            'date' => now(),
            'description' => "COGS POS Sale #{$sale->id} - {$product->nama_produk}",
            'reference_type' => 'pos_cogs',
            'reference_id' => $sale->id,
            'total_debit' => $cogs,
            'total_credit' => $cogs,
        ]);

        // Debit: COGS
        ErpJournalEntryLine::create([
            'journal_entry_id' => $journal->id,
            'account_id' => $cogsAccount->id,
            'debit' => $cogs,
            'credit' => 0,
            'description' => 'Cost of Goods Sold',
        ]);

        // Credit: Inventory
        ErpJournalEntryLine::create([
            'journal_entry_id' => $journal->id,
            'account_id' => $inventoryAccount->id,
            'debit' => 0,
            'credit' => $cogs,
            'description' => 'Inventory Reduction',
        ]);
    }
}
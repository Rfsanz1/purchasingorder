@extends('layouts.erp')

@section('title', 'Point of Sale')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900">Point of Sale</h1>
            <p class="text-gray-600">Transaksi penjualan real-time</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <!-- Product Selection -->
            <div class="lg:col-span-2">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold mb-4">Pilih Produk</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4" id="products-grid">
                        @foreach($products as $product)
                        <div class="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow product-item"
                             data-product-id="{{ $product->id }}"
                             data-name="{{ $product->nama_produk }}"
                             data-price="{{ $product->harga_jual }}"
                             data-stock="{{ $product->stok }}">
                            <h4 class="font-medium text-sm">{{ $product->nama_produk }}</h4>
                            <p class="text-blue-600 font-bold">Rp {{ number_format($product->harga_jual) }}</p>
                            <p class="text-xs text-gray-500">Stok: {{ $product->stok }}</p>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- Cart & Checkout -->
            <div class="space-y-6">
                <!-- Customer Selection -->
                <div class="bg-white border rounded-lg p-4">
                    <h3 class="text-lg font-semibold mb-4">Pelanggan</h3>
                    <select id="customer-select" class="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="">Pilih Pelanggan (Opsional)</option>
                        @foreach($customers as $customer)
                        <option value="{{ $customer->id }}">{{ $customer->name }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Cart -->
                <div class="bg-white border rounded-lg p-4">
                    <h3 class="text-lg font-semibold mb-4">Keranjang</h3>
                    <div id="cart-items" class="space-y-2 max-h-64 overflow-y-auto">
                        <!-- Cart items will be added here -->
                    </div>
                    <div class="border-t pt-4 mt-4">
                        <div class="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span id="cart-total">Rp 0</span>
                        </div>
                    </div>
                </div>

                <!-- Payment -->
                <div class="bg-white border rounded-lg p-4">
                    <h3 class="text-lg font-semibold mb-4">Pembayaran</h3>
                    <form id="payment-form">
                        @csrf
                        <input type="hidden" name="customer_id" id="customer-id">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
                                <select name="payment_method" required class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    <option value="cash">Tunai</option>
                                    <option value="card">Kartu</option>
                                    <option value="qris">QRIS</option>
                                    <option value="ewallet">E-Wallet</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Jumlah Bayar</label>
                                <input type="number" name="payment_amount" required
                                       class="w-full border border-gray-300 rounded-md px-3 py-2"
                                       placeholder="0">
                            </div>
                            <div class="text-sm text-gray-600">
                                Kembalian: <span id="change-amount">Rp 0</span>
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 mt-4">
                            Bayar & Selesai
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
let cart = [];
let total = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Product click handler
    document.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const name = this.dataset.name;
            const price = parseInt(this.dataset.price);
            const stock = parseInt(this.dataset.stock);

            // Check if already in cart
            let existingItem = cart.find(item => item.product_id == productId);

            if (existingItem) {
                if (existingItem.quantity < stock) {
                    existingItem.quantity++;
                    existingItem.subtotal = existingItem.quantity * price;
                }
            } else {
                cart.push({
                    product_id: productId,
                    name: name,
                    price: price,
                    quantity: 1,
                    subtotal: price
                });
            }

            updateCart();
        });
    });

    // Payment form
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Keranjang kosong!');
            return;
        }

        const formData = new FormData(this);
        formData.append('items', JSON.stringify(cart));

        fetch('/pos/store', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Transaksi berhasil!');
                cart = [];
                updateCart();
                this.reset();
            } else {
                alert('Terjadi kesalahan!');
            }
        });
    });

    // Payment amount change
    document.querySelector('input[name="payment_amount"]').addEventListener('input', function() {
        const payment = parseInt(this.value) || 0;
        const change = payment - total;
        document.getElementById('change-amount').textContent = 'Rp ' + change.toLocaleString();
    });
});

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    total = 0;

    cart.forEach((item, index) => {
        total += item.subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
        itemDiv.innerHTML = `
            <div>
                <p class="font-medium text-sm">${item.name}</p>
                <p class="text-xs text-gray-600">Rp ${item.price.toLocaleString()} x ${item.quantity}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="changeQuantity(${index}, -1)" class="text-red-500">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)" class="text-green-500">+</button>
                <span class="font-bold">Rp ${item.subtotal.toLocaleString()}</span>
            </div>
        `;
        cartContainer.appendChild(itemDiv);
    });

    document.getElementById('cart-total').textContent = 'Rp ' + total.toLocaleString();
}

function changeQuantity(index, delta) {
    const item = cart[index];
    item.quantity += delta;

    if (item.quantity <= 0) {
        cart.splice(index, 1);
    } else {
        item.subtotal = item.quantity * item.price;
    }

    updateCart();
}
</script>
@endsection
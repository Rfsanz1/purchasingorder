<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function landing()
    {
        return view('landing');
    }

    public function poForm()
    {
        return view('po-form');
    }

    public function admin()
    {
        return view('admin');
    }

    public function driver()
    {
        return view('driver');
    }

    public function location(string $token)
    {
        return view('location', ['token' => $token]);
    }

    public function products()
    {
        return view('products');
    }

    public function salesDashboard()
    {
        return view('sales-dashboard');
    }

    public function erpInvoice()
    {
        return view('erp.invoice');
    }

    public function laporanDivisi()
    {
        return view('erp.laporan-divisi');
    }

    public function laporanPenjualan()
    {
        return view('erp.laporan-penjualan');
    }

    public function integrasi()
    {
        return view('erp.integrasi');
    }

    public function riwayatPenjualan()
    {
        return view('erp.riwayat-penjualan');
    }

    public function dataPenjualanKledo()
    {
        return view('erp.data-penjualan-kledo');
    }

    public function customers()
    {
        return view('erp.customers');
    }

    public function stockOpname()
    {
        return view('erp.stock-opname');
    }

    public function pos()
    {
        return view('pos');
    }
}

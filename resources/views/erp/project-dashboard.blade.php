@extends('layouts.erp')
@section('title', 'Project Dashboard')
@section('content')
<div class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Project Dashboard</h1>
            <p class="text-gray-500 mt-1 text-sm">Ringkasan portofolio proyek, target, dan progress tim.</p>
        </div>
        <div class="flex gap-2">
            <button class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Refresh</button>
            <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Tambah Project</button>
        </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Proyek</p>
            <p class="mt-3 text-3xl font-bold text-gray-900">28</p>
            <p class="text-xs text-gray-400 mt-1">Proyek yang sedang berjalan</p>
        </div>
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Proyek Aktif</p>
            <p class="mt-3 text-3xl font-bold text-green-600">22</p>
            <p class="text-xs text-gray-400 mt-1">Sedang berjalan</p>
        </div>
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Selesai</p>
            <p class="mt-3 text-3xl font-bold text-blue-600">4</p>
            <p class="text-xs text-gray-400 mt-1">Proyek selesai</p>
        </div>
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Budget</p>
            <p class="mt-3 text-3xl font-bold text-gray-900">Rp 18,2M</p>
            <p class="text-xs text-gray-400 mt-1">Anggaran teralokasi</p>
        </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-3">
        <section class="col-span-2 bg-white rounded-xl border shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">Progress Proyek Utama</h2>
                <span class="text-xs text-gray-500">Data terakhir 2 jam lalu</span>
            </div>
            <div class="space-y-4">
                @foreach([['Project Titan',60],['Project Garuda',83],['Project Kledo',45]] as $project)
                <div class="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div class="flex justify-between items-center gap-4">
                        <div>
                            <p class="font-semibold text-gray-800">{{ $project[0] }}</p>
                            <p class="text-xs text-gray-500">Milestone berikutnya dalam 7 hari</p>
                        </div>
                        <p class="text-sm font-bold text-gray-900">{{ $project[1] }}%</p>
                    </div>
                    <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div class="h-full bg-blue-600" style="width: {{ $project[1] }}%"></div>
                    </div>
                </div>
                @endforeach
            </div>
        </section>

        <section class="bg-white rounded-xl border shadow-sm p-5">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
            <div class="space-y-3">
                @foreach(['Task Garuda disetujui','Laporan biaya Titan diupdate','Timesheet IT masuk'] as $activity)
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">{{ $activity }}</div>
                @endforeach
            </div>
        </section>
    </div>
</div>
@endsection

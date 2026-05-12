@extends('layouts.erp')

@section('title', 'Integration Dashboard')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Integration Dashboard</h1>
        <p class="text-gray-600 mt-2">Monitor sinkronisasi data ERP dengan Kledo</p>
    </div>

    <!-- API Status -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">API Connection Status</h2>
        <div class="flex items-center gap-4">
            <div id="api-status" class="flex items-center gap-2">
                <div class="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                <span>Checking...</span>
            </div>
            <button onclick="checkApiStatus()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Check Status
            </button>
        </div>
    </div>

    <!-- Sync Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900">Synced Today</h3>
            <p class="text-3xl font-bold text-blue-600" id="synced-today">{{ $stats['total_synced_today'] }}</p>
            <p class="text-sm text-gray-500">records</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900">Errors Today</h3>
            <p class="text-3xl font-bold text-red-600" id="errors-today">{{ $stats['total_errors_today'] }}</p>
            <p class="text-sm text-gray-500">failed syncs</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900">Queue Status</h3>
            <p class="text-3xl font-bold text-green-600" id="queue-pending">{{ $queueStatus['pending'] }}</p>
            <p class="text-sm text-gray-500">pending jobs</p>
        </div>
    </div>

    <!-- Last Sync Times -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Last Sync Times</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @foreach($lastSyncs as $type => $sync)
            <div class="border rounded-lg p-4">
                <h3 class="font-medium text-gray-900 capitalize">{{ $type }}</h3>
                @if($sync)
                <p class="text-sm text-gray-600">{{ $sync->created_at->diffForHumans() }}</p>
                <p class="text-xs text-gray-500">{{ $sync->records_synced }} records</p>
                @else
                <p class="text-sm text-gray-400">Never synced</p>
                @endif
                <button onclick="manualSync('{{ $type }}')"
                        class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Sync Now
                </button>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Recent Sync Logs -->
    <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Recent Sync Logs</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @foreach($recentLogs as $log)
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {{ $log->data_type }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                {{ $log->status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                {{ $log->status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ $log->records_synced }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {{ $log->message }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ $log->created_at->diffForHumans() }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
function checkApiStatus() {
    fetch('/integration/api-status')
        .then(response => response.json())
        .then(data => {
            const statusEl = document.getElementById('api-status');
            const status = data.status;
            const color = status === 'connected' ? 'bg-green-400' : 'bg-red-400';

            statusEl.innerHTML = `
                <div class="w-3 h-3 ${color} rounded-full"></div>
                <span class="capitalize">${status}</span>
                <span class="text-xs text-gray-500">(${data.last_check})</span>
            `;
        });
}

function manualSync(type) {
    if (!confirm(`Sync ${type} now?`)) return;

    const button = event.target;
    button.disabled = true;
    button.textContent = 'Syncing...';

    fetch('/integration/manual-sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ type: type })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Sync completed');
        location.reload();
    })
    .catch(error => {
        alert('Sync failed: ' + error.message);
        button.disabled = false;
        button.textContent = 'Sync Now';
    });
}

// Check API status on load
checkApiStatus();
</script>
@endsection
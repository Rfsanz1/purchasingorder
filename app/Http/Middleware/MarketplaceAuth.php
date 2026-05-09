<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MarketplaceAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!session('marketplace_auth')) {
            return redirect()->route('marketplace.login')
                ->with('error', 'Silakan login terlebih dahulu untuk mengakses Marketplace.');
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ShopeeAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!session('shopee_authenticated')) {
            return redirect('/shopee/login')->with('error', 'Silakan login terlebih dahulu.');
        }

        return $next($request);
    }
}

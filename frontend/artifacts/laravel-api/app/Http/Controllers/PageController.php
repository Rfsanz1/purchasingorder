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
}

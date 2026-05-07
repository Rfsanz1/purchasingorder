<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class SalesController extends Controller
{
    public const SALES_LIST = [
        ['id' => 'lehan',       'nama' => 'Lehan',       'telp' => '+62 857-2982-4485'],
        ['id' => 'agus',        'nama' => 'Agus',        'telp' => '+62 857-3084-5708'],
        ['id' => 'ivan',        'nama' => 'Ivan',        'telp' => '+62 857-1820-0975'],
        ['id' => 'dias',        'nama' => 'Dias',        'telp' => '+62 852-2996-0722'],
        ['id' => 'rio brandon', 'nama' => 'Rio Brandon', 'telp' => '+62 859-5282-5277'],
        ['id' => 'imam',        'nama' => 'Imam',        'telp' => '+62 858-9233-3127'],
        ['id' => 'agung',       'nama' => 'Agung',       'telp' => '+62 882-3368-4224'],
        ['id' => 'andre',       'nama' => 'Andre',       'telp' => '+62 821-3763-3912'],
        ['id' => 'priyanto',    'nama' => 'Priyanto',    'telp' => '+62 823-3479-2357'],
        ['id' => 'wiwid',       'nama' => 'Wiwid',       'telp' => '+62 857-4115-6110'],
        ['id' => 'dhani',       'nama' => 'Dhani',       'telp' => '+62 812-1599-2058'],
    ];

    public function index(): JsonResponse
    {
        return response()->json(['sales' => self::SALES_LIST]);
    }

    public static function ids(): array
    {
        return array_column(self::SALES_LIST, 'id');
    }
}

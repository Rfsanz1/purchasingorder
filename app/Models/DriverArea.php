<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverArea extends Model
{
    protected $table = 'driver_areas';

    public $timestamps = false;

    protected $fillable = ['driver_name', 'area_name'];

    public static function getGrouped(): array
    {
        $defaultDrivers = ['Yanto', 'Wawan', 'Chaidar'];
        $rows = static::orderBy('driver_name')->orderBy('area_name')->get();

        $result = array_fill_keys($defaultDrivers, []);

        foreach ($rows as $row) {
            if (!isset($result[$row->driver_name])) {
                $result[$row->driver_name] = [];
            }
            $result[$row->driver_name][] = $row->area_name;
        }

        return $result;
    }

    public static function setForDriver(string $driver, array $areas): void
    {
        static::where('driver_name', $driver)->delete();
        foreach (array_unique(array_filter($areas)) as $area) {
            static::create(['driver_name' => $driver, 'area_name' => trim($area)]);
        }
    }
}

<?php

namespace App\Services;

class AddressNormalizer
{
    // Kecamatan-kecamatan di Kabupaten Temanggung
    private const TEMANGGUNG_KECAMATAN = [
        'parakan', 'temanggung', 'kedu', 'ngadirejo', 'kranggan', 'candiroto',
        'pringsurat', 'wonoboyo', 'tretep', 'tlogomulyo', 'gemawang', 'bejen',
        'bulu', 'jumo', 'kandangan', 'kaloran', 'kledung', 'bansari', 'tembarak',
        'selopampang', 'pare', 'parakan kauman', 'parakan wetan', 'jampiroso',
        'jampirejo', 'manding', 'losari', 'danurejo', 'dharma ayu', 'tepusen',
        'medari', 'mungseng', 'campursari', 'tlahab', 'kruwisan', 'pagergunung',
    ];

    // Desa/kelurahan terkenal di Temanggung
    private const TEMANGGUNG_DESA = [
        'parakan kauman', 'parakan wetan', 'jampiroso', 'jampirejo',
        'caturanom', 'wanutengah', 'gunungsari', 'kentengsari', 'bagusan',
        'kalibanger', 'tlogorejo', 'tegowanuh', 'mudal', 'kutoanyar',
        'simpar', 'giripurno', 'pagergunung', 'kwadungan', 'traji',
        'mangunsari', 'jurang', 'glapansari', 'tlahab',
    ];

    // Keyword spesifik Temanggung yang membedakan dari Magelang/lainnya
    private const TEMANGGUNG_STRONG_KEYWORDS = [
        'parakan', 'ngadirejo', 'candiroto', 'kranggan', 'pringsurat',
        'wonoboyo', 'kledung', 'tembarak', 'selopampang', 'bansari',
        'tlogomulyo', 'gemawang', 'tretep', 'bejen', 'jumo', 'bulu temanggung',
        'kab temanggung', 'kab. temanggung', 'kabupaten temanggung',
        'temanggung jawa tengah', 'temanggung, jawa',
    ];

    /**
     * Normalkan alamat — pastikan area Temanggung tidak diarahkan ke Magelang.
     * Return: array dengan 'alamat' (normalized), 'kabupaten', 'warning'
     */
    public static function normalize(string $rawAlamat): array
    {
        $lower   = strtolower(trim($rawAlamat));
        $warning = null;

        $isTemanggung = self::detectTemanggung($lower);

        if ($isTemanggung) {
            // Pastikan tidak ada "magelang" yang salah di alamat
            if (str_contains($lower, 'magelang')) {
                $rawAlamat = preg_replace('/\bmagelang\b/i', 'Temanggung', $rawAlamat);
                $warning   = 'Alamat dikoreksi: Magelang → Temanggung (area Temanggung terdeteksi)';
            }
            return [
                'alamat'    => $rawAlamat,
                'kabupaten' => 'Temanggung',
                'provinsi'  => 'Jawa Tengah',
                'warning'   => $warning,
            ];
        }

        return [
            'alamat'    => $rawAlamat,
            'kabupaten' => null,
            'provinsi'  => null,
            'warning'   => null,
        ];
    }

    /**
     * Deteksi apakah alamat adalah area Kabupaten Temanggung
     */
    public static function detectTemanggung(string $lowerAlamat): bool
    {
        foreach (self::TEMANGGUNG_STRONG_KEYWORDS as $kw) {
            if (str_contains($lowerAlamat, $kw)) return true;
        }
        foreach (self::TEMANGGUNG_KECAMATAN as $kec) {
            if (preg_match('/\b' . preg_quote($kec, '/') . '\b/', $lowerAlamat)) return true;
        }
        foreach (self::TEMANGGUNG_DESA as $desa) {
            if (str_contains($lowerAlamat, $desa)) return true;
        }
        return false;
    }

    /**
     * Validasi & normalisasi dari input terstruktur
     */
    public static function fromStructured(array $parts): array
    {
        $jalan      = trim($parts['jalan'] ?? '');
        $desa       = trim($parts['desa'] ?? '');
        $kecamatan  = trim($parts['kecamatan'] ?? '');
        $kabupaten  = trim($parts['kabupaten'] ?? '');
        $provinsi   = trim($parts['provinsi'] ?? 'Jawa Tengah');
        $kodepos    = trim($parts['kodepos'] ?? '');
        $warning    = null;

        // Auto-koreksi Temanggung
        $lowerKec = strtolower($kecamatan);
        $lowerKab = strtolower($kabupaten);

        $isTemanggungKec = in_array($lowerKec, self::TEMANGGUNG_KECAMATAN, true);
        $isTemanggungKab = str_contains($lowerKab, 'temanggung');

        if ($isTemanggungKec && !$isTemanggungKab) {
            $kabupaten = 'Temanggung';
            $warning   = "Kabupaten dikoreksi ke Temanggung berdasarkan kecamatan \"{$kecamatan}\"";
        }

        $parts_arr = array_filter([$jalan, $desa, $kecamatan, $kabupaten, $provinsi, $kodepos]);
        $alamat    = implode(', ', $parts_arr);

        return [
            'alamat'    => $alamat,
            'jalan'     => $jalan,
            'desa'      => $desa,
            'kecamatan' => $kecamatan,
            'kabupaten' => $kabupaten,
            'provinsi'  => $provinsi,
            'kodepos'   => $kodepos,
            'warning'   => $warning,
        ];
    }

    /**
     * Format alamat lengkap (untuk disimpan ke DB / Kledo)
     */
    public static function formatFull(array $s): string
    {
        $lines = array_filter([
            $s['nama'] ?? '',
            $s['telepon'] ?? '',
            $s['jalan'] ?? '',
            $s['desa'] ?? '',
            $s['kecamatan'] ?? '',
            $s['kabupaten'] ?? '',
            $s['provinsi'] ?? '',
            $s['kodepos'] ?? '',
        ]);
        return implode("\n", $lines);
    }

    /**
     * Daftar keyword Temanggung untuk frontend (JS)
     */
    public static function temanggungKeywordsJson(): string
    {
        return json_encode(array_merge(
            self::TEMANGGUNG_STRONG_KEYWORDS,
            self::TEMANGGUNG_KECAMATAN
        ));
    }
}

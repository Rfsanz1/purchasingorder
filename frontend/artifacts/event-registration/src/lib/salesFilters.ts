// Daftar ID kategori produk Kledo yang dianggap ELEKTRONIK.
// Kategori lain (bahan bangunan, alat, dsb.) otomatis di luar elektronik.
export const ELEKTRONIK_CATEGORY_IDS = new Set<number>([
  3,   // ANTENA
  4,   // TV
  5,   // CHEST FREEZER
  6,   // FREEZER
  7,   // REFRIGERATOR
  8,   // MESIN CUCI
  10,  // DISPENSER
  11,  // AIR PURIFIER
  13,  // VACUM CLEANER
  14,  // COOKER HOOD
  15,  // DISH WASHER
  16,  // OVEN
  17,  // WATER HEATER
  21,  // KIPAS ANGIN
  22,  // BLENDER
  23,  // MAGICOM
  29,  // SETRIKA
  35,  // AIR COOLER
  36,  // AIR FRYER
  37,  // AC
  38,  // MIXER
  42,  // SPEAKER
  44,  // KOMPOR
  45,  // SHOWCASE
  74,  // RADIO
  75,  // REMOTE
  77,  // MIC
  78,  // CUP SEALER
  80,  // HAIR DYER
  98,  // AIR CONDITIONER
  102, // DISPLAY COOLER
  110, // MICROWAVE
  120, // CHOPPER
  130, // SET TOP BOX
  131, // PARABOLA
  138, // EXHAUST FAN
  141, // JUICER
  142, // PEST CONTROL LAMP
  143, // PANGGANG LISTRIK
  144, // SLOW COOKER
  145, // Receiver parabola
]);

// ID kategori CAT (untuk Rio Brandon — Kansai)
export const CAT_CATEGORY_ID = 9;

interface ProductLike {
  name: string;
  categoryId?: number | null;
}

export interface SalesScope {
  label: string;
  // Filter produk di picker (form) — pakai kategori Kledo + nama
  matchProduct: (p: ProductLike) => boolean;
  // Filter order di dashboard — hanya bisa pakai nama (kategori tidak tersimpan)
  matchOrderName: (productNameLower: string) => boolean;
}

const inElektronik = (id?: number | null) =>
  typeof id === "number" && ELEKTRONIK_CATEGORY_IDS.has(id);

// Helper untuk sales merek elektronik:
// produk harus berada di kategori elektronik DAN namanya mengandung keyword merek.
function elektronikBrand(label: string, keywordMatch: (n: string) => boolean): SalesScope {
  return {
    label,
    matchProduct: p => inElektronik(p.categoryId) && keywordMatch(p.name.toLowerCase()),
    matchOrderName: keywordMatch,
  };
}

export const SALES_SCOPES: Record<string, SalesScope> = {
  lehan:    elektronikBrand("AQUA",      n => n.includes("aqua")),
  wiwid:    elektronikBrand("STEKO",     n => n.includes("steko")),
  priyanto: elektronikBrand("CHANGHONG", n => n.includes("changhong")),
  agus:     elektronikBrand("TCL",       n => n.includes("tcl")),
  agung:    elektronikBrand("MIDEA & TOSHIBA (selain TV)",
              n => n.includes("midea") || (n.includes("toshiba") && !n.includes("tv"))),
  andre:    elektronikBrand("RSA",       n => n.includes("rsa")),
  imam:     elektronikBrand("SANKEN",    n => n.includes("sanken")),
  dhani:    elektronikBrand("ARTUGO",    n => n.includes("artugo")),

  // Rio Brandon: hanya kategori CAT + merek Kansai
  "rio brandon": {
    label: "CAT KANSAI",
    matchProduct: p => p.categoryId === CAT_CATEGORY_ID && p.name.toLowerCase().includes("kansai"),
    matchOrderName: n => n.includes("kansai"),
  },

  // Ivan & Dias: SEMUA kategori SELAIN elektronik (bahan bangunan + lain-lain)
  ivan: {
    label: "Bahan Bangunan (semua selain elektronik)",
    matchProduct: p => !inElektronik(p.categoryId),
    matchOrderName: () => true, // tidak bisa pasti dari nama saja — tampilkan semua order yg terdaftar untuknya
  },
  dias: {
    label: "Bahan Bangunan (semua selain elektronik)",
    matchProduct: p => !inElektronik(p.categoryId),
    matchOrderName: () => true,
  },
};

export function filterOrdersForSales<T extends { namaProduk: string }>(
  orders: T[],
  username: string,
): T[] {
  const scope = SALES_SCOPES[username.toLowerCase()];
  if (!scope) return orders;
  return orders.filter(o => scope.matchOrderName((o.namaProduk || "").toLowerCase()));
}

export const SALES_USERNAMES = Object.keys(SALES_SCOPES);

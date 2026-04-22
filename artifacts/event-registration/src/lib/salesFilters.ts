// Daftar brand elektronik — dipakai untuk Ivan/Dias yang melihat semua produk SELAIN elektronik.
const ELECTRONIC_BRANDS = [
  "aqua", "steko", "changhong", "tcl", "midea", "toshiba",
  "rsa", "sanken", "artugo", "kansai",
];

export interface SalesScope {
  label: string;       // deskripsi yg dipakai di header dashboard
  match: (productNameLower: string) => boolean;
}

export const SALES_SCOPES: Record<string, SalesScope> = {
  lehan:    { label: "AQUA", match: n => n.includes("aqua") },
  wiwid:    { label: "STEKO", match: n => n.includes("steko") },
  priyanto: { label: "CHANGHONG", match: n => n.includes("changhong") },
  agus:     { label: "TCL", match: n => n.includes("tcl") },
  agung:    { label: "MIDEA & TOSHIBA (selain TV)", match: n =>
              n.includes("midea") || (n.includes("toshiba") && !n.includes("tv")) },
  andre:    { label: "RSA", match: n => n.includes("rsa") },
  imam:     { label: "SANKEN", match: n => n.includes("sanken") },
  dhani:    { label: "ARTUGO", match: n => n.includes("artugo") },
  "rio brandon": { label: "KANSAI", match: n => n.includes("kansai") },
  ivan:     { label: "Semua unit selain elektronik",
              match: n => !ELECTRONIC_BRANDS.some(b => n.includes(b)) },
  dias:     { label: "Semua unit selain elektronik",
              match: n => !ELECTRONIC_BRANDS.some(b => n.includes(b)) },
};

export function filterOrdersForSales<T extends { namaProduk: string }>(
  orders: T[],
  username: string,
): T[] {
  const scope = SALES_SCOPES[username.toLowerCase()];
  if (!scope) return orders;
  return orders.filter(o => scope.match((o.namaProduk || "").toLowerCase()));
}

export const SALES_USERNAMES = Object.keys(SALES_SCOPES);

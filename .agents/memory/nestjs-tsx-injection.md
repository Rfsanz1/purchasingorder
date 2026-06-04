---
name: NestJS tsx injection rules
description: tsx/esbuild runtime tidak support emitDecoratorMetadata — wajib @Inject() eksplisit di semua constructor NestJS
---

## Aturan

Karena runtime `tsx watch` (esbuild) tidak mengeluarkan metadata decorator TypeScript, NestJS tidak bisa auto-resolve dependency injection via type inference. **Selalu gunakan `@Inject(Token)` eksplisit** di constructor — baik di Controller maupun Service.

**Benar:**
```typescript
constructor(@Inject(PrismaService) private prisma: PrismaService) {}
constructor(@Inject(PayrollService) private readonly svc: PayrollService) {}
```

**Salah (tidak bekerja di tsx runtime):**
```typescript
constructor(private prisma: PrismaService) {}
constructor(private readonly svc: PayrollService) {}
```

**Why:** tsx/esbuild strips TypeScript metadata; NestJS DI IoC container tidak tahu token apa yang harus diinjeksi tanpa hint eksplisit.

**How to apply:** Tiap kali membuat atau mengedit NestJS Service/Controller/Guard di project ini, pastikan semua parameter constructor punya `@Inject(ClassName)`.

## Field name gotchas (schema Prisma vs kode service)

Model Prisma menggunakan nama field bahasa Inggris — jangan pakai asumsi Indonesia:
- `Customer.name` (bukan `nama`)
- `Employee.name` (bukan `nama`), punya `nik` tapi TIDAK punya `bankAccount`/`bankName`
- `Pricelist.name` (bukan `nama`)
- `EmployeeMutasi`: orderBy/filter pakai `effectiveDate` (bukan `tanggal`), tidak punya field `jenis`
- `SalesReturn`: unique field adalah `noReturn` (bukan `nomorReturn`)
- `Invoice`: field unik adalah `noInvoice` (bukan `nomorInvoice`), total di `grandTotal` (bukan `totalAmount`)
- `SlipStatus` enum: nilai uppercase — `DRAFT`, `APPROVED`, `PAID` (bukan lowercase)

## Date handling untuk query opsional

Jangan langsung `new Date(param)` jika param bisa undefined — hasilnya `Invalid Date` yang menyebabkan Prisma throw PrismaClientValidationError:

```typescript
// Benar:
const tanggal: any = {};
if (dateFrom) { const d = new Date(dateFrom); if (!isNaN(d.getTime())) tanggal.gte = d; }
if (dateTo)   { const d = new Date(dateTo);   if (!isNaN(d.getTime())) tanggal.lte = d; }
if (Object.keys(tanggal).length > 0) where.tanggal = tanggal;
```

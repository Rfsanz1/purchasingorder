import { Inject, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class PurchasingService {
  private readonly logger = new Logger(PurchasingService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private async generateNumber(prefix: string, model: 'purchaseOrder' | 'requestForQuotation' | 'goodsReceipt' | 'vendorBill' | 'purchaseReturn') {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const nextMonth = Number(month) === 12 ? `${year + 1}-01-01` : `${year}-${String(Number(month) + 1).padStart(2, '0')}-01`;
    const latest = await (this.prisma as any)[model].findFirst({
      where: { createdAt: { gte: new Date(`${year}-${month}-01`), lt: new Date(nextMonth) } },
      orderBy: { createdAt: 'desc' },
    });
    const seq = latest ? Number((latest as any)[model === 'purchaseOrder' ? 'noPo' : model === 'requestForQuotation' ? 'noRfq' : model === 'goodsReceipt' ? 'noGr' : model === 'vendorBill' ? 'noBill' : 'noReturn'].split('/')[3]) + 1 : 1;
    return `${prefix}/${year}/${month}/${String(seq).padStart(4, '0')}`;
  }

  private async generatePONumber() { return this.generateNumber('PO', 'purchaseOrder'); }
  private async generateRFQNumber() { return this.generateNumber('RFQ', 'requestForQuotation'); }
  private async generateGRNumber() { return this.generateNumber('GR', 'goodsReceipt'); }
  private async generateBillNumber() { return this.generateNumber('BILL', 'vendorBill'); }
  private async generateReturnNumber() { return this.generateNumber('RET', 'purchaseReturn'); }

  private calculateTotals(items: any[]) {
    const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal ?? ((Number(item.qty) || 0) * Number(item.unitPrice ?? item.hargaBeli ?? 0))), 0);
    const tax = items.reduce((sum, item) => sum + Number(item.tax ?? 0), 0);
    const landedCost = items.reduce((sum, item) => sum + Number(item.landedCost ?? 0), 0);
    const total = subtotal + tax + landedCost;
    return { subtotal, tax, landedCost, total };
  }

  private buildRfqItems(items: any[]) {
    if (!items || !items.length) throw new BadRequestException('Item RFQ harus diisi');
    return items.map((item) => ({
      productId: item.productId,
      nama: item.nama ?? item.description ?? item.name ?? 'Item',
      qty: Number(item.qty) || 1,
      hargaBeli: Number(item.hargaBeli ?? item.unitPrice ?? item.harga ?? item.price ?? 0),
      subtotal: Number(item.subtotal ?? ((Number(item.qty) || 1) * Number(item.hargaBeli ?? item.unitPrice ?? item.harga ?? item.price ?? 0))),
    }));
  }

  private buildPurchaseOrderItems(items: any[]) {
    if (!items || !items.length) throw new BadRequestException('Item PO harus diisi');
    return items.map((item) => ({
      productId: item.productId,
      nama: item.nama ?? item.description ?? item.name ?? 'Item',
      qty: Number(item.qty) || 1,
      hargaBeli: Number(item.hargaBeli ?? item.unitPrice ?? item.harga ?? item.price ?? 0),
      subtotal: Number(item.subtotal ?? ((Number(item.qty) || 1) * Number(item.hargaBeli ?? item.unitPrice ?? item.harga ?? item.price ?? 0))),
      qtyReceived: Number(item.qtyReceived ?? 0),
    }));
  }

  private buildGoodsReceiptItems(items: any[]) {
    if (!items || !items.length) throw new BadRequestException('Item GR harus diisi');
    return items.map((item) => ({
      productId: item.productId,
      nama: item.nama ?? item.description ?? item.name ?? 'Item',
      qtyOrdered: Number(item.qtyOrdered) || Number(item.qty) || 0,
      qtyReceived: Number(item.qtyReceived ?? item.qtyOrdered ?? item.qty ?? 0),
      unitCost: Number(item.unitCost ?? item.hargaBeli ?? item.price ?? 0),
      lotNumber: item.lotNumber,
      expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
      note: item.note,
    }));
  }

  private buildVendorBillItems(items: any[]) {
    if (!items || !items.length) throw new BadRequestException('Item tagihan harus diisi');
    return items.map((item) => ({
      productId: item.productId,
      nama: item.nama ?? item.description ?? item.name ?? 'Item',
      qty: Number(item.qty) || 1,
      unitPrice: Number(item.unitPrice ?? item.hargaBeli ?? item.price ?? 0),
      subtotal: Number(item.subtotal ?? ((Number(item.qty) || 1) * Number(item.unitPrice ?? item.hargaBeli ?? item.price ?? 0))),
      landedCost: Number(item.landedCost ?? 0),
    }));
  }

  private buildPurchaseReturnItems(items: any[]) {
    if (!items || !items.length) throw new BadRequestException('Item retur pembelian harus diisi');
    return items.map((item) => ({
      productId: item.productId,
      nama: item.nama ?? item.description ?? item.name ?? 'Item',
      qty: Number(item.qty) || 1,
      unitPrice: Number(item.unitPrice ?? item.hargaBeli ?? item.price ?? 0),
      subtotal: Number(item.subtotal ?? ((Number(item.qty) || 1) * Number(item.unitPrice ?? item.hargaBeli ?? item.price ?? 0))),
    }));
  }

  async generatePONumber(): Promise<string> {
    return this.generateNumber('PO', 'purchaseOrder');
  }

  async getRfqs(query: any) {
    const { search, status, supplierId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.noRfq = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    const [data, total] = await Promise.all([
      this.prisma.requestForQuotation.findMany({
        where,
        skip,
        take: Number(limit),
        include: { supplier: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.requestForQuotation.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getRfq(id: string) {
    const rfq = await this.prisma.requestForQuotation.findUnique({
      where: { id },
      include: { supplier: true, items: { include: { product: true } } },
    });
    if (!rfq) throw new NotFoundException('RFQ tidak ditemukan');
    return rfq;
  }

  async createRfq(dto: any) {
    const { items, ...rfqData } = dto;
    const rfqItems = this.buildRfqItems(items ?? []);
    const noRfq = await this.generateRFQNumber();
    return this.prisma.requestForQuotation.create({
      data: { ...rfqData, noRfq, items: { create: rfqItems } },
      include: { supplier: true, items: { include: { product: true } } },
    });
  }

  async updateRfq(id: string, dto: any) {
    const { items, ...rfqData } = dto;
    const updateData: any = { ...rfqData };
    if (items) {
      const rfqItems = this.buildRfqItems(items);
      updateData.items = { deleteMany: {}, create: rfqItems };
    }
    return this.prisma.requestForQuotation.update({ where: { id }, data: updateData });
  }

  async deleteRfq(id: string) {
    return this.prisma.requestForQuotation.update({ where: { id }, data: { status: 'cancelled' } });
  }

  async convertRfqToPo(id: string, dto: any = {}) {
    const rfq = await this.prisma.requestForQuotation.findUnique({ where: { id }, include: { items: true } });
    if (!rfq) throw new NotFoundException('RFQ tidak ditemukan');
    const poDto = {
      supplierId: rfq.supplierId,
      tanggal: dto.tanggal ?? new Date(),
      tanggalKirim: dto.tanggalKirim,
      note: dto.note,
      items: rfq.items.map((item) => ({
        productId: item.productId,
        nama: item.nama,
        qty: item.qty,
        hargaBeli: item.hargaBeli,
        subtotal: item.subtotal,
      })),
    };
    const po = await this.createPurchaseOrder(poDto);
    await this.prisma.requestForQuotation.update({ where: { id }, data: { status: 'converted' } });
    return po;
  }

  async getPurchaseOrders(query: any) {
    const { search, status, supplierId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.noPo = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        skip,
        take: Number(limit),
        include: { supplier: true, warehouse: true, items: { include: { product: true } }, goodsReceipts: true, vendorBills: true, purchaseReturns: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getPurchaseOrder(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { supplier: true, warehouse: true, items: { include: { product: true } }, goodsReceipts: true, vendorBills: true, purchaseReturns: true },
    });
    if (!po) throw new NotFoundException('PO tidak ditemukan');
    return po;
  }

  async createPurchaseOrder(dto: any) {
    const { items = [], discountPercentage = 0, ...poData } = dto;
    const poItems = this.buildPurchaseOrderItems(items);
    const subtotal = poItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const discount = subtotal * (Number(discountPercentage) / 100);
    const tax = (subtotal - discount) * 0.11;
    const totalHarga = subtotal - discount + tax;
    const noPo = await this.generatePONumber();
    return this.prisma.purchaseOrder.create({
      data: { ...poData, noPo, totalHarga, items: { create: poItems } },
      include: { supplier: true, items: { include: { product: true } } },
    });
  }

  async updatePurchaseOrder(id: string, dto: any) {
    return this.prisma.purchaseOrder.update({ where: { id }, data: dto });
  }

  async approvePurchaseOrder(id: string, userId: string) {
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'approved', approvedBy: userId, approvedAt: new Date() },
    });
  }

  async submitPurchaseOrder(id: string) {
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status: 'submitted' } });
  }

  async sendPurchaseOrderEmail(id: string, dto: any = {}) {
    const po = await this.getPurchaseOrder(id);
    const email = po.supplier?.email;
    if (!email) throw new BadRequestException('Supplier belum memiliki email');
    const apiUrl = process.env.PURCHASE_EMAIL_API_URL;
    if (!apiUrl) return { skipped: true, message: 'PURCHASE_EMAIL_API_URL tidak dikonfigurasi' };
    const body = {
      to: email,
      subject: dto.subject ?? `Purchase Order ${po.noPo}`,
      text: dto.message ?? `Mohon diterbitkan PO ${po.noPo} kepada supplier. Total: ${po.totalHarga}`,
      purchaseOrder: po,
    };
    try {
      const resp = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await resp.json();
      await this.changeStatus(id, 'sent');
      return { success: true, result };
    } catch (error: any) {
      this.logger.warn('Gagal kirim email PO: ' + error.message);
      return { success: false, error: error.message };
    }
  }

  async changeStatus(id: string, status: string) {
    const allowed = ['submitted', 'sent', 'approved', 'partial', 'received', 'cancelled'];
    if (!allowed.includes(status)) throw new BadRequestException('Status tidak valid');
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status } });
  }

  async getGoodsReceipts(query: any) {
    const { poId, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (poId) where.purchaseOrderId = poId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.goodsReceipt.findMany({
        where,
        skip,
        take: Number(limit),
        include: { purchaseOrder: { include: { supplier: true } }, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.goodsReceipt.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getGoodsReceipt(id: string) {
    const gr = await this.prisma.goodsReceipt.findUnique({
      where: { id },
      include: { purchaseOrder: { include: { supplier: true } }, items: { include: { product: true } }, vendorBills: true, purchaseReturns: true },
    });
    if (!gr) throw new NotFoundException('Goods receipt tidak ditemukan');
    return gr;
  }

  async createGoodsReceipt(dto: any) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id: dto.purchaseOrderId }, include: { items: true } });
    if (!po) throw new NotFoundException('PO tidak ditemukan untuk GR');
    const noGr = await this.generateGRNumber();
    const grItems = this.buildGoodsReceiptItems(dto.items ?? po.items.map((item) => ({ productId: item.productId, nama: item.nama, qtyOrdered: item.qty, qtyReceived: item.qty, unitCost: item.hargaBeli })));
    return this.prisma.goodsReceipt.create({
      data: { ...dto, noGr, items: { create: grItems } },
      include: { items: true },
    });
  }

  async receiveGoodsReceipt(id: string, dto: any) {
    const gr = await this.prisma.goodsReceipt.findUnique({
      where: { id },
      include: { items: true, purchaseOrder: { include: { items: true } } },
    });
    if (!gr) throw new NotFoundException('Goods receipt tidak ditemukan');
    if (gr.status !== 'draft' && gr.status !== 'submitted') throw new BadRequestException('Goods receipt hanya dapat divalidasi dari status draft atau submitted');
    const tolerance = Number(dto.tolerancePercent ?? 0) / 100;
    const items = dto.items ? this.buildGoodsReceiptItems(dto.items) : gr.items.map((item) => ({
      ...item,
      qtyReceived: item.qtyReceived,
      unitCost: item.unitCost,
      lotNumber: item.lotNumber,
      expiryDate: item.expiryDate,
    }));

    await this.prisma.$transaction(async (prisma) => {
      let totalOrdered = 0;
      let totalReceived = 0;

      for (const item of items) {
        const grItem = gr.items.find((i) => i.id === item.id || i.productId === item.productId);
        if (!grItem) continue;
        const maxAllowed = Math.ceil(grItem.qtyOrdered * (1 + tolerance));
        if (item.qtyReceived > maxAllowed) throw new BadRequestException(`Qty diterima lebih besar dari toleransi untuk item ${item.nama}`);
        const receivedQty = Number(item.qtyReceived);
        totalOrdered += Number(grItem.qtyOrdered);
        totalReceived += receivedQty;

        await prisma.goodsReceiptItem.update({
          where: { id: grItem.id },
          data: {
            qtyReceived: receivedQty,
            unitCost: item.unitCost,
            lotNumber: item.lotNumber,
            expiryDate: item.expiryDate,
            note: item.note,
          },
        });

        if (grItem.productId) {
          await prisma.purchaseOrderItem.updateMany({
            where: { purchaseOrderId: gr.purchaseOrderId, productId: grItem.productId },
            data: { qtyReceived: { increment: receivedQty } },
          });
          await prisma.product.update({ where: { id: grItem.productId }, data: { stok: { increment: receivedQty } } });
          await prisma.stockMovement.create({
            data: {
              productId: grItem.productId,
              type: 'in',
              qty: receivedQty,
              note: `GR ${gr.noGr}`,
              referenceId: gr.id,
            },
          });
          if (item.lotNumber) {
            await prisma.stockLot.upsert({
              where: { productId_nomorLot: { productId: grItem.productId, nomorLot: item.lotNumber } },
              update: {
                qtySisa: { increment: receivedQty },
                unitCost: item.unitCost,
                expiryDate: item.expiryDate,
                referenceId: gr.id,
              },
              create: {
                productId: grItem.productId,
                nomorLot: item.lotNumber,
                expiryDate: item.expiryDate,
                qtyAwal: receivedQty,
                qtySisa: receivedQty,
                unitCost: item.unitCost,
                referenceId: gr.id,
              },
            });
          }
        }
      }

      const grStatus = totalReceived >= totalOrdered ? 'received' : 'partial';
      await prisma.goodsReceipt.update({ where: { id: gr.id }, data: { status: grStatus } });
      await prisma.purchaseOrder.update({
        where: { id: gr.purchaseOrderId },
        data: { status: grStatus === 'received' ? 'received' : 'partial' },
      });
    });

    return this.getGoodsReceipt(id);
  }

  async getVendorBills(query: any) {
    const { search, status, supplierId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.noBill = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    const [data, total] = await Promise.all([
      this.prisma.vendorBill.findMany({ where, skip, take: Number(limit), include: { supplier: true, items: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.vendorBill.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getVendorBill(id: string) {
    const bill = await this.prisma.vendorBill.findUnique({
      where: { id },
      include: { supplier: true, purchaseOrder: true, goodsReceipt: true, items: true },
    });
    if (!bill) throw new NotFoundException('Vendor bill tidak ditemukan');
    return bill;
  }

  async createVendorBill(dto: any) {
    const { goodsReceiptId, purchaseOrderId, items, landedCosts = [], dueDays = 30, ...billData } = dto;
    let supplierId = dto.supplierId;
    let sourceItems = items;

    if (goodsReceiptId) {
      const gr = await this.prisma.goodsReceipt.findUnique({ where: { id: goodsReceiptId }, include: { purchaseOrder: true, items: true } });
      if (!gr) throw new NotFoundException('Goods receipt tidak ditemukan');
      supplierId = gr.purchaseOrder.supplierId;
      sourceItems = gr.items.map((item) => ({ productId: item.productId, nama: item.nama, qty: item.qtyReceived, unitPrice: item.unitCost, subtotal: Number(item.unitCost) * item.qtyReceived }));
    }

    if (purchaseOrderId && !sourceItems) {
      const po = await this.prisma.purchaseOrder.findUnique({ where: { id: purchaseOrderId }, include: { items: true } });
      if (!po) throw new NotFoundException('PO tidak ditemukan');
      supplierId = po.supplierId;
      sourceItems = po.items.map((item) => ({ productId: item.productId, nama: item.nama, qty: item.qtyReceived || item.qty, unitPrice: item.hargaBeli, subtotal: item.subtotal }));
    }

    const billItems = this.buildVendorBillItems(sourceItems ?? []);
    const amounts = this.calculateTotals([...billItems, ...landedCosts.map((cost: any) => ({ subtotal: cost.amount, landedCost: 0 }))]);
    const totalAmount = amounts.total + landedCosts.reduce((sum: number, cost: any) => sum + Number(cost.amount || 0), 0);
    const noBill = await this.generateBillNumber();

    return this.prisma.vendorBill.create({
      data: {
        ...billData,
        noBill,
        supplierId,
        purchaseOrderId,
        goodsReceiptId,
        totalAmount,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : new Date(Date.now() + dueDays * 86400000),
        items: { create: billItems },
      },
      include: { supplier: true, items: true },
    });
  }

  async matchVendorBill(id: string) {
    const bill = await this.prisma.vendorBill.findUnique({
      where: { id },
      include: { purchaseOrder: { include: { items: true } }, goodsReceipt: { include: { items: true } }, items: true },
    });
    if (!bill) throw new NotFoundException('Vendor bill tidak ditemukan');

    const poTotal = bill.purchaseOrder?.totalHarga ?? 0;
    const grReceived = bill.goodsReceipt?.items.reduce((sum, item) => sum + item.qtyReceived, 0) ?? 0;
    const billTotal = bill.totalAmount;

    const compareItems = (source: any[] = [], target: any[] = []) => {
      return source.map((item) => {
        const matched = target.find((t) => t.productId === item.productId || t.nama === item.nama);
        return {
          productId: item.productId,
          nama: item.nama,
          sourceQty: item.qty ?? item.qtyOrdered ?? 0,
          targetQty: matched?.qty ?? matched?.qtyReceived ?? 0,
          sourceAmount: Number(item.subtotal ?? 0),
          targetAmount: Number(matched?.subtotal ?? 0),
        };
      });
    };

    return {
      purchaseOrder: { total: poTotal, items: compareItems(bill.purchaseOrder?.items ?? [], bill.items) },
      goodsReceipt: { totalReceived: grReceived, items: compareItems(bill.goodsReceipt?.items ?? [], bill.items) },
      vendorBill: { total: billTotal, items: bill.items },
      balance: {
        poVsBill: Number(billTotal) - Number(poTotal),
        grVsBill: Number(billTotal) - Number(bill.goodsReceipt?.items.reduce((sum, item) => sum + Number(item.subtotal ?? 0), 0) ?? 0),
      },
    };
  }

  async getPurchaseReturns(query: any) {
    const { supplierId, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (supplierId) where.supplierId = supplierId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.purchaseReturn.findMany({ where, skip, take: Number(limit), include: { supplier: true, items: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.purchaseReturn.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getPurchaseReturn(id: string) {
    const ret = await this.prisma.purchaseReturn.findUnique({ where: { id }, include: { supplier: true, items: true } });
    if (!ret) throw new NotFoundException('Purchase return tidak ditemukan');
    return ret;
  }

  async createPurchaseReturn(dto: any) {
    const { purchaseOrderId, goodsReceiptId, items, note, status = 'draft', ...data } = dto;
    let supplierId = dto.supplierId;

    if (purchaseOrderId) {
      const po = await this.prisma.purchaseOrder.findUnique({ where: { id: purchaseOrderId } });
      if (!po) throw new NotFoundException('PO tidak ditemukan');
      supplierId = po.supplierId;
    }

    if (goodsReceiptId) {
      const gr = await this.prisma.goodsReceipt.findUnique({ where: { id: goodsReceiptId }, include: { purchaseOrder: true, items: true } });
      if (!gr) throw new NotFoundException('Goods receipt tidak ditemukan');
      supplierId = gr.purchaseOrder.supplierId;
    }

    const itemsToCreate = this.buildPurchaseReturnItems(items ?? []);
    const totals = this.calculateTotals(itemsToCreate);
    const noReturn = await this.generateReturnNumber();
    return this.prisma.purchaseReturn.create({
      data: {
        ...data,
        noReturn,
        supplierId,
        purchaseOrderId,
        goodsReceiptId,
        status,
        totalAmount: totals.total,
        note,
        items: { create: itemsToCreate },
      },
      include: { supplier: true, items: true },
    });
  }

  async getSupplierRatings(supplierId: string) {
    return this.prisma.supplierRating.findMany({ where: { supplierId }, orderBy: { createdAt: 'desc' } });
  }

  async rateSupplier(supplierId: string, dto: any) {
    return this.prisma.supplierRating.create({ data: { ...dto, supplierId } });
  }

  async compareSupplierQuotes(query: any) {
    const productIds = String(query.productIds ?? '').split(',').map((id: string) => id.trim()).filter(Boolean);
    if (!productIds.length) throw new BadRequestException('productIds harus diisi');
    const rfqs = await this.prisma.requestForQuotation.findMany({
      where: { items: { some: { productId: { in: productIds } } } },
      include: { supplier: true, items: true },
    });
    const grouped = rfqs.reduce((acc: any, rfq) => {
      const supplierId = rfq.supplierId;
      const matchedItems = rfq.items.filter((item) => productIds.includes(item.productId ?? ''));
      const total = matchedItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
      if (!acc[supplierId]) {
        acc[supplierId] = { supplier: rfq.supplier, supplierId, rfqs: [], total: 0, items: [] };
      }
      acc[supplierId].rfqs.push(rfq);
      acc[supplierId].items.push(...matchedItems);
      acc[supplierId].total += total;
      return acc;
    }, {} as Record<string, any>);
    return Object.values(grouped).map((entry) => ({
      supplierId: entry.supplierId,
      supplier: entry.supplier,
      total: entry.total,
      items: entry.items,
      rfqCount: entry.rfqs.length,
    }));
  }

  async getStats() {
    const [total, pending, approved] = await Promise.all([
      this.prisma.purchaseOrder.count(),
      this.prisma.purchaseOrder.count({ where: { status: 'draft' } }),
      this.prisma.purchaseOrder.count({ where: { status: 'approved' } }),
    ]);
    const totalValue = await this.prisma.purchaseOrder.aggregate({ _sum: { totalHarga: true } });
    return { total, pending, approved, totalValue: totalValue._sum.totalHarga ?? 0 };
  }

  async getSuppliers(query: any) {
    const { search, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { active: true };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({ where, skip, take: Number(limit), orderBy: { name: 'asc' } }),
      this.prisma.supplier.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createSupplier(dto: any) { return this.prisma.supplier.create({ data: dto }); }
  async updateSupplier(id: string, dto: any) { return this.prisma.supplier.update({ where: { id }, data: dto }); }
  async deleteSupplier(id: string) { return this.prisma.supplier.update({ where: { id }, data: { active: false } }); }

  async cancelPurchaseOrder(id: string) {
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status: 'cancelled' } });
  }

  async getSupplier(id: string) {
    const data = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        purchaseOrders: { orderBy: { createdAt: 'desc' }, take: 5 },
        ratings: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!data) throw new NotFoundException('Supplier tidak ditemukan');
    return { data, message: 'success' };
  }

  async getDeliveryNote(id: string) {
    const gr = await this.prisma.goodsReceipt.findUnique({
      where: { id },
      include: { purchaseOrder: { include: { supplier: true, items: true } }, items: { include: { product: true } } },
    });
    if (!gr) throw new NotFoundException('Goods receipt tidak ditemukan');
    return {
      noGr: gr.noGr,
      tanggal: gr.tanggal,
      status: gr.status,
      purchaseOrder: gr.purchaseOrder,
      supplier: gr.purchaseOrder?.supplier,
      items: gr.items,
      note: gr.note,
    };
  }
}

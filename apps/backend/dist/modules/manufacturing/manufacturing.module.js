var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ManufacturingController } from './manufacturing.controller.js';
import { ManufacturingService } from './manufacturing.service.js';
import { PrismaService } from '../../database/prisma.service.js';
let ManufacturingModule = class ManufacturingModule {
};
ManufacturingModule = __decorate([
    Module({ controllers: [ManufacturingController], providers: [ManufacturingService, PrismaService], exports: [ManufacturingService] })
], ManufacturingModule);
export { ManufacturingModule };

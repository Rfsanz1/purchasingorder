var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto) {
        return this.authService.login(dto.email, dto.password);
    }
    async logout(user) {
        return this.authService.logout(user?.sub ?? user?.id ?? '');
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto.email);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto.token, dto.password);
    }
    async changePassword(user, dto) {
        return this.authService.changePassword(user?.sub ?? user?.id, dto.oldPassword, dto.newPassword);
    }
    async refresh(payload) {
        return this.authService.refreshToken(payload.refreshToken);
    }
    async me(user) {
        return user;
    }
};
__decorate([
    Post('login'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Login pengguna' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({ status: 200, description: 'Login berhasil — accessToken, refreshToken, user.' }),
    ApiResponse({ status: 400, description: 'Validasi gagal.' }),
    ApiResponse({ status: 401, description: 'Kredensial tidak valid.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('logout'),
    HttpCode(HttpStatus.OK),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('access-token'),
    ApiOperation({ summary: 'Logout — invalidate session' }),
    ApiResponse({ status: 200, description: 'Logout berhasil.' }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    Post('forgot-password'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Kirim link reset password ke email' }),
    ApiResponse({ status: 200, description: 'Email reset dikirim (jika terdaftar).' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    Post('reset-password'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Reset password dengan token' }),
    ApiResponse({ status: 200, description: 'Password berhasil direset.' }),
    ApiResponse({ status: 400, description: 'Token tidak valid / kadaluarsa.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    Post('change-password'),
    HttpCode(HttpStatus.OK),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('access-token'),
    ApiOperation({ summary: 'Ganti password (user yang sedang login)' }),
    ApiResponse({ status: 200, description: 'Password berhasil diubah.' }),
    ApiResponse({ status: 401, description: 'Password lama salah.' }),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    Post('refresh'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Refresh access token' }),
    ApiResponse({ status: 200, description: 'Token baru.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('me'),
    ApiBearerAuth('access-token'),
    ApiOperation({ summary: 'Profil pengguna aktif' }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
AuthController = __decorate([
    ApiTags('auth'),
    Controller('auth'),
    __param(0, Inject(AuthService)),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };

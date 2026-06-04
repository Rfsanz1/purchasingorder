import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login pengguna', description: 'Autentikasi dengan email dan password, mengembalikan JWT token.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login berhasil — mengembalikan accessToken, refreshToken, dan data user.' })
  @ApiResponse({ status: 400, description: 'Validasi gagal — email atau password kosong/tidak valid.' })
  @ApiResponse({ status: 401, description: 'Kredensial tidak valid.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token', description: 'Tukar refresh token dengan access token baru.' })
  @ApiResponse({ status: 200, description: 'Token berhasil diperbarui.' })
  @ApiResponse({ status: 401, description: 'Refresh token tidak valid atau kadaluarsa.' })
  async refresh(@Body() payload: { refreshToken: string }) {
    return this.authService.refreshToken(payload.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Profil pengguna aktif', description: 'Mengembalikan data pengguna yang sedang login.' })
  @ApiResponse({ status: 200, description: 'Data profil pengguna.' })
  @ApiResponse({ status: 401, description: 'Token tidak valid atau tidak ada.' })
  async me(@CurrentUser() user: any) {
    return user;
  }
}

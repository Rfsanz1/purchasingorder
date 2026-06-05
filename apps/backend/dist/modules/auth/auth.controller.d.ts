import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        token: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            roles: string[];
            permissions: string[];
        };
        appRedirect: string;
    }>;
    logout(user: any): Promise<{
        message: string;
        data: any;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        data: {
            token: string;
            expiresAt: Date;
        };
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
        data: any;
    }>;
    changePassword(user: any, dto: ChangePasswordDto): Promise<{
        message: string;
        data: any;
    }>;
    refresh(payload: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    me(user: any): Promise<any>;
}

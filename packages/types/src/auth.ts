export type UserRole = 'ADMIN' | 'OWNER' | 'SALES' | 'GUDANG' | 'DRIVER' | 'KASIR';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: UserRole[];
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export const ROLE_APP_MAP: Record<string, UserRole[]> = {
  web:        ['ADMIN', 'OWNER'],
  'sales-app':  ['SALES', 'ADMIN', 'OWNER'],
  'gudang-app': ['GUDANG', 'ADMIN', 'OWNER'],
  'driver-app': ['DRIVER', 'ADMIN', 'OWNER'],
  'pos-app':    ['KASIR', 'ADMIN', 'OWNER'],
};

export interface CanAccessOptions {
    roles?: string[];
    permissions?: string[];
}
export declare function canAccess(user: any, options?: CanAccessOptions): boolean;

export declare const CAN_ACCESS_KEY = "can-access";
export type CanAccessOptions = {
    roles?: string[];
    permissions?: string[];
};
export declare const CanAccess: (options?: CanAccessOptions) => import("@nestjs/common").CustomDecorator<string>;

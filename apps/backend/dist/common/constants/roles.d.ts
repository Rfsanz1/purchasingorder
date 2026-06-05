export declare const ERP_ROLES: readonly ["Super Admin", "Owner", "Admin", "Sales", "Gudang", "Driver"];
export type ErpRole = (typeof ERP_ROLES)[number];
export declare const ERP_ROLE_GROUPS: {
    ownerAdmin: readonly ["Super Admin", "Owner", "Admin"];
    sales: readonly ["Sales", "Super Admin", "Owner", "Admin"];
    gudang: readonly ["Gudang", "Super Admin", "Owner", "Admin"];
    driver: readonly ["Driver", "Super Admin", "Owner", "Admin"];
};

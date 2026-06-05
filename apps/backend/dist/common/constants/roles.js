export const ERP_ROLES = ['Super Admin', 'Owner', 'Admin', 'Sales', 'Gudang', 'Driver'];
export const ERP_ROLE_GROUPS = {
    ownerAdmin: ['Super Admin', 'Owner', 'Admin'],
    sales: ['Sales', 'Super Admin', 'Owner', 'Admin'],
    gudang: ['Gudang', 'Super Admin', 'Owner', 'Admin'],
    driver: ['Driver', 'Super Admin', 'Owner', 'Admin'],
};

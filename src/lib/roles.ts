export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    EDITOR: 'editor',
    CUSTOMER: 'customer'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Check if a user has at least the required role access
 * Hierarchy: super_admin > admin > manager > editor > customer
 */
export function hasRole(userRole: string, requiredRole: UserRole): boolean {
    const roleHierarchy = [ROLES.CUSTOMER, ROLES.EDITOR, ROLES.MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN];
    const userRoleIndex = roleHierarchy.indexOf(userRole as UserRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex;
}

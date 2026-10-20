import type { Access, FieldAccess } from 'payload'

export const ROLES = ['superadmin', 'admin'] as const
export type Role = (typeof ROLES)[number]

/** Super admin: everything, including accounts, website content, enquiries and deleting */
export const isSuperAdmin: Access = ({ req: { user } }) =>
  user?.role === 'superadmin' && !user.blocked

/**
 * Anyone signed in to the panel whose account is not blocked: the super admin, or an admin,
 * who enters rates and manages videos and store products
 */
export const isStaff: Access = ({ req: { user } }) =>
  (user?.role === 'superadmin' || user?.role === 'admin') && !user.blocked

export const anyone: Access = () => true

export const nobody: Access = () => false

export const isSuperAdminField: FieldAccess = ({ req: { user } }) =>
  user?.role === 'superadmin' && !user.blocked

/** A field only hooks may write */
export const nobodyField: FieldAccess = () => false

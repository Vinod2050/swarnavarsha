import type { CollectionConfig } from 'payload'

import { isSuperAdmin, nobody } from '@/access'

/**
 * Activity log: who signed in and who changed accounts, rates and videos.
 * Rows are written only by the hooks in src/hooks/audit.ts and cannot be edited in the panel.
 */
export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: { singular: 'Activity', plural: 'Activity log' },
  admin: {
    group: 'Settings',
    hidden: ({ user }) => user?.role !== 'superadmin',
    useAsTitle: 'target',
    defaultColumns: ['createdAt', 'actor', 'action', 'target'],
    description: 'A record of sign-ins and important changes. It cannot be edited.',
  },
  defaultSort: '-createdAt',
  access: {
    read: isSuperAdmin,
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Sign in', value: 'login' },
        { label: 'Created', value: 'create' },
        { label: 'Updated', value: 'update' },
        { label: 'Deleted', value: 'delete' },
        { label: 'Exported', value: 'export' },
        { label: 'Requested', value: 'request' },
      ],
    },
    // Email as text, not a relationship, so the row survives when the account is deleted
    { name: 'actor', label: 'Done by', type: 'text', required: true, index: true },
    { name: 'target', label: 'What', type: 'text', required: true },
  ],
}

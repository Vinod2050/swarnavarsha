import type { CollectionConfig } from 'payload'

import { anyone, isSuperAdmin } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Website content',
    hidden: ({ user }) => user?.role !== 'superadmin',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
  },
  defaultSort: 'order',
  access: { read: anyone, create: isSuperAdmin, update: isSuperAdmin, delete: isSuperAdmin },
  hooks: {
    afterChange: [revalidateCollection('services')],
    afterDelete: [revalidateCollectionDelete('services')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Matches the page URL, for example sell-gold.' },
    },
    { name: 'summary', type: 'textarea', required: true, localized: true },
    { name: 'body', type: 'richText', localized: true },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'coins',
      options: ['coins', 'landmark', 'gem'],
    },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
  ],
}

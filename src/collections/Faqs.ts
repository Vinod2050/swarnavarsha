import type { CollectionConfig } from 'payload'

import { anyone, isSuperAdmin } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    group: 'Website content',
    hidden: ({ user }) => user?.role !== 'superadmin',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'showOnHome'],
  },
  defaultSort: 'order',
  access: { read: anyone, create: isSuperAdmin, update: isSuperAdmin, delete: isSuperAdmin },
  hooks: {
    afterChange: [revalidateCollection('faqs')],
    afterDelete: [revalidateCollectionDelete('faqs')],
  },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    { name: 'answer', type: 'textarea', required: true, localized: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Selling gold & silver', value: 'selling' },
        { label: 'Pledged gold', value: 'pledged' },
        { label: 'Buying 24K gold', value: 'buying' },
        { label: 'General', value: 'general' },
      ],
    },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
    { name: 'showOnHome', type: 'checkbox', defaultValue: false },
  ],
}

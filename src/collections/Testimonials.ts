import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Website content',
    hidden: ({ user }) => user?.role !== 'superadmin',
    useAsTitle: 'name',
    defaultColumns: ['name', 'area', 'rating', 'consentConfirmed'],
    description: 'Only real customer reviews. The customer must agree to be shown on the website.',
  },
  access: {
    // Visitors only ever see reviews where consent is confirmed
    read: ({ req: { user } }) => (user ? true : { consentConfirmed: { equals: true } }),
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  hooks: {
    afterChange: [revalidateCollection('testimonials')],
    afterDelete: [revalidateCollectionDelete('testimonials')],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'area',
      type: 'text',
      localized: true,
      admin: { description: 'For example Chinchwad.' },
    },
    { name: 'text', type: 'textarea', required: true, localized: true },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5, defaultValue: 5 },
    {
      name: 'consentConfirmed',
      label: 'The customer has agreed to show this review on the website',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

import type { GlobalConfig } from 'payload'

import { anyone, isSuperAdmin } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings', hidden: ({ user }) => user?.role !== 'superadmin' },
  access: { read: anyone, update: isSuperAdmin },
  hooks: { afterChange: [revalidateGlobal('settings')] },
  fields: [
    {
      name: 'phones',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'display',
          type: 'text',
          required: true,
          admin: { description: '+91 91567 81981' },
        },
        { name: 'tel', type: 'text', required: true, admin: { description: '+919156781981' } },
      ],
    },
    {
      name: 'whatsapp',
      type: 'text',
      required: true,
      admin: { description: 'Country code and number without + or spaces: 919156781981' },
    },
    { name: 'address', type: 'textarea', required: true, localized: true },
    { name: 'mapEmbedUrl', type: 'text' },
    { name: 'mapLinkUrl', type: 'text' },
    { name: 'openingHours', type: 'text', localized: true },
    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'notificationEmail',
      type: 'email',
      admin: { description: 'New enquiries are emailed to this address.' },
    },
    {
      name: 'showSilver',
      label: 'Show silver rate on the website',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

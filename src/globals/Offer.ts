import type { GlobalConfig } from 'payload'

import { anyone, isSuperAdmin } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Offer: GlobalConfig = {
  slug: 'offer',
  admin: { group: 'Website content', hidden: ({ user }) => user?.role !== 'superadmin' },
  access: { read: anyone, update: isSuperAdmin },
  hooks: { afterChange: [revalidateGlobal('offer')] },
  fields: [
    {
      name: 'active',
      label: 'Show the offer on the website',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'text',
      type: 'text',
      localized: true,
      admin: { description: 'For example: 5% off on 24K gold on the 1st and 3rd Saturday.' },
    },
    { name: 'days', type: 'text', admin: { description: 'For example: 1st and 3rd Saturday.' } },
  ],
}

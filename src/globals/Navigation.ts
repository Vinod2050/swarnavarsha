import type { GlobalConfig } from 'payload'

import { anyone, isSuperAdmin } from '@/access'
import { NAV_HREFS } from '@/components/layout/nav'
import { revalidateGlobal } from '@/hooks/revalidate'

/**
 * Order and labels of the main menu. Pages are picked from the fixed list of site routes,
 * so the menu can never point at a page that does not exist.
 *
 * Design phase: the header still reads NAV_ITEMS and the `nav` messages directly.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Settings', hidden: ({ user }) => user?.role !== 'superadmin' },
  access: { read: anyone, update: isSuperAdmin },
  hooks: { afterChange: [revalidateGlobal('navigation')] },
  fields: [
    {
      name: 'items',
      type: 'array',
      maxRows: NAV_HREFS.length,
      admin: { description: 'Main menu, in the order shown on the website.' },
      fields: [
        {
          name: 'page',
          type: 'select',
          required: true,
          options: NAV_HREFS.map((href) => ({ label: href, value: href })),
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: 'Leave empty to use the standard menu label.' },
        },
      ],
    },
  ],
}

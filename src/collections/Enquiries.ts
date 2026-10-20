import type { CollectionConfig, PayloadHandler } from 'payload'

import { isSuperAdmin, nobody } from '@/access'
import { recordAudit } from '@/hooks/audit'
import { SERVICE_OPTIONS, TIME_OPTIONS } from '@/lib/schemas'

const SERVICE_LABELS: Record<(typeof SERVICE_OPTIONS)[number], string> = {
  sell_gold: 'Sell gold',
  sell_silver: 'Sell silver',
  release_pledged: 'Release pledged gold',
  buy_gold: 'Buy 24K gold',
  other: 'Other',
}

const CSV_COLUMNS = [
  'createdAt',
  'status',
  'name',
  'mobile',
  'service',
  'preferredTime',
  'message',
  'locale',
] as const

/** Quotes a value for CSV. A leading ' stops spreadsheet apps running visitor text as a formula. */
function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

const BOM = String.fromCharCode(0xfeff)

/** GET /api/enquiries/export — every enquiry as a CSV file, newest first. Staff only. */
const exportCsv: PayloadHandler = async (req) => {
  const role = req.user?.role
  if (role !== 'superadmin' && role !== 'admin') {
    return Response.json({ message: 'Not allowed' }, { status: 403 })
  }
  // Every customer's name and mobile leaves the panel here, so it goes in the activity log
  await recordAudit(req, 'export', 'All enquiries (CSV)')

  const { docs } = await req.payload.find({
    collection: 'enquiries',
    sort: '-createdAt',
    pagination: false,
    depth: 0,
    req,
  })

  const rows = [
    CSV_COLUMNS.join(','),
    ...docs.map((doc) => CSV_COLUMNS.map((column) => csvCell(doc[column])).join(',')),
  ]
  const today = new Date().toISOString().slice(0, 10)

  // The BOM makes Excel read Marathi text as UTF-8
  return new Response(`${BOM}${rows.join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="enquiries-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    group: 'Daily work',
    hidden: ({ user }) => user?.role !== 'superadmin',
    components: {
      beforeListTable: ['/components/admin/ExportEnquiries#ExportEnquiries'],
    },
    useAsTitle: 'name',
    defaultColumns: ['name', 'mobile', 'service', 'status', 'createdAt'],
    listSearchableFields: ['name', 'mobile'],
  },
  defaultSort: '-createdAt',
  access: {
    // Created only by the enquiry Server Action through the Local API (overrideAccess)
    create: nobody,
    read: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  endpoints: [{ path: '/export', method: 'get', handler: exportCsv }],
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'name', type: 'text', required: true, maxLength: 100 },
    { name: 'mobile', type: 'text', required: true, maxLength: 10 },
    {
      name: 'service',
      type: 'select',
      required: true,
      options: SERVICE_OPTIONS.map((value) => ({ label: SERVICE_LABELS[value], value })),
    },
    {
      name: 'preferredTime',
      type: 'select',
      options: TIME_OPTIONS.map((value) => ({ label: value, value })),
    },
    { name: 'message', type: 'textarea', maxLength: 1000 },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Marathi', value: 'mr' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      // SHA-256 of the visitor IP with a secret salt; used only for rate limiting
      name: 'ipHash',
      type: 'text',
      index: true,
      admin: { hidden: true },
    },
  ],
}

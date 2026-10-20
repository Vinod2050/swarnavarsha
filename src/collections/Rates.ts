import type { CollectionConfig, PayloadRequest } from 'payload'

import { anyone, isStaff, isSuperAdmin } from '@/access'
import { auditChange, auditDelete } from '@/hooks/audit'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

// The date is stored as midnight India time, so it is read back in India time
const rateDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' })

const titleDay = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** "15 Oct 2026 · Buying": the name the panel shows for a row (tab, breadcrumb, messages) */
const rateLabel = (rateDate: unknown, type: unknown) =>
  rateDate
    ? `${titleDay.format(new Date(String(rateDate)))} · ${type === 'selling' ? 'Selling' : 'Buying'}`
    : undefined

const describeRate = (doc: Record<string, unknown>) =>
  `Rate ${rateDay.format(new Date(String(doc.rateDate)))} (${doc.type}): 24K ₹${doc.gold24k999}, silver ₹${doc.silverKg}`

type RateField = 'gold24k999' | 'gold22k' | 'gold18k' | 'silverKg'

/** Pre-fills the create form with the most recent row so staff only change what moved. */
const fromLatest =
  (field: RateField) =>
  async ({ req }: { req: PayloadRequest }): Promise<number | undefined> => {
    const { docs } = await req.payload.find({
      collection: 'daily-rates',
      sort: '-rateDate',
      limit: 1,
      depth: 0,
      req,
    })
    const value = docs[0]?.[field]
    return typeof value === 'number' ? value : undefined
  }

const money = (name: RateField, label: string, description: string) =>
  ({
    name,
    label,
    type: 'number',
    required: true,
    min: 0,
    defaultValue: fromLatest(name),
    admin: {
      description,
      step: 1,
      width: '50%',
      components: { Cell: '/components/admin/RateCell#RateCell' },
    },
  }) as const

/**
 * Slug is `daily-rates` (not `rates`) so Payload's REST route does not collide with the
 * public cached endpoint at GET /api/rates.
 */
export const Rates: CollectionConfig = {
  slug: 'daily-rates',
  labels: { singular: 'Rate', plural: 'Rates' },
  admin: {
    group: 'Daily work',
    // A date field as the title shows as a raw UTC timestamp, so a readable label is stored
    useAsTitle: 'label',
    defaultColumns: ['rateDate', 'type', 'gold24k999', 'gold22k', 'gold18k', 'silverKg'],
    description:
      'Enter today’s gold and silver rates. The form opens with the last rates filled in, so change only what moved. The website updates within seconds.',
    components: { beforeList: ['/components/admin/RatesHeader#RatesHeader'] },
  },
  defaultSort: '-rateDate',
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isSuperAdmin,
  },
  indexes: [{ fields: ['rateDate', 'type'], unique: true }],
  hooks: {
    afterChange: [revalidateCollection('rates'), auditChange(describeRate)],
    afterDelete: [revalidateCollectionDelete('rates'), auditDelete(describeRate)],
  },
  // Rows only arrange the form (two boxes side by side); the stored fields are unchanged
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'rateDate',
          label: 'Date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString().slice(0, 10),
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'buying',
          options: [
            { label: 'Buying (we buy from customers)', value: 'buying' },
            { label: 'Selling (we sell to customers)', value: 'selling' },
          ],
          admin: {
            width: '50%',
            description: 'The website shows the buying rate.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        money('gold24k999', 'Gold 24K (999)', '₹ per gram'),
        money('gold22k', 'Gold 22K', '₹ per gram'),
      ],
    },
    {
      type: 'row',
      fields: [money('gold18k', 'Gold 18K', '₹ per gram'), money('silverKg', 'Silver', '₹ per kg')],
    },
    {
      name: 'note',
      type: 'text',
      localized: true,
      admin: { description: 'Optional short note shown under the rates.' },
    },
    {
      name: 'label',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        // Always rebuilt from the date and type, so whatever is sent for it is ignored
        beforeChange: [
          ({ siblingData, originalDoc }) =>
            rateLabel(
              siblingData.rateDate ?? originalDoc?.rateDate,
              siblingData.type ?? originalDoc?.type,
            ),
        ],
      },
    },
  ],
}

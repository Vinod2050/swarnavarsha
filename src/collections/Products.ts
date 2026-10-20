import type { CollectionConfig, Field } from 'payload'

import { isStaff } from '@/access'
import { auditChange, auditDelete } from '@/hooks/audit'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

/** The product's name for the activity log, whatever language the panel saved it in. */
const productName = (doc: Record<string, unknown>): string => {
  const { name, code, id } = doc
  if (typeof name === 'string' && name) return `${name} (${String(code ?? '')})`
  if (name && typeof name === 'object') {
    const byLocale = name as Record<string, unknown>
    const named = byLocale.en ?? byLocale.mr
    if (typeof named === 'string' && named) return `${named} (${String(code ?? '')})`
  }
  return typeof code === 'string' && code ? code : `#${String(id)}`
}

/** A heading with an icon inside the form. A `ui` field: nothing is saved for it. */
const section = (
  name: string,
  clientProps: { icon: string; step?: number; title: string; text?: string },
  position?: 'sidebar',
): Field => ({
  name,
  type: 'ui',
  admin: {
    ...(position && { position }),
    components: { Field: { path: '/components/admin/FormSection#FormSection', clientProps } },
  },
})

/**
 * Products for the Online Store page (/store): 24K coins, bars and biscuits. The store is a
 * catalogue with "Book on WhatsApp", not a shop: no cart or payment (CLAUDE.md Section 2).
 * Added on 2026-10-19 at Finixsoft's request; admins may add, edit and delete products.
 *
 * Decision D-08: products are physical gold only, never an investment plan or scheme.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Store product', plural: 'Store products' },
  admin: {
    group: 'Daily work',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'weightGrams', 'price', 'active', 'order'],
    listSearchableFields: ['name', 'code'],
    // One table with every product and its actions: edit, show or hide, price, delete
    components: {
      views: { list: { Component: '/components/admin/ProductsListView#ProductsListView' } },
    },
    description:
      'Products on the Online Store page. Write the name and description in English, then switch the language (top right) to मराठी and write them in Marathi too.',
  },
  defaultSort: 'order',
  access: {
    // Visitors only get products that are switched on
    read: ({ req: { user } }) => (user ? true : { active: { equals: true } }),
    create: isStaff,
    update: isStaff,
    // Admins manage products fully: deletes are kept in the activity log
    delete: isStaff,
  },
  hooks: {
    afterChange: [
      revalidateCollection('products'),
      auditChange((doc) => `Store product "${productName(doc)}"`),
    ],
    afterDelete: [
      revalidateCollectionDelete('products'),
      auditDelete((doc) => `Store product "${productName(doc)}"`),
    ],
  },
  fields: [
    section('photoSection', {
      icon: 'camera',
      step: 1,
      title: 'Product photo',
      text: 'A clear, bright photo of the coin or bar on a plain background.',
    }),
    {
      name: 'image',
      label: 'Product photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        // One "Upload photo" button that opens the file picker and uploads straight away
        components: { Field: '/components/admin/PhotoUploadField#PhotoUploadField' },
      },
    },
    section('textSection', {
      icon: 'text',
      step: 2,
      title: 'Name and description',
      text: 'Write in English first, then switch the language (top right) to मराठी.',
    }),
    {
      name: 'name',
      label: 'Product name',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 80,
      admin: { description: 'For example: 24K Gold Coin, 10 g' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 300,
      admin: {
        description:
          'One or two short sentences. For example: A 10 g 24K (999) coin. BIS Hallmark and HUID certified.',
      },
    },
    section('detailsSection', {
      icon: 'tag',
      step: 3,
      title: 'Category and code',
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'coin',
          options: [
            { label: 'Coin', value: 'coin' },
            { label: 'Bar', value: 'bar' },
            { label: 'Biscuit', value: 'biscuit' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'code',
          label: 'Product code',
          type: 'text',
          required: true,
          unique: true,
          maxLength: 30,
          admin: {
            width: '50%',
            description: 'Your own code, sent in the WhatsApp booking. For example: SG-C-010',
          },
        },
      ],
    },
    section('priceSection', {
      icon: 'rupee',
      step: 4,
      title: 'Weight and price',
      text: 'Update the price whenever the gold rate changes.',
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'weightGrams',
          label: 'Weight (grams)',
          type: 'number',
          required: true,
          min: 0.1,
          max: 1000,
          admin: { width: '50%', step: 0.1, className: 'sg-unit sg-unit--grams' },
        },
        {
          name: 'price',
          label: 'Price (₹)',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            width: '50%',
            step: 1,
            className: 'sg-unit sg-unit--rupee',
            description: 'Price shown on the website, in rupees.',
            components: { Cell: '/components/admin/RateCell#RateCell' },
          },
        },
      ],
    },
    section(
      'visibilitySection',
      {
        icon: 'eye',
        title: 'On the website',
        text: 'Switch off to hide the product without deleting it.',
      },
      'sidebar',
    ),
    {
      name: 'active',
      label: 'Show on the website',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', components: { Cell: '/components/admin/StatusCell#LiveCell' } },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Lower numbers are shown first.' },
    },
  ],
}

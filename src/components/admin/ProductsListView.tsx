import { Gutter } from '@payloadcms/ui'
import type { ListViewServerProps } from 'payload'

import type { Media, Product } from '@/payload-types'

import { ProductsTable, type ProductRow } from './ProductsTable'

const thumbOf = (image: Product['image']): string | null => {
  if (!image || typeof image !== 'object') return null
  const media = image as Media
  return media.sizes?.thumb?.url ?? media.url ?? null
}

/**
 * Store products list (2026-10-20): one table with every product and its actions in the
 * row: edit, show or hide, change the price, delete. Replaces Payload's own list for
 * `products`; the store holds a few dozen products at most, so all are loaded at once.
 */
export async function ProductsListView({ payload, user, locale }: ListViewServerProps) {
  const { docs } = await payload.find({
    collection: 'products',
    sort: 'order',
    limit: 500,
    depth: 1,
    locale: locale?.code === 'mr' ? 'mr' : 'en',
    fallbackLocale: 'en',
    overrideAccess: false,
    user,
  })

  const rows: ProductRow[] = docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    description: doc.description,
    code: doc.code,
    category: doc.category,
    weightGrams: doc.weightGrams,
    price: doc.price,
    active: Boolean(doc.active),
    order: doc.order,
    thumb: thumbOf(doc.image),
  }))

  return (
    <Gutter className="sg-products">
      <ProductsTable rows={rows} adminRoute={payload.config.routes.admin} />
    </Gutter>
  )
}

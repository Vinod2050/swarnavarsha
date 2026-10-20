'use client'

import { toast, useConfig, useLocale } from '@payloadcms/ui'
import {
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  ImageOff,
  LoaderCircle,
  PackagePlus,
  Pencil,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useMemo, useState } from 'react'

export type ProductRow = {
  id: number
  name: string
  description: string
  code: string
  category: 'coin' | 'bar' | 'biscuit'
  weightGrams: number
  price: number
  active: boolean
  order: number
  thumb: string | null
}

const CATEGORY: Record<ProductRow['category'], string> = {
  coin: 'Coin',
  bar: 'Bar',
  biscuit: 'Biscuit',
}

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

type Busy = { id: number; action: 'price' | 'visibility' | 'delete' } | null

/**
 * Store products table: every product with its photo, details and price, and the actions in
 * the row. Changes go to the REST API as the signed-in user, so the usual access rules,
 * activity log and website refresh hooks all run.
 */
export function ProductsTable({
  rows: initial,
  adminRoute,
}: {
  rows: ProductRow[]
  adminRoute: string
}) {
  const router = useRouter()
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig()
  const base = `${serverURL}${api}/products`
  const { code: locale } = useLocale()

  const [rows, setRows] = useState(initial)
  const [prices, setPrices] = useState<Record<number, string>>({})
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState<Busy>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) =>
      [row.name, row.code, CATEGORY[row.category]].some((text) => text.toLowerCase().includes(q)),
    )
  }, [rows, query])

  const liveCount = rows.filter((row) => row.active).length

  const send = async (id: number, init: RequestInit) => {
    const res = await fetch(`${base}/${id}?locale=${locale}&depth=0`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as {
        errors?: { message?: string }[]
      } | null
      throw new Error(json?.errors?.[0]?.message ?? 'Something went wrong. Please try again.')
    }
  }

  const savePrice = async (row: ProductRow, event?: FormEvent) => {
    event?.preventDefault()
    const draft = prices[row.id]
    const price = Math.round(Number(draft))
    if (draft === undefined || !Number.isFinite(price) || price < 1) {
      toast.error('Enter a price of at least ₹1.')
      return
    }
    setBusy({ id: row.id, action: 'price' })
    try {
      await send(row.id, { method: 'PATCH', body: JSON.stringify({ price }) })
      setRows((all) => all.map((item) => (item.id === row.id ? { ...item, price } : item)))
      setPrices(({ [row.id]: _saved, ...rest }) => rest)
      toast.success(`Price of "${row.name}" is now ${rupees.format(price)}.`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The price could not be saved.')
    } finally {
      setBusy(null)
    }
  }

  const toggleVisibility = async (row: ProductRow) => {
    const active = !row.active
    setBusy({ id: row.id, action: 'visibility' })
    try {
      await send(row.id, { method: 'PATCH', body: JSON.stringify({ active }) })
      setRows((all) => all.map((item) => (item.id === row.id ? { ...item, active } : item)))
      toast.success(
        active
          ? `"${row.name}" is on the website again.`
          : `"${row.name}" is hidden from the website.`,
      )
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The change could not be saved.')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (row: ProductRow) => {
    setBusy({ id: row.id, action: 'delete' })
    try {
      await send(row.id, { method: 'DELETE' })
      setRows((all) => all.filter((item) => item.id !== row.id))
      setConfirmDelete(null)
      toast.success(`"${row.name}" was deleted.`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The product could not be deleted.')
    } finally {
      setBusy(null)
    }
  }

  const isBusy = (id: number, action?: NonNullable<Busy>['action']) =>
    busy?.id === id && (!action || busy.action === action)

  return (
    <div className="sg-products__wrap">
      <header className="sg-products__head">
        <div>
          <h1 className="sg-products__title">Store products</h1>
          <p className="sg-products__summary">
            {rows.length === 0
              ? 'No products yet. The Online Store page shows sample products until you add one.'
              : `${rows.length} ${rows.length === 1 ? 'product' : 'products'} · ${liveCount} on the website · ${rows.length - liveCount} hidden`}
          </p>
        </div>
        <div className="sg-products__head-actions">
          <a href="/store" target="_blank" rel="noreferrer" className="sg-products__ghost">
            <ExternalLink aria-hidden size={16} />
            View store
          </a>
          <Link
            href={`${adminRoute}/collections/products/create`}
            className="sg-dash__button sg-products__add"
          >
            <PackagePlus aria-hidden size={18} />
            Add product
          </Link>
        </div>
      </header>

      {rows.length > 0 && (
        <label className="sg-products__search">
          <Search aria-hidden size={18} />
          <span className="sg-sr-only">Search products</span>
          <input
            type="search"
            value={query}
            placeholder="Search by name, code or category"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      )}

      {rows.length === 0 ? (
        <div className="sg-products__empty">
          <span aria-hidden className="sg-photo__badge">
            <PackagePlus size={28} strokeWidth={1.5} />
          </span>
          <p className="sg-photo__title">Add your first product</p>
          <p className="sg-photo__hint">Photo, name, description, weight and price.</p>
          <Link href={`${adminRoute}/collections/products/create`} className="sg-dash__button">
            <PackagePlus aria-hidden size={18} />
            Add product
          </Link>
        </div>
      ) : shown.length === 0 ? (
        <p className="sg-products__none">No product matches “{query}”.</p>
      ) : (
        <div className="sg-products__table-wrap">
          <table className="sg-products__table">
            <thead>
              <tr>
                <th scope="col">Photo</th>
                <th scope="col">Product</th>
                <th scope="col">Weight</th>
                <th scope="col">Price</th>
                <th scope="col">On website</th>
                <th scope="col">
                  <span className="sg-sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => {
                const draft = prices[row.id]
                const priceChanged = draft !== undefined && Number(draft) !== row.price
                const editUrl = `${adminRoute}/collections/products/${row.id}`
                return (
                  <tr key={row.id} className={row.active ? undefined : 'is-hidden'}>
                    <td className="sg-products__photo">
                      {row.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                        <img src={row.thumb} alt="" width={72} height={54} />
                      ) : (
                        <span className="sg-products__nophoto">
                          <ImageOff aria-hidden size={20} />
                        </span>
                      )}
                    </td>
                    <td className="sg-products__product">
                      <Link href={editUrl} className="sg-products__name">
                        {row.name}
                      </Link>
                      <span className="sg-products__meta">
                        <span className="sg-products__chip">{CATEGORY[row.category]}</span>
                        {row.code}
                      </span>
                    </td>
                    <td className="sg-products__weight" data-label="Weight">
                      {row.weightGrams} g
                    </td>
                    <td className="sg-products__price" data-label="Price">
                      <form
                        onSubmit={(event) => savePrice(row, event)}
                        className="sg-products__price-form"
                      >
                        <span className="sg-products__rupee" aria-hidden>
                          ₹
                        </span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          step={1}
                          aria-label={`Price of ${row.name} in rupees`}
                          value={draft ?? String(row.price)}
                          disabled={isBusy(row.id)}
                          onChange={(event) =>
                            setPrices((all) => ({ ...all, [row.id]: event.target.value }))
                          }
                        />
                        {priceChanged && (
                          <>
                            <button
                              type="submit"
                              className="sg-icon-btn sg-icon-btn--save"
                              disabled={isBusy(row.id)}
                              title="Save price"
                            >
                              {isBusy(row.id, 'price') ? (
                                <LoaderCircle aria-hidden size={16} className="sg-photo__spin" />
                              ) : (
                                <Check aria-hidden size={16} />
                              )}
                              <span className="sg-sr-only">Save price</span>
                            </button>
                            <button
                              type="button"
                              className="sg-icon-btn"
                              disabled={isBusy(row.id)}
                              title="Undo"
                              onClick={() => setPrices(({ [row.id]: _undo, ...rest }) => rest)}
                            >
                              <X aria-hidden size={16} />
                              <span className="sg-sr-only">Undo price change</span>
                            </button>
                          </>
                        )}
                      </form>
                    </td>
                    <td className="sg-products__status" data-label="On website">
                      <button
                        type="button"
                        className={['sg-toggle', row.active && 'is-on'].filter(Boolean).join(' ')}
                        role="switch"
                        aria-checked={row.active}
                        aria-label={`Show ${row.name} on the website`}
                        disabled={isBusy(row.id)}
                        onClick={() => toggleVisibility(row)}
                      >
                        <span className="sg-toggle__track">
                          <span className="sg-toggle__thumb" />
                        </span>
                        <span className="sg-toggle__text">
                          {isBusy(row.id, 'visibility') ? (
                            <LoaderCircle aria-hidden size={14} className="sg-photo__spin" />
                          ) : row.active ? (
                            <Eye aria-hidden size={14} />
                          ) : (
                            <EyeOff aria-hidden size={14} />
                          )}
                          {row.active ? 'Shown' : 'Hidden'}
                        </span>
                      </button>
                    </td>
                    <td className="sg-products__actions">
                      {confirmDelete === row.id ? (
                        <div
                          className="sg-products__confirm"
                          role="group"
                          aria-label={`Delete ${row.name}?`}
                        >
                          <span>Delete?</span>
                          <button
                            type="button"
                            className="sg-photo__btn sg-photo__btn--danger sg-products__btn"
                            disabled={isBusy(row.id)}
                            onClick={() => remove(row)}
                          >
                            {isBusy(row.id, 'delete') ? (
                              <LoaderCircle aria-hidden size={16} className="sg-photo__spin" />
                            ) : (
                              <Trash2 aria-hidden size={16} />
                            )}
                            Yes, delete
                          </button>
                          <button
                            type="button"
                            className="sg-photo__btn sg-products__btn"
                            disabled={isBusy(row.id)}
                            onClick={() => setConfirmDelete(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="sg-products__buttons">
                          <Link href={editUrl} className="sg-photo__btn sg-products__btn">
                            <Pencil aria-hidden size={16} />
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="sg-photo__btn sg-photo__btn--danger sg-products__btn"
                            disabled={isBusy(row.id)}
                            onClick={() => setConfirmDelete(row.id)}
                          >
                            <Trash2 aria-hidden size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

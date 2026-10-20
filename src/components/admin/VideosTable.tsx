'use client'

import { toast, useConfig, useLocale } from '@payloadcms/ui'
import {
  Clapperboard,
  ExternalLink,
  Eye,
  EyeOff,
  LoaderCircle,
  Pencil,
  Play,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'

export type VideoRow = {
  id: number
  title: string
  filename: string | null
  filesize: number | null
  url: string | null
  mimeType: string | null
  poster: string | null
  active: boolean
  createdAt: string
  /** Feedback videos only */
  customerName?: string | null
  consent?: boolean
}

export type VideoKind = 'advert' | 'feedback'

// What changes between the two kinds of video
const KIND = {
  advert: {
    slug: 'videos',
    title: 'Advertisement videos',
    empty: 'Add your first advertisement',
    search: 'Search by title or file name',
  },
  feedback: {
    slug: 'feedback-videos',
    title: 'Customer feedback videos',
    empty: 'Add your first customer video',
    search: 'Search by title, customer or file name',
  },
} as const

type Busy = { id: number; action: 'visibility' | 'delete' } | null

const formatSize = (bytes: number | null) => {
  if (!bytes) return null
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`
}

// Newest first, the same order the home page uses
const newestFirst = (a: VideoRow, b: VideoRow) =>
  b.createdAt.localeCompare(a.createdAt) || b.id - a.id

const added = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
})

/**
 * Video table (advertisements and customer feedback): thumbnail with a play button, title,
 * whether the home page shows it, and the actions in the row. A feedback video shows only
 * once the customer's consent is ticked; consent is changed in the form, never with one click. Changes go to the REST API as the signed-in user,
 * so the usual access rules, activity log and website refresh hooks all run.
 */
export function VideosTable({
  rows: initial,
  adminRoute,
  limit,
  kind = 'advert',
}: {
  rows: VideoRow[]
  adminRoute: string
  limit: number
  kind?: VideoKind
}) {
  const text = KIND[kind]
  const isFeedback = kind === 'feedback'
  const router = useRouter()
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig()
  const { code: locale } = useLocale()
  const base = `${serverURL}${api}/${text.slug}`

  const [rows, setRows] = useState(() => [...initial].sort(newestFirst))
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState<Busy>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [playing, setPlaying] = useState<VideoRow | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // The home page shows the `limit` newest videos that are switched on (and, for customer
  // feedback, have the customer's consent)
  const liveIds = useMemo(
    () =>
      new Set(
        rows
          .filter((row) => row.active && (!isFeedback || Boolean(row.consent)))
          .slice(0, limit)
          .map((row) => row.id),
      ),
    [rows, limit, isFeedback],
  )

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) =>
      [row.title, row.filename ?? '', row.customerName ?? ''].some((text) =>
        text.toLowerCase().includes(q),
      ),
    )
  }, [rows, query])

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

  const toggleVisibility = async (row: VideoRow) => {
    const active = !row.active
    setBusy({ id: row.id, action: 'visibility' })
    try {
      await send(row.id, { method: 'PATCH', body: JSON.stringify({ active }) })
      setRows((all) => all.map((item) => (item.id === row.id ? { ...item, active } : item)))
      toast.success(
        active ? `"${row.title}" is switched on.` : `"${row.title}" is hidden from the website.`,
      )
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The change could not be saved.')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (row: VideoRow) => {
    setBusy({ id: row.id, action: 'delete' })
    try {
      await send(row.id, { method: 'DELETE' })
      setRows((all) => all.filter((item) => item.id !== row.id))
      setConfirmDelete(null)
      toast.success(`"${row.title}" was deleted.`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The video could not be deleted.')
    } finally {
      setBusy(null)
    }
  }

  const play = (row: VideoRow) => {
    setPlaying(row)
    dialogRef.current?.showModal()
  }

  const closePlayer = () => {
    dialogRef.current?.close()
    setPlaying(null)
  }

  const isBusy = (id: number, action?: NonNullable<Busy>['action']) =>
    busy?.id === id && (!action || busy.action === action)

  const liveCount = liveIds.size
  const onCount = rows.filter((row) => row.active).length

  return (
    <div className="sg-products__wrap">
      <header className="sg-products__head">
        <div>
          <h1 className="sg-products__title">{text.title}</h1>
          <p className="sg-products__summary">
            {rows.length === 0
              ? `No videos yet. The home page shows the first ${limit} that are switched on.`
              : `${rows.length} ${rows.length === 1 ? 'video' : 'videos'} · ${liveCount} on the home page · ${rows.length - onCount} hidden`}
          </p>
        </div>
        <div className="sg-products__head-actions">
          <a href="/" target="_blank" rel="noreferrer" className="sg-products__ghost">
            <ExternalLink aria-hidden size={16} />
            View home page
          </a>
          <Link
            href={`${adminRoute}/collections/${text.slug}/create`}
            className="sg-dash__button sg-products__add"
          >
            <Clapperboard aria-hidden size={18} />
            Add video
          </Link>
        </div>
      </header>

      {rows.length > 0 && (
        <>
          <p className="sg-videos__note">
            The home page shows the {limit} newest videos that are switched on
            {isFeedback && ' and have the customer’s consent'}. A new upload goes first; switch an
            old one off to bring the next one back.
          </p>
          <label className="sg-products__search">
            <Search aria-hidden size={18} />
            <span className="sg-sr-only">Search videos</span>
            <input
              type="search"
              value={query}
              placeholder={text.search}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </>
      )}

      {rows.length === 0 ? (
        <div className="sg-products__empty">
          <span aria-hidden className="sg-photo__badge">
            <Clapperboard size={28} strokeWidth={1.5} />
          </span>
          <p className="sg-photo__title">{text.empty}</p>
          <p className="sg-photo__hint">MP4 or WebM, up to 100 MB.</p>
          <Link href={`${adminRoute}/collections/${text.slug}/create`} className="sg-dash__button">
            <Clapperboard aria-hidden size={18} />
            Add video
          </Link>
        </div>
      ) : shown.length === 0 ? (
        <p className="sg-products__none">No video matches “{query}”.</p>
      ) : (
        <div className="sg-products__table-wrap">
          <table
            className={[
              'sg-products__table sg-videos__table',
              isFeedback && 'sg-videos__table--feedback',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <thead>
              <tr>
                <th scope="col">Video</th>
                <th scope="col">Title</th>
                <th scope="col">Added</th>
                {isFeedback && <th scope="col">Consent</th>}
                <th scope="col">On website</th>
                <th scope="col">Home page</th>
                <th scope="col">
                  <span className="sg-sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => {
                const editUrl = `${adminRoute}/collections/${text.slug}/${row.id}`
                const live = liveIds.has(row.id)
                const meta = [
                  isFeedback ? row.customerName : null,
                  row.filename,
                  formatSize(row.filesize),
                ]
                  .filter(Boolean)
                  .join(' · ')
                return (
                  <tr key={row.id} className={row.active ? undefined : 'is-hidden'}>
                    <td className="sg-products__photo">
                      <button
                        type="button"
                        className="sg-videos__thumb"
                        disabled={!row.url}
                        onClick={() => play(row)}
                        aria-label={`Play ${row.title}`}
                      >
                        {row.poster ? (
                          // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                          <img src={row.poster} alt="" />
                        ) : row.url ? (
                          <video src={`${row.url}#t=0.5`} muted playsInline preload="metadata" />
                        ) : null}
                        <span aria-hidden className="sg-videos__play">
                          <Play size={14} fill="currentColor" />
                        </span>
                      </button>
                    </td>
                    <td className="sg-products__product">
                      <Link href={editUrl} className="sg-products__name">
                        {row.title || 'Untitled video'}
                      </Link>
                      {meta && <span className="sg-products__meta">{meta}</span>}
                    </td>
                    <td className="sg-videos__added" data-label="Added">
                      {added.format(new Date(row.createdAt))}
                    </td>
                    {isFeedback && (
                      <td className="sg-videos__consent" data-label="Consent">
                        {row.consent ? (
                          <span className="sg-pill sg-pill--ok">
                            <ShieldCheck aria-hidden size={14} />
                            Given
                          </span>
                        ) : (
                          <span
                            className="sg-pill sg-pill--bad"
                            title="Tick the consent box in the form"
                          >
                            <ShieldAlert aria-hidden size={14} />
                            Not yet
                          </span>
                        )}
                      </td>
                    )}
                    <td className="sg-products__status" data-label="On website">
                      <button
                        type="button"
                        className={['sg-toggle', row.active && 'is-on'].filter(Boolean).join(' ')}
                        role="switch"
                        aria-checked={row.active}
                        aria-label={`Show ${row.title} on the website`}
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
                          {row.active ? 'On' : 'Off'}
                        </span>
                      </button>
                    </td>
                    <td className="sg-videos__live" data-label="Home page">
                      {live ? (
                        <span className="sg-pill sg-pill--ok">
                          <span className="sg-pill__dot" />
                          Showing
                        </span>
                      ) : row.active && isFeedback && !row.consent ? (
                        <span className="sg-pill sg-pill--bad" title="Shown once consent is ticked">
                          <span className="sg-pill__dot" />
                          Needs consent
                        </span>
                      ) : row.active ? (
                        <span
                          className="sg-pill sg-pill--warn"
                          title={`Only the ${limit} newest are shown`}
                        >
                          <span className="sg-pill__dot" />
                          Waiting
                        </span>
                      ) : (
                        <span className="sg-pill sg-pill--muted">
                          <span className="sg-pill__dot" />
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="sg-products__actions">
                      {confirmDelete === row.id ? (
                        <div
                          className="sg-products__confirm"
                          role="group"
                          aria-label={`Delete ${row.title}?`}
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

      {/* Player: opens over the page, Esc or the close button shuts it */}
      <dialog
        ref={dialogRef}
        className="sg-videos__dialog"
        aria-label={playing ? `Playing ${playing.title}` : 'Video player'}
        onClose={() => setPlaying(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePlayer()
        }}
      >
        {playing?.url && (
          <div className="sg-videos__dialog-body">
            <div className="sg-videos__dialog-head">
              <p>{playing.title}</p>
              <button type="button" className="sg-icon-btn" onClick={closePlayer}>
                <X aria-hidden size={18} />
                <span className="sg-sr-only">Close</span>
              </button>
            </div>
            <video controls autoPlay playsInline className="sg-videos__player">
              <source src={playing.url} type={playing.mimeType ?? undefined} />
            </video>
          </div>
        )}
      </dialog>
    </div>
  )
}

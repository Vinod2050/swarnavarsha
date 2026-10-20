'use client'

import {
  FieldError,
  FieldLabel,
  useConfig,
  useLocale,
  useField,
  useFormFields,
} from '@payloadcms/ui'
import { CheckCircle2, ImagePlus, LoaderCircle, RefreshCw, Trash2, Upload } from 'lucide-react'
import type { UploadFieldClientProps } from 'payload'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'

type MediaDoc = {
  id: number | string
  url?: string | null
  filename?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  sizes?: { card?: { url?: string | null }; thumb?: { url?: string | null } }
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif'
const MAX_BYTES = 8 * 1024 * 1024

const previewUrl = (doc: MediaDoc | null) =>
  doc?.sizes?.card?.url ?? doc?.sizes?.thumb?.url ?? doc?.url ?? null

const formatSize = (bytes?: number | null) => {
  if (!bytes) return null
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`
}

/**
 * Product photo with one "Upload photo" button: it opens the computer's (or phone's) file
 * picker and uploads the chosen photo straight away (Media collection, files in videos/photos).
 * Replaces Payload's "Create New / Choose from existing / drag and drop" box.
 */
type Props = UploadFieldClientProps & {
  /** Heading inside the empty box, and the line under it (set per form with clientProps) */
  emptyTitle?: string
  hint?: string
}

export function PhotoUploadField({
  field,
  path: pathProp,
  emptyTitle = 'Add a product photo',
  hint = 'JPEG, PNG or WebP · up to 8 MB · shown in a 4:3 frame',
}: Props) {
  const path = pathProp ?? field.name
  const { value, setValue, showError } = useField<number | string | null>({ path })
  // The photo description is taken from the product name or the video title
  const productName = useFormFields(([fields]) => fields.name?.value ?? fields.title?.value)
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig()
  const apiBase = `${serverURL}${api}`
  // The photo description is saved in the language the panel is showing
  const { code: locale } = useLocale()

  const inputRef = useRef<HTMLInputElement>(null)
  const [doc, setDoc] = useState<MediaDoc | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Show the photo already saved on the product
  useEffect(() => {
    if (!value || (doc && doc.id === value)) return
    let cancelled = false
    fetch(`${apiBase}/media/${value}?depth=0`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((found: MediaDoc | null) => {
        if (!cancelled) setDoc(found)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [value, doc, apiBase])

  const openPicker = () => inputRef.current?.click()

  const onPick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!ACCEPT.split(',').includes(file.type)) {
      setError('Use a JPEG, PNG, WebP or AVIF photo.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('The photo is too large. Use a photo under 8 MB.')
      return
    }

    setBusy(true)
    setError(null)
    try {
      const alt =
        (typeof productName === 'string' && productName.trim()) || file.name.replace(/\.[^.]+$/, '')
      const body = new FormData()
      body.append('file', file)
      body.append('_payload', JSON.stringify({ alt }))
      const res = await fetch(`${apiBase}/media?locale=${locale}&depth=0`, {
        method: 'POST',
        body,
        credentials: 'include',
      })
      const json = (await res.json()) as { doc?: MediaDoc; errors?: { message?: string }[] }
      if (!res.ok || !json.doc) {
        throw new Error(json.errors?.[0]?.message ?? 'The photo could not be uploaded.')
      }
      setDoc(json.doc)
      setValue(json.doc.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The photo could not be uploaded.')
    } finally {
      setBusy(false)
    }
  }

  const src = value ? previewUrl(doc) : null
  const meta = [
    doc?.width && doc?.height ? `${doc.width} × ${doc.height}` : null,
    formatSize(doc?.filesize),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className={['field-type sg-photo', showError && 'error'].filter(Boolean).join(' ')}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <FieldError path={path} showError={showError} />
      <input
        ref={inputRef}
        id={`field-${path}`}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={onPick}
      />

      {value ? (
        <div className="sg-photo__card">
          <div className="sg-photo__frame">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element -- small admin preview
              <img src={src} alt="" className="sg-photo__img" />
            ) : (
              <LoaderCircle aria-hidden className="sg-photo__spin" size={28} />
            )}
            {busy && (
              <span className="sg-photo__overlay">
                <LoaderCircle aria-hidden className="sg-photo__spin" size={28} />
              </span>
            )}
          </div>
          <div className="sg-photo__info">
            <p className="sg-photo__status">
              <CheckCircle2 aria-hidden size={18} />
              Photo added
            </p>
            {doc?.filename && <p className="sg-photo__name">{doc.filename}</p>}
            {meta && <p className="sg-photo__meta">{meta}</p>}
            <div className="sg-photo__actions">
              <button type="button" className="sg-photo__btn" disabled={busy} onClick={openPicker}>
                <RefreshCw aria-hidden size={16} />
                {busy ? 'Uploading…' : 'Change photo'}
              </button>
              <button
                type="button"
                className="sg-photo__btn sg-photo__btn--danger"
                disabled={busy}
                onClick={() => {
                  setValue(null)
                  setDoc(null)
                }}
              >
                <Trash2 aria-hidden size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={['sg-photo__empty', busy && 'is-busy'].filter(Boolean).join(' ')}>
          <span aria-hidden className="sg-photo__badge">
            {busy ? (
              <LoaderCircle className="sg-photo__spin" size={30} />
            ) : (
              <ImagePlus size={30} strokeWidth={1.5} />
            )}
          </span>
          <p className="sg-photo__title">{busy ? 'Uploading photo…' : emptyTitle}</p>
          <p className="sg-photo__hint">{hint}</p>
          <button
            type="button"
            className="sg-photo__btn sg-photo__btn--primary"
            disabled={busy}
            onClick={openPicker}
          >
            <Upload aria-hidden size={18} />
            Upload photo
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="sg-photo__error">
          {error}
        </p>
      )}
    </div>
  )
}

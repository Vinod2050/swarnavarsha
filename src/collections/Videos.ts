import type {
  CollectionAfterDeleteHook,
  CollectionBeforeDeleteHook,
  CollectionConfig,
  Field,
  Where,
} from 'payload'

import { isStaff } from '@/access'
import { auditChange, recordAudit } from '@/hooks/audit'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { VIDEO_LIMITS } from '@/lib/content'
import { storagePath } from '@/lib/storage'

// Uploaded files live under uploads/ (in STORAGE_DIR, see lib/storage.ts), apart from any source
// files kept in the project, so a file with the same name never gets renamed to "-1"
const upload = (folder: string) => ({
  mimeTypes: ['video/mp4', 'video/webm'],
  staticDir: storagePath(`uploads/${folder}`),
})

const title: Field = {
  name: 'title',
  type: 'text',
  required: true,
  localized: true,
  admin: { description: 'Shown under the video. Write it in English and in Marathi.' },
}

/**
 * The video's name for the activity log. The panel deletes without a language, so the title
 * can arrive as { en, mr } or not at all; the file name is the last resort.
 */
const videoName = (doc: Record<string, unknown>): string => {
  const { title, filename, id } = doc
  if (typeof title === 'string' && title) return title
  if (title && typeof title === 'object') {
    const byLocale = title as Record<string, unknown>
    const named = byLocale.en ?? byLocale.mr
    if (typeof named === 'string' && named) return named
  }
  return typeof filename === 'string' && filename ? filename : `#${String(id)}`
}

/**
 * Deletes from the panel hand the after-delete hook a document without its translated title,
 * so the name for the activity log is read (in every language) before the row goes.
 */
const rememberName: CollectionBeforeDeleteHook = async ({ collection, context, id, req }) => {
  const saved = await req.payload.findByID({
    collection: collection.slug as 'videos' | 'feedback-videos',
    id,
    locale: 'all',
    depth: 0,
    overrideAccess: true,
    // Not given `req`: a call that shares the request switches its language to "all" and
    // replaces its context, which would lose the name before the after-delete hook runs
  })
  // Keyed by id: one bulk delete shares a single context across all its videos
  context[`videoName:${id}`] = videoName(saved as unknown as Record<string, unknown>)
}

const auditVideoDelete =
  (label: string): CollectionAfterDeleteHook =>
  async ({ context, doc, id, req }) => {
    const remembered = context[`videoName:${id}`]
    const name = typeof remembered === 'string' ? remembered : videoName(doc)
    await recordAudit(req, 'delete', `${label} "${name}"`)
    return doc
  }

// A player for the saved file at the top of the form (stores nothing)
const preview: Field = {
  name: 'preview',
  type: 'ui',
  admin: { components: { Field: '/components/admin/VideoPreview#VideoPreview' } },
}

// Cover image, on/off switch and order: the same on both kinds of video
const display: Field[] = [
  {
    name: 'poster',
    label: 'Cover image',
    type: 'upload',
    relationTo: 'media',
    admin: { description: 'Optional. Shown before the video plays.' },
  },
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
]

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

// Cover image as one "Upload photo" card, like the Store product photo
const coverImage: Field = {
  name: 'poster',
  label: 'Cover image',
  type: 'upload',
  relationTo: 'media',
  admin: {
    components: {
      Field: {
        path: '/components/admin/PhotoUploadField#PhotoUploadField',
        clientProps: {
          emptyTitle: 'Add a cover image',
          hint: 'Optional · JPEG, PNG or WebP · up to 8 MB',
        },
      },
    },
  },
}

// No order number (2026-10-20): the newest videos come first. The column is kept, hidden,
// so no database change is needed
const switchAndHiddenOrder: Field[] = display
  .filter((field) => 'name' in field && field.name !== 'poster')
  .map((field) =>
    'name' in field && field.name === 'order'
      ? ({ ...field, admin: { ...field.admin, hidden: true } } as Field)
      : field,
  )

// Advertisement form (2026-10-20): numbered sections, and the cover image as one
// "Upload photo" card like the Store product photo. Step 1 (the file) is VideoUpload.
const advertFields: Field[] = [
  preview,
  section('titleSection', {
    icon: 'text',
    step: 2,
    title: 'Title',
    text: 'Shown under the video. Write it in English, then switch the language (top right) to मराठी.',
  }),
  // The section heading above already says how to fill it in
  { ...title, admin: {} },
  section('coverSection', {
    icon: 'image',
    step: 3,
    title: 'Cover image',
    text: 'Optional. Shown before the video plays; without one the first frame is shown.',
  }),
  coverImage,
  section(
    'visibilitySection',
    {
      icon: 'eye',
      title: 'On the website',
      text: `The home page shows the ${VIDEO_LIMITS.advert} newest videos that are switched on.`,
    },
    'sidebar',
  ),
  ...switchAndHiddenOrder,
]

/**
 * Advertisement videos: everything uploaded here goes to the "Advertisements" section of the
 * home page.
 *
 * Decision D-08: no video may promote an investment scheme, returns or a lucky draw.
 */
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Advertisement video', plural: 'Advertisement videos' },
  admin: {
    group: 'Daily work',
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'createdAt'],
    description: `Videos for the “Advertisements” section of the home page. MP4 or WebM, up to 100 MB each. The website shows the ${VIDEO_LIMITS.advert} newest that are switched on.`,
    components: {
      // Heading above the upload box, and one table with the actions in each row
      edit: { Upload: '/components/admin/VideoUpload#VideoUpload' },
      views: { list: { Component: '/components/admin/VideosListView#VideosListView' } },
    },
  },
  defaultSort: '-createdAt',
  access: {
    // Visitors (and the file URL) only get videos that are switched on
    read: ({ req: { user } }) => (user ? true : { active: { equals: true } }),
    create: isStaff,
    update: isStaff,
    // Admins manage videos fully: add, change and delete (deletes are kept in the activity log)
    delete: isStaff,
  },
  hooks: {
    afterChange: [
      revalidateCollection('videos'),
      auditChange((doc) => `Advertisement video "${videoName(doc)}"`),
    ],
    beforeDelete: [rememberName],
    afterDelete: [revalidateCollectionDelete('videos'), auditVideoDelete('Advertisement video')],
  },
  upload: upload('videos'),
  fields: advertFields,
}

const withConsent: Where = {
  and: [{ active: { equals: true } }, { consentConfirmed: { equals: true } }],
}

/**
 * Customer feedback videos: everything uploaded here goes to the "Customer feedback" section
 * of the home page, once the customer's consent is ticked.
 *
 * Section 8.3: a feedback video must show a real customer who agreed to appear on the website.
 */
export const FeedbackVideos: CollectionConfig = {
  slug: 'feedback-videos',
  labels: { singular: 'Customer feedback video', plural: 'Customer feedback videos' },
  admin: {
    group: 'Daily work',
    useAsTitle: 'title',
    defaultColumns: ['title', 'customerName', 'consentConfirmed', 'active', 'createdAt'],
    description: `Videos for the “Customer feedback” section of the home page. MP4 or WebM, up to 100 MB each. The website shows the ${VIDEO_LIMITS.feedback} newest that are switched on and have the customer's consent.`,
    components: {
      // Same form and table as the advertisements, with the customer and consent added
      edit: { Upload: '/components/admin/VideoUpload#VideoUpload' },
      views: { list: { Component: '/components/admin/VideosListView#VideosListView' } },
    },
  },
  defaultSort: '-createdAt',
  access: {
    // Visitors (and the file URL) only get videos that are switched on and have consent
    read: ({ req: { user } }) => (user ? true : withConsent),
    create: isStaff,
    update: isStaff,
    // Admins manage videos fully: add, change and delete (deletes are kept in the activity log)
    delete: isStaff,
  },
  hooks: {
    afterChange: [
      revalidateCollection('videos'),
      auditChange((doc) => `Customer feedback video "${videoName(doc)}"`),
    ],
    beforeDelete: [rememberName],
    afterDelete: [
      revalidateCollectionDelete('videos'),
      auditVideoDelete('Customer feedback video'),
    ],
  },
  upload: upload('feedback-videos'),
  fields: [
    preview,
    section('titleSection', {
      icon: 'text',
      step: 2,
      title: 'Title',
      text: 'Shown under the video. Write it in English, then switch the language (top right) to मराठी.',
    }),
    { ...title, admin: {} },
    section('customerSection', {
      icon: 'customer',
      step: 3,
      title: 'Customer and consent',
      text: 'Only a real customer who agreed to appear on the website.',
    }),
    {
      name: 'customerName',
      label: 'Customer name',
      type: 'text',
      admin: { description: 'Optional. For example: Sunita Patil, Chinchwad' },
    },
    {
      name: 'consentConfirmed',
      label: 'The customer has agreed to show this video on the website',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'The video stays hidden from the website until this is ticked.',
        className: 'sg-consent',
        components: { Cell: '/components/admin/StatusCell#ConsentCell' },
      },
    },
    section('coverSection', {
      icon: 'image',
      step: 4,
      title: 'Cover image',
      text: 'Optional. Shown before the video plays; without one the first frame is shown.',
    }),
    coverImage,
    section(
      'visibilitySection',
      {
        icon: 'eye',
        title: 'On the website',
        text: `The home page shows the ${VIDEO_LIMITS.feedback} newest videos that are switched on and have consent.`,
      },
      'sidebar',
    ),
    ...switchAndHiddenOrder,
  ],
}

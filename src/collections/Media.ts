import { APIError, type CollectionConfig } from 'payload'

import { anyone, isStaff, isSuperAdmin } from '@/access'
import { storagePath } from '@/lib/storage'

// The upload limit in payload.config.ts is sized for videos; images get a smaller one
const MAX_IMAGE_BYTES = 8 * 1024 * 1024

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Website content', hidden: ({ user }) => user?.role !== 'superadmin' },
  access: {
    read: anyone,
    create: isStaff,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Describe the image for visitors who cannot see it.' },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (req.file && req.file.size > MAX_IMAGE_BYTES) {
          throw new APIError('The image is too large. Use an image under 8 MB.', 413)
        }
        return data
      },
    ],
  },
  upload: {
    // Photos are kept in the videos folder, next to the video uploads (requested 2026-10-20)
    staticDir: storagePath('videos/photos'),
    // No SVG: an SVG can carry scripts and would run on our own domain
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumb', width: 400, formatOptions: { format: 'webp' } },
      { name: 'card', width: 800, formatOptions: { format: 'webp' } },
      { name: 'hero', width: 1600, formatOptions: { format: 'webp' } },
      { name: 'og', width: 1200, height: 630, formatOptions: { format: 'jpeg' } },
    ],
  },
}

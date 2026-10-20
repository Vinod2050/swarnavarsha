'use client'

import { Upload, useConfig, useDocumentInfo } from '@payloadcms/ui'

import { FormSection } from './FormSection'

/**
 * Video edit form: a numbered heading above Payload's own upload box, so the form reads
 * 1 Video file, 2 Title, 3 Cover image. The box keeps all of Payload's upload behaviour.
 */
export function VideoUpload() {
  const { collectionSlug, initialState } = useDocumentInfo()
  const { getEntityConfig } = useConfig()
  const collection = collectionSlug ? getEntityConfig({ collectionSlug }) : undefined
  if (!collectionSlug || !collection || !('upload' in collection) || !collection.upload) return null

  return (
    <div className="sg-video-upload">
      <FormSection
        icon="video"
        step={1}
        title="Video file"
        text="MP4 or WebM, up to 100 MB. A short, clear video works best on phones."
      />
      <Upload
        collectionSlug={collectionSlug}
        uploadConfig={collection.upload}
        initialState={initialState}
      />
    </div>
  )
}

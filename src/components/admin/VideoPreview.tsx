'use client'

import { useDocumentInfo } from '@payloadcms/ui'

/**
 * Video edit form: a player for the saved file, so staff can watch a video before switching
 * it on or deleting it. Payload's own upload box only shows a file icon for videos.
 */
export function VideoPreview() {
  const { savedDocumentData } = useDocumentInfo()
  const url = typeof savedDocumentData?.url === 'string' ? savedDocumentData.url : null
  const type =
    typeof savedDocumentData?.mimeType === 'string' ? savedDocumentData.mimeType : undefined

  // Nothing saved yet (a new video): the upload box above is all there is
  if (!url) return null

  return (
    <div className="sg-video-preview">
      <p className="sg-video-preview__label">Preview</p>
      <video controls playsInline preload="metadata" className="sg-video-preview__player">
        <source src={url} type={type} />
      </video>
    </div>
  )
}

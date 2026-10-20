import { Clapperboard } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'
import { VideoFrame } from '@/components/ui/video-frame'
import type { Locale } from '@/i18n/routing'
import { getVideos } from '@/lib/content'
import { cn } from '@/lib/utils'

import { SectionHeading } from './SectionHeading'

type Props = {
  locale: Locale
  kind: 'adverts' | 'feedback'
  /** Leave the whole section out until a video is uploaded (the home page) */
  hideWhenEmpty?: boolean
}

/**
 * Videos uploaded in /admin. Until staff upload one, the section shows a short "coming soon"
 * note, or is left out with `hideWhenEmpty`. Advertisement videos play muted on their own while on screen; a feedback video file is
 * not downloaded until the visitor presses play.
 */
export async function VideoSection({ locale, kind, hideWhenEmpty = false }: Props) {
  const videos = (await getVideos(locale))[kind]
  if (hideWhenEmpty && videos.length === 0) return null
  const t = await getTranslations('videos')
  const id = `videos-${kind}-title`
  // Customer feedback sits on plum like the written reviews; advertisement videos on ivory
  const dark = kind === 'feedback'

  return (
    <section
      aria-labelledby={id}
      className={cn('bg-surface section-y text-ink', dark && 'theme-dark')}
    >
      <div className="container-site">
        <SectionHeading id={id} eyebrow={t(`${kind}Eyebrow`)} title={t(`${kind}Title`)} />
        {videos.length === 0 && (
          <p className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-md border border-dashed border-line-strong px-6 py-10 text-center text-ink-muted lg:short:py-6">
            <Clapperboard aria-hidden className="size-8 text-accent" strokeWidth={1.5} />
            {t(`${kind}Empty`)}
          </p>
        )}
        {/* Centred, so one or two videos sit in the middle instead of against the left edge */}
        <ul className="flex flex-wrap items-start justify-center gap-6">
          {videos.map((video, index) => (
            <li key={video.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]">
              <Reveal delay={(index % 3) * 0.08}>
                <figure
                  className={cn(
                    'hover-lift overflow-hidden rounded-md border bg-surface-raised',
                    dark ? 'border-line' : 'border-transparent shadow-card',
                  )}
                >
                  <VideoFrame
                    src={video.url}
                    mimeType={video.mimeType}
                    title={video.title}
                    poster={video.poster}
                    // Adverts play by themselves (muted); feedback waits for the visitor's tap
                    autoPlay={kind === 'adverts'}
                  />
                  <figcaption className="min-w-0 p-4">
                    <p className="t-label break-words text-ink">{video.title}</p>
                    {video.customerName && (
                      <p className="mt-1 text-sm break-words text-ink-muted">
                        {video.customerName}
                      </p>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

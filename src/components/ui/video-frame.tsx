'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type Props = {
  src: string
  mimeType: string
  title: string
  poster?: string | null
  /**
   * Plays by itself, muted and looping, while at least half of it is on screen, and pauses when
   * scrolled away. Skipped for visitors who ask for reduced motion or data saving; they get the
   * play button instead.
   */
  autoPlay?: boolean
}

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } }

/**
 * A video in a box that keeps its shape at every screen width. The box is wide (16:9) by
 * default; a video shot on a phone held upright gets a taller box once its size is known, so it
 * is not shown as a thin strip. The video is fitted inside, never cropped or stretched.
 */
export function VideoFrame({ src, mimeType, title, poster, autoPlay = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [upright, setUpright] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!autoPlay || !video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if ((navigator as SaveDataNavigator).connection?.saveData) return

    // Browsers only allow a video to start by itself when it is muted
    video.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // A blocked autoplay (e.g. low-power mode on iPhone) just leaves the play button
          video.play().catch(() => {})
        } else if (!video.paused) {
          video.pause()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [autoPlay])

  return (
    <video
      ref={ref}
      controls
      playsInline
      loop={autoPlay}
      muted={autoPlay}
      // Nothing is fetched before the video is played or scrolled into view (autoplay). Without
      // a cover image the browser fetches just enough to show the first frame
      preload={poster || autoPlay ? 'none' : 'metadata'}
      poster={poster ?? undefined}
      aria-label={title}
      onLoadedMetadata={(event) => {
        const { videoWidth, videoHeight } = event.currentTarget
        setUpright(videoHeight > videoWidth)
      }}
      // Only one video with sound at a time: starting one pauses any other that is playing
      onPlay={(event) => {
        const current = event.currentTarget
        if (current.muted) return
        document.querySelectorAll('video').forEach((other) => {
          if (other !== current && !other.paused && !other.muted) other.pause()
        })
      }}
      className={cn(
        'block w-full bg-plum-950 object-contain',
        // Capped so an upright video never grows taller than the screen it is watched on
        upright ? 'aspect-[3/4] max-h-[80dvh]' : 'aspect-video',
      )}
    >
      <source src={src} type={mimeType} />
    </video>
  )
}

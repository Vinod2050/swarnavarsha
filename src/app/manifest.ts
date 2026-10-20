import type { MetadataRoute } from 'next'

// Name, colours and icons used when the site is added to a phone's home screen
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Suvarnavarsha Gold',
    short_name: 'Suvarnavarsha',
    lang: 'en-IN',
    start_url: '/',
    display: 'browser',
    background_color: '#2E2327',
    theme_color: '#2E2327',
    icons: [
      { src: '/icon.png', type: 'image/png', sizes: '512x512' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  }
}

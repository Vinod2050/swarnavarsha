import { notFound } from 'next/navigation'

// Any unknown path under a locale shows the translated not-found page
export default function CatchAllPage() {
  notFound()
}

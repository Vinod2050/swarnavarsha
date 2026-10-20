// IndexNow key file. next.config.ts serves it at /<INDEXNOW_KEY>.txt, the address Bing and
// the other IndexNow engines check before they accept URL submissions.
export function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key) return new Response('Not found', { status: 404 })
  return new Response(key, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

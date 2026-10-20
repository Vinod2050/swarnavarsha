/**
 * Tells Bing (and the other IndexNow search engines) about every URL in the live sitemap.
 * Run after launch and after big content changes:
 *
 *   pnpm indexnow
 *
 * Needs NEXT_PUBLIC_SITE_URL (the live https address) and INDEXNOW_KEY in .env, and the key
 * file https://<site>/<INDEXNOW_KEY>.txt must already be reachable.
 */
import 'dotenv/config'

const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
const key = process.env.INDEXNOW_KEY

async function main() {
  if (!site.startsWith('https://') || !key) {
    throw new Error('Set NEXT_PUBLIC_SITE_URL (https) and INDEXNOW_KEY in .env first.')
  }

  const keyFile = await fetch(`${site}/${key}.txt`)
  if (!keyFile.ok || (await keyFile.text()).trim() !== key) {
    throw new Error(`The key file ${site}/${key}.txt is not reachable or does not match.`)
  }

  const xml = await (await fetch(`${site}/sitemap.xml`)).text()
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(site).host,
      key,
      keyLocation: `${site}/${key}.txt`,
      urlList,
    }),
  })
  // 200 and 202 both mean the list was accepted
  console.log(`Submitted ${urlList.length} URLs: HTTP ${response.status}`)
  if (!response.ok) process.exitCode = 1
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

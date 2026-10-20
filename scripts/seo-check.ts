/**
 * Checks the SEO tags of every public page on a running server (no JavaScript is run, the
 * same as most search and AI crawlers):
 *
 *   pnpm build && pnpm start      (in one terminal)
 *   pnpm seo:check                (in another; BASE_URL=https://… to check the live site)
 *
 * Prints title and description lengths, canonical, robots, Open Graph image, H1 count and
 * structured-data types, and fails on missing tags, duplicates or broken internal links.
 */
const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

const PATHS = [
  '',
  '/services',
  '/sell-gold',
  '/release-pledged-gold',
  '/buy-gold',
  '/store',
  '/how-it-works',
  '/about',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms',
]
const PAGES = [...PATHS.map((p) => p || '/'), ...PATHS.map((p) => `/mr${p}`)]

const problems: string[] = []
const titles = new Map<string, string>()
const descriptions = new Map<string, string>()
const internalLinks = new Set<string>()

function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function meta(html: string, attr: 'name' | 'property', key: string): string | undefined {
  const tag = html.match(new RegExp(`<meta[^>]+${attr}="${key}"[^>]*>`))?.[0]
  const content = tag?.match(/content="([^"]*)"/)?.[1]
  return content === undefined ? undefined : decode(content)
}

function jsonLdTypes(html: string): string[] {
  const types: string[] = []
  for (const [, body] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    const data = JSON.parse(body) as { '@type'?: string; '@graph'?: { '@type': string }[] }
    if (data['@graph']) types.push(...data['@graph'].map((node) => node['@type']))
    else if (data['@type']) types.push(data['@type'])
  }
  return types
}

async function checkPage(path: string) {
  const response = await fetch(BASE + path, { redirect: 'manual' })
  if (response.status !== 200) {
    problems.push(`${path}: HTTP ${response.status}`)
    return
  }
  const html = await response.text()
  // Only the <head> and the server-rendered body; nothing here depends on JavaScript
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
  const description = meta(html, 'name', 'description') ?? ''
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ''
  const robots = meta(html, 'name', 'robots') ?? ''
  const ogImage = meta(html, 'property', 'og:image') ?? ''
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length
  const lang = html.match(/<html[^>]+lang="([^"]+)"/)?.[1] ?? ''
  const types = jsonLdTypes(html)
  const hreflangs = (html.match(/<link rel="alternate" hrefLang="/g) ?? []).length

  console.log(`\n${path}`)
  console.log(`  title (${title.length}): ${title}`)
  console.log(`  description (${description.length}): ${description}`)
  console.log(`  canonical: ${canonical}`)
  console.log(`  robots: ${robots} | lang: ${lang} | hreflang links: ${hreflangs} | h1: ${h1Count}`)
  console.log(`  og:image: ${ogImage}`)
  console.log(`  JSON-LD: ${types.join(', ')}`)

  if (!title || title.length > 60) problems.push(`${path}: title length ${title.length}`)
  if (!description || description.length > 160) {
    problems.push(`${path}: description length ${description.length}`)
  }
  if (!canonical.startsWith('http')) problems.push(`${path}: missing absolute canonical`)
  if (!robots.includes('index') || robots.includes('noindex')) {
    problems.push(`${path}: robots is "${robots}"`)
  }
  if (!ogImage.startsWith('http')) problems.push(`${path}: missing absolute og:image`)
  if (h1Count !== 1) problems.push(`${path}: ${h1Count} <h1> tags`)
  if (hreflangs < 3) problems.push(`${path}: ${hreflangs} hreflang links`)
  for (const type of ['Organization', 'JewelryStore', 'WebSite', 'WebPage']) {
    if (!types.includes(type)) problems.push(`${path}: no ${type} structured data`)
  }
  if (path !== '/' && path !== '/mr' && !types.includes('BreadcrumbList')) {
    problems.push(`${path}: no BreadcrumbList`)
  }

  if (titles.has(title)) problems.push(`${path}: same title as ${titles.get(title)}`)
  titles.set(title, path)
  if (descriptions.has(description)) {
    problems.push(`${path}: same description as ${descriptions.get(description)}`)
  }
  descriptions.set(description, path)

  for (const [, href] of html.matchAll(/<a[^>]+href="(\/[^"#?]*)/g)) {
    if (!href.startsWith('/admin')) internalLinks.add(href)
  }
}

async function main() {
  for (const path of PAGES) await checkPage(path)

  // Every internal link must answer 200 (a redirect to the same page counts as fine)
  for (const href of internalLinks) {
    const response = await fetch(BASE + href, { redirect: 'follow' })
    if (response.status !== 200) problems.push(`broken link ${href}: HTTP ${response.status}`)
  }

  const files = ['/robots.txt', '/sitemap.xml', '/llms.txt', '/manifest.webmanifest']
  for (const file of files) {
    const response = await fetch(BASE + file)
    console.log(`\n${file}: HTTP ${response.status}`)
    if (response.status !== 200) problems.push(`${file}: HTTP ${response.status}`)
  }
  const missing = await fetch(`${BASE}/this-page-does-not-exist`)
  if (missing.status !== 404) problems.push(`unknown page answers HTTP ${missing.status}, not 404`)

  console.log(`\nChecked ${PAGES.length} pages and ${internalLinks.size} internal links.`)
  if (problems.length > 0) {
    console.log(`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`)
    process.exitCode = 1
  } else {
    console.log('No problems found.')
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})

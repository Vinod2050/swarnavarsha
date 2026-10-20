# SEO launch checklist

Nothing below has been done yet. Indexing usually takes days to weeks. Rankings and AI
citations are never guaranteed.

## 1. Server settings (`.env` on the live server)

- [ ] `NEXT_PUBLIC_SITE_URL` = the final https address (decide www or no www and redirect the
      other one in Nginx). Canonicals, sitemap, robots.txt and structured data all use it.
- [ ] `SITE_INDEXING` empty on the live site; `SITE_INDEXING=off` on any staging server.
- [ ] `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` (optional, see below).
- [ ] `INDEXNOW_KEY` = 32 random hex characters.
- [ ] Rebuild after changing these (`pnpm build`): next.config.ts reads some of them at build
      time.

## 2. Google Search Console

1. Add a **Domain** property (DNS TXT record at the domain registrar), or a **URL-prefix**
   property using the HTML tag: put its code in `GOOGLE_SITE_VERIFICATION`.
2. Sitemaps → submit `https://<site>/sitemap.xml`.
3. URL Inspection → Home, `/sell-gold`, `/release-pledged-gold`, `/buy-gold`, `/mr` →
   Request indexing.
4. After 2–4 weeks: check Pages (indexing errors), Enhancements (breadcrumbs) and the queries
   people use (update `keyword-map.md`).

## 3. Bing Webmaster Tools (also feeds ChatGPT search and Copilot)

1. Sign in, "Import from Google Search Console" (no code needed), or use the meta tag:
   `BING_SITE_VERIFICATION`.
2. Submit the sitemap.
3. Check that `https://<site>/<INDEXNOW_KEY>.txt` shows the key, then run `pnpm indexnow`. It
   sends every sitemap URL to Bing, Yandex and the other IndexNow engines. Run it again after
   big content changes.

## 4. Google Business Profile

- Category "Jewelry store" (+ "Gold dealer" if accurate). NAP exactly as in
  `citations-checklist.md`; website link to the home page.
- Services: Sell old gold & silver, Release pledged gold, Buy 24K gold coins & bars.
- Real photos: shop front, counter, testing machine, team.
- Opening hours (also send them to Finixsoft for the website and structured data).
- Post offers or updates now and then; ask for genuine reviews and reply to them.
- Send the profile link to Finixsoft: it goes into Site settings → Social links (`sameAs`).

## 5. Checks after launch

- [ ] `BASE_URL=https://<site> pnpm seo:check`: all pages pass.
- [ ] Google Rich Results Test and https://validator.schema.org on Home, `/sell-gold` and
      `/faq`.
- [ ] WhatsApp link preview: send the home page link in a chat; the logo image and title show.
- [ ] PageSpeed Insights (mobile) on Home and `/sell-gold`. Real-user Core Web Vitals appear
      only after a few weeks of traffic.
- [ ] `https://<site>/robots.txt` shows `Sitemap: https://<site>/sitemap.xml` (not
      localhost).

## Still needed from the client

Opening days and hours · exact map coordinates (pin from Google Maps) · Google Business
Profile link · social media links · confirmation of the claims in CLAUDE.md 8.2 · approval of
`content-proposals.md`.

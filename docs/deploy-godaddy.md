# Deploying to GoDaddy Deluxe (cPanel)

Decisions D-03 (SQLite) and D-09 (GoDaddy shared hosting). The site runs as a cPanel
**Node.js app**. It is never built on the server: shared hosting has too little memory, and the
image and database drivers must be Linux builds. GitHub builds it on Linux and gives you a zip.

Replace `USERNAME` below with your cPanel username (shown in cPanel, right sidebar).

## Folder layout on the server

| Folder | What is in it | Replaced on each update? |
| --- | --- | --- |
| `/home/USERNAME/suvarnavarsha-app` | The build from GitHub (`server.js`, `.next`, `node_modules`, `public`) | Yes |
| `/home/USERNAME/suvarnavarsha-data` | `suvarnavarsha.db`, `uploads/` (videos), `videos/photos/` (photos) | **Never** |
| `/home/USERNAME/backups` | Nightly database copies | No |

Both folders are outside `public_html`, so nobody can download the database.

## 1. One-time GitHub setup

GitHub → repository → Settings → Secrets and variables → Actions → **Variables** → add:

- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.in` (exact address visitors use)
- `NEXT_PUBLIC_GA_ID` = Google Analytics ID (optional)

These are baked into the sitemap and robots.txt, so set them before the build you put live.

## 2. Get a build

Every push to `main` runs **Actions → Build for GoDaddy** (or run it by hand: Actions → Build for
GoDaddy → Run workflow). It runs lint, typecheck and the build. When it is green, open the run
and download the artifact `suvarnavarsha-godaddy-N`. It contains `suvarnavarsha-godaddy.zip`.

## 3. First-time server setup

1. **SSL:** cPanel → SSL/TLS Status → run AutoSSL for the domain (HTTPS is required: the admin
   sign-in cookie is secure-only).
2. **Data folder:** cPanel → File Manager → create `suvarnavarsha-data`. Upload into it, from the
   developer PC:
   - `data/suvarnavarsha.db` → `suvarnavarsha-data/suvarnavarsha.db`
   - the `uploads` folder → `suvarnavarsha-data/uploads`
   - the `videos` folder → `suvarnavarsha-data/videos`
   (Stop `pnpm dev` before copying the .db file.)
3. **App folder:** create `suvarnavarsha-app`, upload `suvarnavarsha-godaddy.zip` into it, then
   Extract. Delete the zip afterwards.
4. **Node.js app:** cPanel → Setup Node.js App → Create Application:
   - Node.js version: **20** (or 22). Not older than 20.9.
   - Application mode: **Production**
   - Application root: `suvarnavarsha-app`
   - Application URL: your domain
   - Application startup file: `server.js`
   - Do **not** click "Run NPM Install": the build already contains everything it needs.
5. **Environment variables** (same screen, "Add Variable"):

   | Name | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `DATABASE_URI` | `file:/home/USERNAME/suvarnavarsha-data/suvarnavarsha.db` |
   | `STORAGE_DIR` | `/home/USERNAME/suvarnavarsha-data` |
   | `PAYLOAD_SECRET` | New random value, 64 characters (see below). Not the one from the PC |
   | `IP_HASH_SALT` | Another new random value |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.in` (same as in GitHub) |
   | `GOOGLE_SITE_VERIFICATION` | Optional, from Search Console |

   Make a random value on the PC: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

   A new `PAYLOAD_SECRET` signs everyone out once; passwords keep working.
6. Click **Restart**, open the domain, then `/admin` and sign in.

If cPanel says node modules must live in a separate folder ("virtual environment"), open cPanel →
Terminal and run, then Restart:

```sh
cd ~/suvarnavarsha-app
VENV=$(ls -d ~/nodevenv/suvarnavarsha-app/*/lib)   # created by Setup Node.js App
rm -rf "$VENV/node_modules" && mv node_modules "$VENV/" && ln -s "$VENV/node_modules" node_modules
```

## 4. Updating the site

1. Push to GitHub, wait for the green build, download the new zip.
2. File Manager → `suvarnavarsha-app` → select everything → Delete. (Never touch
   `suvarnavarsha-data`.)
3. Upload and extract the new zip there (and repeat the node-modules step above if it was needed).
4. Setup Node.js App → **Restart**. Database changes in a new build are applied automatically
   when the app starts (`prodMigrations` in `src/payload.config.ts`).

## 5. Backups (cPanel → Cron Jobs)

Once a day, 2:30 AM:

```sh
mkdir -p ~/backups && cp ~/suvarnavarsha-data/suvarnavarsha.db ~/backups/db-$(date +\%F).db && find ~/backups -name 'db-*.db' -mtime +14 -delete
```

Once a week, Sunday 3:00 AM (photos and videos):

```sh
tar -czf ~/backups/files-$(date +\%F).tar.gz -C ~/suvarnavarsha-data uploads videos && find ~/backups -name 'files-*.tar.gz' -mtime +30 -delete
```

Download a copy from `~/backups` to a PC or Google Drive every month: a backup on the same server
is lost if the hosting account is. Test a restore once (copy a backup over the .db and Restart).

## Known limits of shared hosting

- The app may sleep when nobody visits; the first visit afterwards takes a few seconds.
- If the site is often slow or restarts (cPanel → Resource Usage shows memory at the limit), move
  to a small VPS. The code needs no change for that.
- Video uploads near 100 MB may hit GoDaddy's upload limits; keep videos short.

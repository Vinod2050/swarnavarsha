import type { ServerProps } from 'payload'

/** "Download CSV" above the enquiries list. The file is built by GET /api/enquiries/export. */
export function ExportEnquiries({ payload }: ServerProps) {
  return (
    <p className="sg-export">
      <a
        className="sg-dash__button"
        href={`${payload.config.routes.api}/enquiries/export`}
        download
      >
        Download all enquiries (CSV)
      </a>
    </p>
  )
}

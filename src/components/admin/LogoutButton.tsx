import { LogOut } from 'lucide-react'
import Link from 'next/link'
import type { ServerProps } from 'payload'

/**
 * "Log out" at the top right of every admin page, beside the language picker. On phones only
 * the icon shows; the word stays for screen readers.
 */
export function LogoutButton({ payload }: ServerProps) {
  return (
    <Link className="sg-logout" href={`${payload.config.routes.admin}/logout`}>
      <LogOut size={16} strokeWidth={2} aria-hidden />
      <span className="sg-logout__text">Log out</span>
    </Link>
  )
}

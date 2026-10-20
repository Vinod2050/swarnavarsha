import Image from 'next/image'
import Link from 'next/link'
import type { ServerProps } from 'payload'

/**
 * Top of the side menu: the foil logo on plum, linking to the dashboard, with the signed-in
 * role under it, so every page of the panel carries the brand.
 */
export function NavBrand({ payload, user }: ServerProps) {
  const isSuper = user?.role === 'superadmin'
  return (
    <div className="sg-navbrand">
      <Link href={payload.config.routes.admin} className="sg-navbrand__link" aria-label="Dashboard">
        <Image
          src="/logo/suvarnavarsha-logo-v2-transparent.png"
          alt="Suvarnavarsha Gold"
          width={1100}
          height={572}
          sizes="180px"
          className="sg-navbrand__logo"
        />
      </Link>
      <p className="sg-navbrand__caption">
        <span>Staff panel</span>
        <span className="sg-navbrand__role">{isSuper ? 'Super admin' : 'Admin'}</span>
      </p>
    </div>
  )
}

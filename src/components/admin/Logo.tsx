import Image from 'next/image'
import Link from 'next/link'

/**
 * Top of the sign-in card: a link back to the website, the foil logo and the card title.
 * The plum band behind it is drawn in custom.scss, so the logo reads in light and dark
 * admin themes.
 */
export function Logo() {
  return (
    <>
      <Link href="/" className="sg-login__back">
        <span aria-hidden>←</span> <span className="sg-login__back-text">Back to website</span>
      </Link>
      <Image
        src="/logo/suvarnavarsha-logo-v2-transparent.png"
        alt="Suvarnavarsha Gold"
        width={1100}
        height={572}
        sizes="200px"
        priority
        className="sg-admin-logo"
      />
      <p className="sg-login__title">Staff sign in</p>
    </>
  )
}

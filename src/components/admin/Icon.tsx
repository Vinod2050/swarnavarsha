import Image from 'next/image'

import icon from '@/app/icon.png'

/** Small mark at the top of the admin menu. */
export function Icon() {
  return <Image src={icon} alt="" width={28} height={28} className="sg-admin-icon" />
}

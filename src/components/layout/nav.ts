/**
 * Main navigation. `key` is the label key in the `nav` messages namespace.
 * An item with `children` opens a dropdown on desktop and shows them indented in the
 * phone menu.
 */
export const NAV_ITEMS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  {
    key: 'services',
    href: '/services',
    children: [
      { key: 'allServices', href: '/services' },
      { key: 'sellGold', href: '/sell-gold' },
      { key: 'releasePledged', href: '/release-pledged-gold' },
      { key: 'buyGold', href: '/buy-gold' },
    ],
  },
  { key: 'store', href: '/store' },
  { key: 'howItWorks', href: '/how-it-works' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/contact' },
] as const

/** Every page the menu links to, dropdown pages included, each once. */
export const NAV_HREFS = [
  ...new Set(
    NAV_ITEMS.flatMap((item) =>
      'children' in item ? [item.href, ...item.children.map((child) => child.href)] : [item.href],
    ),
  ),
]

export type NavLinkItem = { href: string; label: string; children?: NavLinkItem[] }

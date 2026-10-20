'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { WhatsAppIcon } from '@/components/ui/icons'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'

export type ProductCardData = {
  code: string
  name: string
  description: string
  image: string
  category: string
  weight: string
  price: string
  /** wa.me link with this product's details already written in the message */
  whatsappHref: string
  /** A dummy product: shows the "Sample" badge */
  sample: boolean
}

export type ProductCardLabels = {
  sample: string
  category: string
  code: string
  weight: string
  price: string
  priceNote: string
  book: string
  dialogIntro: string
  sendWhatsapp: string
  close: string
}

/**
 * Store product. "Book now" opens the product's details with a WhatsApp button.
 *
 * The photo sits on plum inside a fine gold frame. Under the pointer the card lifts, the photo
 * zooms slowly, the frame closes in and brightens and a band of light sweeps across it.
 */
export function ProductCard({
  product,
  labels,
}: {
  product: ProductCardData
  labels: ProductCardLabels
}) {
  const details = [
    { label: labels.category, value: product.category },
    { label: labels.code, value: product.code },
    { label: labels.weight, value: product.weight },
    { label: labels.price, value: product.price },
  ]

  return (
    <Dialog>
      <article className="group flex h-full hover-lift flex-col overflow-hidden rounded-lg border border-line bg-surface-raised shadow-card hover:border-accent/60">
        <div className="theme-dark relative aspect-[4/3] overflow-hidden bg-surface">
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Band of light sweeping across under the pointer */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/15 transition-[left] duration-1000 ease-out group-hover:left-[130%]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-3 rounded-md border border-accent/40 transition-all duration-500 ease-out group-hover:inset-2 group-hover:border-accent"
          />
          <span className="absolute top-5 left-5 rounded-full border border-accent/50 bg-plum-950/80 px-3 py-1 t-label text-accent">
            {product.category}
          </span>
          {/* The weight, struck like a coin */}
          <span className="absolute top-4 right-4 grid size-16 place-items-center rounded-full border-2 border-gold-500 bg-accent text-center text-sm leading-4 font-bold text-on-cta shadow-foil transition-transform duration-500 group-hover:rotate-[-8deg]">
            {product.weight}
          </span>
          {/* Dummy products only; real ones are added in /admin → Store products */}
          {product.sample && (
            <span className="absolute bottom-5 left-5 rounded-sm bg-peacock-pink px-2 py-0.5 text-xs font-semibold text-white">
              {labels.sample}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
            {product.code}
          </p>
          <h3 className="mt-1 t-h3 transition-colors group-hover:text-accent">{product.name}</h3>
          <p className="mt-2 line-clamp-2 min-h-[2lh] text-ink-muted">{product.description}</p>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
            <div>
              <p className="text-sm text-ink-muted">{labels.price}</p>
              <p className="t-rate text-ink">{product.price}</p>
            </div>
          </div>
          <DialogTrigger asChild>
            <Button className="group/book mt-4 w-full">
              <WhatsAppIcon />
              {labels.book}
              <ArrowRight
                aria-hidden
                className="transition-transform group-hover/book:translate-x-1"
              />
            </Button>
          </DialogTrigger>
        </div>
      </article>

      <DialogContent closeLabel={labels.close}>
        <DialogTitle>{product.name}</DialogTitle>
        <DialogDescription>{labels.dialogIntro}</DialogDescription>

        <div className="mt-5 flex gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-surface-sunken">
            <Image src={product.image} alt="" fill sizes="96px" className="object-cover" />
          </div>
          <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {details.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-ink-muted">{row.label}</dt>
                <dd className="font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-4 text-sm text-ink-muted">{labels.priceNote}</p>

        <Button asChild variant="whatsapp" className="mt-5 w-full">
          <TrackedAnchor
            href={product.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            event="whatsapp_click"
            location="store_product"
          >
            <WhatsAppIcon />
            {labels.sendWhatsapp}
          </TrackedAnchor>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

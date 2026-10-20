import Link from 'next/link'
import type { ServerProps } from 'payload'

const day = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
})

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function indiaDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(date)
}

/**
 * Top of the Rates list: the buying rate the website is showing right now, whether today's
 * rate is in, and one button to enter or correct it.
 */
export async function RatesHeader({ payload }: ServerProps) {
  const adminRoute = payload.config.routes.admin
  const { docs } = await payload.find({
    collection: 'daily-rates',
    where: { type: { equals: 'buying' } },
    sort: '-rateDate',
    limit: 1,
    depth: 0,
  })
  const rate = docs[0]
  const isToday = rate ? indiaDate(new Date(rate.rateDate)) === indiaDate(new Date()) : false

  const tiles = rate
    ? [
        { mark: '24K', label: 'Gold 24K (999)', value: rate.gold24k999, unit: 'per gram' },
        { mark: '22K', label: 'Gold 22K', value: rate.gold22k, unit: 'per gram' },
        { mark: '18K', label: 'Gold 18K', value: rate.gold18k, unit: 'per gram' },
        { mark: 'Ag', label: 'Silver', value: rate.silverKg, unit: 'per kg' },
      ]
    : []

  return (
    <section className="sg-rates" aria-label="Rate on the website now">
      <div className="sg-rates__head">
        <div>
          <h2 className="sg-rates__title">On the website now</h2>
          {/* Joined, not a template string: the formatter strips the space inside one */}
          <p
            className={['sg-rates__status', isToday && 'sg-rates__status--ok']
              .filter(Boolean)
              .join(' ')}
          >
            {rate
              ? isToday
                ? `Today’s buying rate is entered (${day.format(new Date(rate.rateDate))}).`
                : `Today’s rate is not entered yet. The website still shows ${day.format(new Date(rate.rateDate))}.`
              : 'No rate entered yet. The website asks visitors to call for the rate.'}
          </p>
        </div>
        <Link
          className="sg-dash__button"
          href={
            rate && isToday
              ? `${adminRoute}/collections/daily-rates/${rate.id}`
              : `${adminRoute}/collections/daily-rates/create`
          }
        >
          {rate && isToday ? 'Correct today’s rate' : 'Enter today’s rate'}
        </Link>
      </div>

      {tiles.length > 0 && (
        <dl className="sg-rates__tiles">
          {tiles.map((tile) => (
            <div key={tile.mark} className="sg-rates__tile">
              <dt>
                <span aria-hidden className="sg-rates__mark">
                  {tile.mark}
                </span>
                {tile.label}
              </dt>
              <dd>
                <strong>{rupees.format(tile.value)}</strong> {tile.unit}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

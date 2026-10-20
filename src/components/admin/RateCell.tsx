const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** A rate in the Rates list, written the Indian way: ₹1,23,456. */
export function RateCell({ cellData }: { cellData?: unknown }) {
  return (
    <span className="sg-rate-cell">
      {typeof cellData === 'number' ? rupees.format(cellData) : '—'}
    </span>
  )
}

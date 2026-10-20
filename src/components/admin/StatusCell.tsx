/** A yes/no column as a labelled pill. The word carries the meaning; colour only supports it. */
function Pill({ on, yes, no }: { on: boolean; yes: string; no: string }) {
  return (
    <span className={`sg-pill ${on ? 'sg-pill--ok' : 'sg-pill--muted'}`}>
      <span className="sg-pill__dot" aria-hidden />
      {on ? yes : no}
    </span>
  )
}

/** "Show on the website" in the video lists */
export function LiveCell({ cellData }: { cellData?: unknown }) {
  return <Pill on={cellData === true} yes="Live" no="Hidden" />
}

/** The customer's consent in the feedback video list */
export function ConsentCell({ cellData }: { cellData?: unknown }) {
  return <Pill on={cellData === true} yes="Consent given" no="Waiting" />
}

'use client'

import { useTranslations } from 'next-intl'
import { useId, useState } from 'react'

import { NativeSelect } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatINR } from '@/lib/format'
import { PURITY_FACTORS, estimateValue, type Karat } from '@/lib/estimate'

const KARATS = Object.keys(PURITY_FACTORS).sort((a, b) => Number(b) - Number(a)) as Karat[]

type KaratChoice = Karat | 'other'

/** Indicative old-gold value: weight × purity × today's 24K buying rate (Section 10). */
export function Estimator({ rate24k }: { rate24k: number | null }) {
  const t = useTranslations('estimator')
  const id = useId()
  const [weight, setWeight] = useState('')
  const [karat, setKarat] = useState<KaratChoice>('22')
  const [purity, setPurity] = useState('')

  const grams = Number.parseFloat(weight)
  const factor = karat === 'other' ? Number.parseFloat(purity) / 100 : PURITY_FACTORS[karat]
  const weightOk = Number.isFinite(grams) && grams > 0 && grams <= 10000
  const factorOk = Number.isFinite(factor) && factor > 0 && factor <= 1
  const result = rate24k && weightOk && factorOk ? estimateValue(grams, factor, rate24k) : null

  return (
    <div className="grid gap-8 rounded-lg bg-surface-raised p-6 shadow-card md:grid-cols-2 md:p-10">
      <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-5">
        <div>
          <Label htmlFor={`${id}-weight`}>{t('weight')}</Label>
          <Input
            id={`${id}-weight`}
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder={t('weightPlaceholder')}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`${id}-karat`}>{t('karat')}</Label>
          <NativeSelect
            id={`${id}-karat`}
            value={karat}
            onChange={(e) => setKarat(e.target.value as KaratChoice)}
          >
            {KARATS.map((k) => (
              <option key={k} value={k}>
                {t('karatOption', { karat: k })}
              </option>
            ))}
            <option value="other">{t('karatOther')}</option>
          </NativeSelect>
        </div>
        {karat === 'other' && (
          <div>
            <Label htmlFor={`${id}-purity`}>{t('purity')}</Label>
            <Input
              id={`${id}-purity`}
              type="number"
              inputMode="decimal"
              min={1}
              max={100}
              step="0.1"
              placeholder={t('purityPlaceholder')}
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
            />
          </div>
        )}
      </form>

      <div className="flex flex-col justify-center rounded-md bg-surface-sunken p-6">
        <p className="t-label text-ink-muted">{t('result')}</p>
        <p aria-live="polite" className="mt-2 min-h-[34px] t-rate text-ink">
          {result
            ? `${formatINR(result.low)} – ${formatINR(result.high)}`
            : rate24k
              ? t('resultEmpty')
              : t('rateUnavailable')}
        </p>
        {rate24k && (
          <p className="mt-2 text-sm text-ink-muted">
            {t('basedOn', { rate: formatINR(rate24k) })}
          </p>
        )}
        <p className="mt-4 border-t border-line pt-4 text-sm text-ink">{t('disclaimer')}</p>
      </div>
    </div>
  )
}

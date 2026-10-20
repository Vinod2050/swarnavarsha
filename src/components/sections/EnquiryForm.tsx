'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck, Send } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { submitEnquiry } from '@/app/(frontend)/actions/enquiry'
import { Button } from '@/components/ui/button'
import { FieldError, NativeSelect, Textarea } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import { track } from '@/lib/analytics'
import {
  SERVICE_OPTIONS,
  TIME_OPTIONS,
  enquirySchema,
  type EnquiryField,
  type EnquiryInput,
} from '@/lib/schemas'

type Status = 'idle' | 'success' | 'rate_limited' | 'server'

export function EnquiryForm({
  defaultService = 'sell_gold',
}: {
  defaultService?: EnquiryInput['service']
}) {
  const t = useTranslations('enquiry')
  const locale = useLocale()
  const [status, setStatus] = useState<Status>('idle')
  const [pending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      mobile: '',
      service: defaultService,
      preferredTime: 'anytime',
      message: '',
      consent: false,
      website: '',
    },
  })

  const errorText = (field: EnquiryField) =>
    errors[field] ? t(`errors.${field}` as 'errors.name') : undefined

  const describedBy = (field: EnquiryField) =>
    errors[field] ? `enquiry-${field}-error` : undefined

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitEnquiry(values, locale)
      if (result.ok) {
        track('enquiry_submit', { service: values.service })
        reset()
        setStatus('success')
        return
      }
      if (result.error === 'invalid' && result.fieldErrors) {
        for (const field of Object.keys(result.fieldErrors) as EnquiryField[]) {
          setError(field, { type: 'server', message: field })
        }
        setStatus('idle')
        return
      }
      setStatus(result.error === 'rate_limited' ? 'rate_limited' : 'server')
    })
  })

  if (status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <CircleCheck aria-hidden className="size-12 text-peacock-green" />
        <h3 className="t-h3">{t('successTitle')}</h3>
        <p className="text-ink-muted">{t('successText')}</p>
        <Button variant="secondary" onClick={() => setStatus('idle')}>
          {t('sendAnother')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 lg:short:space-y-3">
      {/* Name and mobile share a row on wide, short screens so the form fits one screen */}
      <div className="grid gap-5 lg:short:grid-cols-2">
        <div>
          <Label htmlFor="enquiry-name">{t('name')}</Label>
          <Input
            id="enquiry-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
            {...register('name')}
          />
          <FieldError id="enquiry-name-error">{errorText('name')}</FieldError>
        </div>

        <div>
          <Label htmlFor="enquiry-mobile">{t('mobile')}</Label>
          <Input
            id="enquiry-mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            placeholder={t('mobilePlaceholder')}
            aria-invalid={Boolean(errors.mobile)}
            aria-describedby={describedBy('mobile')}
            {...register('mobile')}
          />
          <FieldError id="enquiry-mobile-error">{errorText('mobile')}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="enquiry-service">{t('service')}</Label>
          <NativeSelect
            id="enquiry-service"
            aria-invalid={Boolean(errors.service)}
            aria-describedby={describedBy('service')}
            {...register('service')}
          >
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(`services.${option}`)}
              </option>
            ))}
          </NativeSelect>
          <FieldError id="enquiry-service-error">{errorText('service')}</FieldError>
        </div>
        <div>
          <Label htmlFor="enquiry-time">{t('preferredTime')}</Label>
          <NativeSelect id="enquiry-time" {...register('preferredTime')}>
            {TIME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(`times.${option}`)}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div>
        <Label htmlFor="enquiry-message">{t('message')}</Label>
        <Textarea
          id="enquiry-message"
          maxLength={1000}
          className="lg:short:min-h-20"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message')}
          {...register('message')}
        />
        <FieldError id="enquiry-message-error">{errorText('message')}</FieldError>
      </div>

      {/* Honeypot: hidden from people and assistive technology */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="enquiry-website">Website</label>
        <input id="enquiry-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {(status === 'rate_limited' || status === 'server') && (
        <p role="alert" className="rounded-sm border border-danger px-4 py-3 text-danger">
          {t(status === 'rate_limited' ? 'rateLimited' : 'serverError')}
        </p>
      )}

      {/* Consent sits beside the send button on wide, short screens */}
      <div className="space-y-5 lg:short:flex lg:short:items-center lg:short:gap-5 lg:short:space-y-0">
        <div className="lg:short:flex-1">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 size-5 shrink-0 accent-plum-800"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={describedBy('consent')}
              {...register('consent')}
            />
            <span className="text-sm text-ink-muted">
              {t.rich('consent', {
                link: (chunks) => (
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-peacock-blue underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </label>
          <FieldError id="enquiry-consent-error">{errorText('consent')}</FieldError>
        </div>

        <Button type="submit" disabled={pending} className="w-full sm:w-auto lg:short:shrink-0">
          <Send aria-hidden />
          {pending ? t('sending') : t('submit')}
        </Button>
      </div>
    </form>
  )
}

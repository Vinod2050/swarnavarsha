import { z } from 'zod'

export const SERVICE_OPTIONS = [
  'sell_gold',
  'sell_silver',
  'release_pledged',
  'buy_gold',
  'other',
] as const

export const TIME_OPTIONS = ['anytime', 'morning', 'afternoon', 'evening'] as const

/**
 * Shared by the client form and the Server Action. Error messages are translation keys
 * under `enquiry.errors` so they are shown in the visitor's language.
 */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'name').max(100, 'name'),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'mobile'),
  service: z.enum(SERVICE_OPTIONS, { message: 'service' }),
  preferredTime: z.enum(TIME_OPTIONS, { message: 'preferredTime' }),
  message: z.string().trim().max(1000, 'message'),
  consent: z.boolean().refine((v) => v === true, 'consent'),
  // Honeypot: real visitors never see or fill this field
  website: z.string().max(0).optional(),
})

export type EnquiryInput = z.infer<typeof enquirySchema>

export type EnquiryField = keyof Omit<EnquiryInput, 'website'>

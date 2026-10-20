import nodemailer from 'nodemailer'

import type { EnquiryInput } from './schemas'

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.ENQUIRY_NOTIFY_EMAIL)
}

/** Emails a new enquiry to the client. Throws if SMTP rejects the message. */
export async function sendEnquiryEmail(
  enquiry: Omit<EnquiryInput, 'consent' | 'website'> & { locale: string },
): Promise<void> {
  const port = Number(process.env.SMTP_PORT || 587)
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })

  const lines = [
    `Name: ${enquiry.name}`,
    `Mobile: ${enquiry.mobile}`,
    `Service: ${enquiry.service}`,
    `Preferred time: ${enquiry.preferredTime}`,
    `Language: ${enquiry.locale}`,
    '',
    enquiry.message || '(no message)',
  ]

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ENQUIRY_NOTIFY_EMAIL,
    subject: `New website enquiry: ${enquiry.name} (${enquiry.mobile})`,
    text: lines.join('\n'),
  })
}

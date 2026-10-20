import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Faq } from '@/lib/content'
import { cn } from '@/lib/utils'

/**
 * `lines`: questions divided by hairlines (FAQ sections on other pages). `cards` (FAQ page):
 * each question on its own numbered card, which takes a gold edge while it is open.
 */
export function FaqList({ faqs, variant = 'lines' }: { faqs: Faq[]; variant?: 'lines' | 'cards' }) {
  const cards = variant === 'cards'

  return (
    <Accordion
      type="single"
      collapsible
      className={cn(cards ? 'space-y-3' : 'border-t border-line')}
    >
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className={cn(
            cards &&
              'group/faq rounded-lg border border-line bg-surface-raised px-4 shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent/60 data-[state=open]:border-accent data-[state=open]:shadow-[0_12px_32px_rgba(46,35,39,0.16)] sm:px-6',
          )}
        >
          <AccordionTrigger className={cn(cards && 'gap-3 sm:gap-4')}>
            {cards ? (
              <span className="flex flex-1 items-start gap-3 sm:gap-4">
                <span
                  aria-hidden
                  className="min-w-7 pt-px font-display text-lg leading-7 font-bold text-accent/60 transition-colors duration-300 group-data-[state=open]/faq:text-accent"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{faq.question}</span>
              </span>
            ) : (
              faq.question
            )}
          </AccordionTrigger>
          <AccordionContent
            // Cards: the answer sits under the question, behind a fine gold rule
            className={cn(
              cards && 'ml-3 border-l-2 border-accent/40 pl-4 sm:ml-[1.125rem] sm:pl-6',
            )}
          >
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

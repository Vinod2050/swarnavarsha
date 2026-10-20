import { FaqSection } from '@/components/sections/FaqSection'
import { HeroSlides } from '@/components/sections/home2/HeroSlides'
import { ProcessNumbers } from '@/components/sections/home2/ProcessNumbers'
import { ServiceTiles } from '@/components/sections/home2/ServiceTiles'
import { StorySplit } from '@/components/sections/home2/StorySplit'
import { VisitBlock } from '@/components/sections/home2/VisitBlock'
import { WhyList } from '@/components/sections/home2/WhyList'
import { OfferBand } from '@/components/sections/OfferBand'
import { RateStrip } from '@/components/sections/RateStrip'
import { Testimonials } from '@/components/sections/Testimonials'
import { VideoSection } from '@/components/sections/VideoSection'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { getFaqs, getOffer, getServices, getSiteSettings, getTestimonials } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'
import { getLatestRates } from '@/lib/rates'

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'home', '')
}

/** Home page: the plum "Home 2" design. The other designs are kept in backups/home-page. */
export default async function HomePage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [settings, services, rates, offer, testimonials, faqs] = await Promise.all([
    getSiteSettings(locale),
    getServices(locale),
    getLatestRates(),
    getOffer(locale),
    getTestimonials(locale),
    getFaqs(locale, { homeOnly: true }),
  ])

  return (
    <>
      <PageJsonLd locale={locale} path="" />
      <HeroSlides settings={settings} services={services} />
      <RateStrip rates={rates} settings={settings} />
      <StorySplit />
      <ServiceTiles services={services} />
      <WhyList settings={settings} />
      <ProcessNumbers />
      <VideoSection locale={locale} kind="adverts" hideWhenEmpty />
      <VideoSection locale={locale} kind="feedback" hideWhenEmpty />
      <OfferBand offer={offer} />
      <Testimonials testimonials={testimonials} />
      <FaqSection faqs={faqs} />
      <VisitBlock settings={settings} />
    </>
  )
}

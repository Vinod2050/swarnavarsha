/**
 * Seed content from the client's flyers and business card.
 *
 * Design phase: the site reads this file directly through the helpers in `src/lib`.
 * CMS phase: the same data seeds Payload, and the helpers switch to the Payload Local API.
 *
 * Rules (CLAUDE.md Section 8): only real client content. Anything unknown stays `null`
 * and is rendered as a clearly marked placeholder. Never add investment schemes,
 * return percentages, lucky draws or invented testimonials.
 */

export type Localized = { en: string; mr: string }

export type ServiceSlug = 'sell-gold' | 'release-pledged-gold' | 'buy-gold'

export const siteSeed = {
  name: { en: 'Suvarnavarsha Gold', mr: 'सुवर्णवर्षा गोल्ड' } satisfies Localized,
  legalName: {
    en: 'Suvarnavarsha Gold Ventures Pvt. Ltd.',
    mr: 'सुवर्णवर्षा गोल्ड व्हेंचर्स प्रा. लि.',
  } satisfies Localized,
  phones: [
    { display: '+91 91567 81981', tel: '+919156781981' },
    { display: '+91 88059 42424', tel: '+918805942424' },
  ],
  whatsapp: '919156781981',
  address: {
    en: 'Second Floor – 239, VTP Altitude, Near Shell Petrol Pump, Dange Chowk, Pune – 411033, Maharashtra',
    mr: 'दुसरा मजला – 239, व्हीटीपी अल्टिट्यूड, शेल पेट्रोल पंपाजवळ, डांगे चौक, पुणे – 411033, महाराष्ट्र',
  } satisfies Localized,
  addressParts: {
    street: 'Second Floor – 239, VTP Altitude, Near Shell Petrol Pump, Dange Chowk',
    locality: 'Pune',
    region: 'Maharashtra',
    postalCode: '411033',
    country: 'IN',
  },
  mapEmbedUrl:
    'https://www.google.com/maps?q=VTP+Altitude,+Dange+Chowk,+Pune+411033&output=embed',
  mapLinkUrl: 'https://www.google.com/maps/search/?api=1&query=VTP+Altitude+Dange+Chowk+Pune+411033',
  // [CLIENT TO PROVIDE: opening days and hours] — CLAUDE.md Section 18, question 3
  openingHours: null as Localized | null,
  // [CLIENT TO PROVIDE: social media links] — Section 18, question 8
  social: [] as { label: string; url: string }[],
  showSilver: true,
}

export const servicesSeed: {
  slug: ServiceSlug
  icon: 'coins' | 'landmark' | 'gem'
  title: Localized
  summary: Localized
}[] = [
  {
    slug: 'sell-gold',
    icon: 'coins',
    title: { en: 'Sell Old Gold & Silver', mr: 'जुने सोने-चांदी विक्री' },
    summary: {
      en: 'Jewellery, coins or bars of any karat, even broken pieces. Tested and weighed in front of you.',
      mr: 'कोणत्याही कॅरेटचे दागिने, नाणी किंवा बार, तुटलेले असले तरी. तुमच्या समोर तपासणी आणि वजन.',
    },
  },
  {
    slug: 'release-pledged-gold',
    icon: 'landmark',
    title: { en: 'Release Pledged Gold', mr: 'गहाण सोने सोडवणे' },
    summary: {
      en: 'Gold pledged with a bank, NBFC or pawn broker? We help you close the loan and release it.',
      mr: 'बँक, NBFC किंवा सावकाराकडे सोने गहाण आहे? कर्ज बंद करून सोने सोडवण्यास आम्ही मदत करतो.',
    },
  },
  {
    slug: 'buy-gold',
    icon: 'gem',
    title: { en: 'Buy 24K Gold Coins & Bars', mr: '24 कॅरेट सोन्याची नाणी व बार' },
    summary: {
      en: '24K coins, bars and biscuits from 0.5 g to 100 g, BIS Hallmark and HUID certified.',
      mr: '0.5 ग्रॅम ते 100 ग्रॅमपर्यंत 24 कॅरेट नाणी, बार आणि बिस्किटे. BIS हॉलमार्क आणि HUID प्रमाणित.',
    },
  },
]

export type ProductCategory = 'coin' | 'bar' | 'biscuit'

/*
 * DUMMY PRODUCTS for the store page design, requested by Finixsoft on 2026-10-09.
 * Names, codes, prices and photos are invented and shown with a "Sample" badge.
 * [CLIENT TO PROVIDE: real products, product codes, prices and photos] before launch.
 */
export const productsSeed: {
  code: string
  category: ProductCategory
  weightGrams: number
  price: number
  image: string
  name: Localized
  description: Localized
}[] = [
  {
    code: 'SG-C-001',
    category: 'coin',
    weightGrams: 1,
    price: 12500,
    image: '/images/stock/product-coin-1g.webp',
    name: { en: '24K Gold Coin, 1 g', mr: '24 कॅरेट सोन्याचे नाणे, 1 ग्रॅम' },
    description: {
      en: 'A small 24K (999) coin, suitable for gifting. BIS Hallmark and HUID certified.',
      mr: 'भेट देण्यासाठी योग्य असे लहान 24 कॅरेट (999) नाणे. BIS हॉलमार्क व HUID प्रमाणित.',
    },
  },
  {
    code: 'SG-C-010',
    category: 'coin',
    weightGrams: 10,
    price: 125000,
    image: '/images/stock/product-coin-10g.webp',
    name: { en: '24K Gold Coin, 10 g', mr: '24 कॅरेट सोन्याचे नाणे, 10 ग्रॅम' },
    description: {
      en: 'A 10 g 24K (999) coin. BIS Hallmark and HUID certified.',
      mr: '10 ग्रॅमचे 24 कॅरेट (999) नाणे. BIS हॉलमार्क व HUID प्रमाणित.',
    },
  },
  {
    code: 'SG-B-020',
    category: 'bar',
    weightGrams: 20,
    price: 250000,
    image: '/images/stock/product-bar-20g.webp',
    name: { en: '24K Gold Bar, 20 g', mr: '24 कॅरेट सोन्याचा बार, 20 ग्रॅम' },
    description: {
      en: 'A 20 g 24K (999) bar. BIS Hallmark and HUID certified.',
      mr: '20 ग्रॅमचा 24 कॅरेट (999) बार. BIS हॉलमार्क व HUID प्रमाणित.',
    },
  },
  {
    code: 'SG-B-050',
    category: 'bar',
    weightGrams: 50,
    price: 625000,
    image: '/images/stock/product-bar-50g.webp',
    name: { en: '24K Gold Bar, 50 g', mr: '24 कॅरेट सोन्याचा बार, 50 ग्रॅम' },
    description: {
      en: 'A 50 g 24K (999) bar. BIS Hallmark and HUID certified.',
      mr: '50 ग्रॅमचा 24 कॅरेट (999) बार. BIS हॉलमार्क व HUID प्रमाणित.',
    },
  },
  {
    code: 'SG-K-100',
    category: 'biscuit',
    weightGrams: 100,
    price: 1250000,
    image: '/images/stock/product-biscuit-100g.webp',
    name: { en: '24K Gold Biscuit, 100 g', mr: '24 कॅरेट सोन्याचे बिस्किट, 100 ग्रॅम' },
    description: {
      en: 'A 100 g 24K (999) biscuit. BIS Hallmark and HUID certified.',
      mr: '100 ग्रॅमचे 24 कॅरेट (999) बिस्किट. BIS हॉलमार्क व HUID प्रमाणित.',
    },
  },
]

export type FaqCategory = 'selling' | 'pledged' | 'buying' | 'general'

export const faqsSeed: {
  id: string
  category: FaqCategory
  showOnHome: boolean
  question: Localized
  answer: Localized
}[] = [
  {
    id: 'documents',
    category: 'selling',
    showOnHome: true,
    question: {
      en: 'Which documents do I need to sell gold?',
      mr: 'सोने विकण्यासाठी कोणती कागदपत्रे लागतात?',
    },
    answer: {
      en: 'Please carry a valid government photo identity proof such as your Aadhaar card. For higher-value transactions the law may also require your PAN. Our team will confirm the exact documents when you call.',
      mr: 'कृपया आधार कार्डसारखा वैध सरकारी फोटो ओळखपत्र सोबत आणा. मोठ्या रकमेच्या व्यवहारासाठी कायद्यानुसार पॅन कार्डही लागू शकते. तुम्ही कॉल केल्यावर आमची टीम नेमकी कागदपत्रे सांगेल.',
    },
  },
  {
    id: 'price',
    category: 'selling',
    showOnHome: true,
    question: {
      en: 'How is the price of my gold calculated?',
      mr: 'माझ्या सोन्याची किंमत कशी ठरते?',
    },
    answer: {
      en: 'Price = weight × purity × today’s rate. We weigh your gold and test its purity in front of you, then calculate the value using the day’s rate.',
      mr: 'किंमत = वजन × शुद्धता × आजचा दर. आम्ही तुमच्या समोर सोन्याचे वजन करतो आणि शुद्धता तपासतो, त्यानंतर त्या दिवसाच्या दराने किंमत काढतो.',
    },
  },
  {
    id: 'purity-test',
    category: 'selling',
    showOnHome: true,
    question: {
      en: 'How do you test the purity?',
      mr: 'शुद्धता कशी तपासली जाते?',
    },
    answer: {
      en: 'We use a German-technology purity testing machine. The test is done in front of you, so you can see the result yourself.',
      mr: 'आम्ही जर्मन तंत्रज्ञानाच्या मशीनने शुद्धता तपासतो. तपासणी तुमच्या समोरच होते, त्यामुळे निकाल तुम्ही स्वतः पाहू शकता.',
    },
  },
  {
    id: 'valuation-fee',
    category: 'selling',
    showOnHome: false,
    question: {
      en: 'Is there any charge for valuation or testing?',
      mr: 'मूल्यांकन किंवा तपासणीसाठी काही शुल्क आहे का?',
    },
    answer: {
      en: 'No. Valuation and purity testing are free. You are under no obligation to sell after the test.',
      mr: 'नाही. मूल्यांकन आणि शुद्धता तपासणी मोफत आहे. तपासणीनंतर विक्री करणे बंधनकारक नाही.',
    },
  },
  {
    id: 'payment',
    category: 'selling',
    showOnHome: true,
    question: {
      en: 'How soon will I get my payment?',
      mr: 'पैसे किती वेळात मिळतात?',
    },
    answer: {
      en: 'Once you accept the price, payment is made in about 5 minutes by bank transfer, or in cash within the limits allowed by law.',
      mr: 'तुम्ही किंमत मान्य केल्यावर सुमारे 5 मिनिटांत बँक ट्रान्सफरने, किंवा कायद्याने परवानगी असलेल्या मर्यादेत रोख स्वरूपात पैसे दिले जातात.',
    },
  },
  {
    id: 'karat',
    category: 'selling',
    showOnHome: false,
    question: {
      en: 'Which karat gold do you buy?',
      mr: 'तुम्ही कोणत्या कॅरेटचे सोने खरेदी करता?',
    },
    answer: {
      en: 'We buy gold of any karat: jewellery, coins and bars, including old or broken items.',
      mr: 'आम्ही कोणत्याही कॅरेटचे सोने खरेदी करतो: दागिने, नाणी आणि बार, जुने किंवा तुटलेले असले तरी.',
    },
  },
  {
    id: 'without-bill',
    category: 'selling',
    showOnHome: false,
    question: {
      en: 'Can I sell gold without the purchase bill?',
      mr: 'खरेदीचे बिल नसताना सोने विकता येते का?',
    },
    answer: {
      en: 'Yes. The purchase bill is not mandatory, but a valid identity proof is required.',
      mr: 'होय. खरेदीचे बिल बंधनकारक नाही, परंतु वैध ओळखपत्र आवश्यक आहे.',
    },
  },
  {
    id: 'silver',
    category: 'selling',
    showOnHome: false,
    question: {
      en: 'Do you also buy silver?',
      mr: 'तुम्ही चांदीही खरेदी करता का?',
    },
    answer: {
      en: 'Yes, we buy old silver as well. The process is the same: testing, weighing and payment as per the day’s rate.',
      mr: 'होय, आम्ही जुनी चांदीही खरेदी करतो. प्रक्रिया तीच आहे: तपासणी, वजन आणि त्या दिवसाच्या दराने पेमेंट.',
    },
  },
  {
    id: 'pledged',
    category: 'pledged',
    showOnHome: true,
    question: {
      en: 'My gold is pledged with a bank. Can you help?',
      mr: 'माझे सोने बँकेत गहाण आहे. तुम्ही मदत करू शकता का?',
    },
    answer: {
      en: 'Yes. We pay the outstanding amount to the lender so that your gold is released. The gold is then tested and weighed in front of you, and you receive the balance amount.',
      mr: 'होय. आम्ही कर्जाची थकबाकी संबंधित संस्थेला भरतो, त्यामुळे तुमचे सोने सुटते. त्यानंतर सोने तुमच्या समोर तपासले व वजन केले जाते आणि उरलेली रक्कम तुम्हाला मिळते.',
    },
  },
  {
    id: 'buy-what',
    category: 'buying',
    showOnHome: false,
    question: {
      en: 'What gold can I buy from you?',
      mr: 'तुमच्याकडून कोणते सोने खरेदी करता येते?',
    },
    answer: {
      en: 'We sell 24K gold coins, bars and biscuits from 0.5 g to 100 g, certified with BIS Hallmark and HUID. Stock is limited, so please register in advance. Registration is free.',
      mr: 'आम्ही 0.5 ग्रॅम ते 100 ग्रॅमपर्यंत 24 कॅरेट सोन्याची नाणी, बार आणि बिस्किटे विकतो. ती BIS हॉलमार्क आणि HUID प्रमाणित आहेत. साठा मर्यादित असल्याने कृपया आधी नोंदणी करा. नोंदणी मोफत आहे.',
    },
  },
  {
    id: 'rates',
    category: 'general',
    showOnHome: false,
    question: {
      en: 'Are the rates shown on the website final?',
      mr: 'वेबसाइटवर दाखवलेले दर अंतिम असतात का?',
    },
    answer: {
      en: 'The rates are indicative and are updated by our team. The final price is decided at the branch after purity testing and weighing.',
      mr: 'हे दर सूचक आहेत आणि आमची टीम ते अपडेट करते. अंतिम किंमत शाखेत शुद्धता तपासणी आणि वजनानंतर ठरते.',
    },
  },
  {
    id: 'rules',
    category: 'general',
    showOnHome: false,
    question: {
      en: 'Is there gold that you do not accept?',
      mr: 'असे कोणते सोने आहे जे तुम्ही स्वीकारत नाही?',
    },
    answer: {
      en: 'We do not accept stolen or fake gold, and such cases are reported to the authorities. Persons below 18 years of age cannot sell gold.',
      mr: 'आम्ही चोरीचे किंवा बनावट सोने स्वीकारत नाही आणि अशा प्रकरणांची माहिती अधिकाऱ्यांना दिली जाते. 18 वर्षांखालील व्यक्ती सोने विकू शकत नाही.',
    },
  },
]

/**
 * SAMPLE RATES for the design phase only. They are not real market or shop rates and are
 * shown on the site with a visible "Sample" label. Real rates will be entered daily by the
 * client in the admin panel (Decision D-05).
 */
export const ratesSeed = {
  isSample: true,
  updatedAt: '2026-10-08T10:30:00+05:30',
  buying: { gold24k999: 12500, gold22k: 11450, gold18k: 9375, silverKg: 155000 },
}

export const offerSeed = {
  active: true,
  text: {
    en: '5% off on 24K gold on the 1st and 3rd Saturday of every month',
    mr: 'दर महिन्याच्या पहिल्या व तिसऱ्या शनिवारी 24 कॅरेट सोन्यावर 5% सूट',
  } satisfies Localized,
}

/** Only real reviews with the customer's consent may be added here (Section 8.3). */
export const testimonialsSeed: {
  id: string
  name: string
  area: Localized
  text: Localized
  rating: number
}[] = []

import { figmaAsset as asset } from "@/lib/figma-asset";
import type {
  Expert,
  Faq,
  HeroSlide,
  PricingFeature,
  PricingTier,
  Testimonial,
} from "@/lib/supabase/types";

export const seedHeroSlides: HeroSlide[] = [
  "f03350a9-ad27-4d27-a1ee-74ee0b2adfdb",
  "d23d6728-2dbf-40eb-970b-c76d515a5aa2",
  "f30de078-11d3-463f-a4b0-ab5580a28fa3",
  "906813e9-ef0c-49d0-b1b2-b9874797fab1",
  "15e00f3d-6947-4c86-837b-15ad8111b2ba",
].map((id, i) => ({
  id: `seed-hero-${i}`,
  photo_url: asset(id),
  alt: null,
  sort_order: i,
  published: true,
  created_at: "",
  updated_at: "",
}));

export const seedTestimonialPhotos: string[] = [
  "bdcd73ca-6a45-4c0f-9ac9-48e3d3e3b057",
  "b5fc5c9e-2a19-4b2c-87b4-1fe6f6d7a2ad",
  "f61db793-cf91-4e65-8397-35f0466cc29a",
  "4456726e-c080-4afc-818d-9dfac0f44135",
  "037c73f4-28cf-4ca0-9c2c-c0efde571a1a",
  "cdf2ee1c-4b2e-40d8-b501-ead5ac46d5f6",
].map(asset);

export const seedTestimonials: Testimonial[] = [
  {
    id: "seed-t-1",
    author_name: "Віктор П.",
    author_role: "Junior Developer",
    quote:
      "Формат ліги ідеальний для тих, хто хоче постійно прогресувати. Нарешті зрозумів, де мої прогалини. Дякую за чесну оцінку.",
    photo_url: seedTestimonialPhotos[0],
    sort_order: 0,
    published: true,
    created_at: "",
    updated_at: "",
  },
];

export const seedExperts: Expert[] = [
  {
    name: "Олена Киричок",
    role: "Software Engineer · Transcarent",
    photo_url: "/experts/olena-kyrychok.png",
    bio: "Full-stack інженерка з фокусом на healthcare-продуктах. Будує інтерфейси та backend-сервіси, які тримають мільйонні навантаження в Transcarent.",
    achievements:
      "• Software Engineer @ Transcarent (US healthcare platform)\n• Ex-Senior Developer у Ring Ukraine\n• Ментор у Women Who Code Kyiv\n• Speaker: KyivJS, Web Standards Days",
  },
  {
    name: "Максим Климишин",
    role: "Founder OSS IQ",
    photo_url: "/experts/maksym-klymyshyn.png",
    bio: "Фаундер OSS IQ, ветеран ком’юніті open source в Україні. 15+ років у продуктовій розробці та архітектурі розподілених систем.",
    achievements:
      "• Founder & CEO @ OSS IQ\n• Ex-CTO кількох українських SaaS-стартапів\n• Організатор KyivPy, PyCon UA\n• Автор статей і доповідей із Python, Go, системного дизайну",
  },
  {
    name: "Іван Добровольський",
    role: "Staff Software Engineer @ Walmart Global Tech",
    photo_url: "/experts/ivan-dobrovolskyi.png",
    bio: "Staff Software Engineer у Walmart Global Tech. Спеціалізується на high-load сервісах, event-driven архітектурах та e-commerce-платформах.",
    achievements:
      "• Staff Engineer @ Walmart Global Tech\n• Досвід на Big Tech: Amazon, EPAM\n• Contributor до open-source (Kafka ecosystem)\n• Tech reviewer на міжнародних конференціях",
  },
  {
    name: "Станіслав Малкін",
    role: "DevOps @ Flix",
    photo_url: "/experts/stanislav-malkin.png",
    bio: "DevOps-інженер у Flix, відповідає за надійність інфраструктури та CI/CD для кількох продуктових команд. Фанат автоматизації і observability.",
    achievements:
      "• DevOps @ Flix (транспортно-мобільний сектор ЄС)\n• Побудував pipeline з ~40 мікросервісів у Kubernetes\n• Ex-SRE у Grammarly-like продукті\n• Сертифікований CKA / AWS DevOps Pro",
  },
  {
    name: "Сергій Марковкін",
    role: "Lead Backend Engineer",
    photo_url: "/experts/serhii-markovkin.png",
    bio: "Lead Backend Engineer з фокусом на fintech та billing-системи. Проектує API, які обробляють мільйони транзакцій на добу, без downtime.",
    achievements:
      "• Lead Backend Engineer у fintech-продукті Tier-1\n• Архітектор білінгу з 99.99% SLA\n• Автор внутрішнього engineering handbook\n• Ментор 30+ розробників із сеньйор-грейдом",
  },
  {
    name: "Микола Савенко",
    role: "Principal Architect",
    photo_url: "/experts/mykola-savenko.png",
    bio: "Principal Architect із 20-річним досвідом. Проектує продуктові платформи з нуля, допомагає командам переходити з моноліту на мікросервіси.",
    achievements:
      "• Principal Architect у великій продуктовій компанії\n• Автор книжки «Backend для дорослих»\n• Член техкомітету UA IT Cluster\n• Консультант для трьох unicorn-компаній",
  },
].map((e, i) => ({
  id: `seed-expert-${i}`,
  name: e.name,
  role: e.role,
  photo_url: e.photo_url,
  bio: e.bio,
  achievements: e.achievements,
  sort_order: i,
  published: true,
  created_at: "",
  updated_at: "",
}));

export const seedFaqs: Faq[] = [
  { question: "Це навчання чи змагання?", answer: "" },
  {
    question: "Чи можна почати безкоштовно?",
    answer:
      "Так. Базовий пакет безкоштовний і включає доступ до 3 тренувальних турнірів та 1 рейтингового турніру на місяць. Це дозволяє оцінити формат перед переходом на платний пакет.",
  },
  { question: "Як формується рейтинг?", answer: "" },
  { question: "Хто перевіряє роботи?", answer: "" },
  { question: "Чи підходить для Junior?", answer: "" },
].map((f, i) => ({
  id: `seed-faq-${i}`,
  question: f.question,
  answer: f.answer,
  sort_order: i,
  published: true,
  created_at: "",
  updated_at: "",
}));

export const seedPricingTiers: PricingTier[] = [
  {
    name: "Free trial",
    price: "Безкоштовно",
    period: "",
    description_top: "Для старту та знайомства",
    description_bottom: "з системою",
    cta_label: "Обрати free trial",
  },
  {
    name: "Basic",
    price: "₴1.900",
    period: "/3 міс",
    description_top: "Для старту та знайомства",
    description_bottom: "з системою",
    cta_label: "Обрати basic",
  },
  {
    name: "Core",
    price: "₴5.500",
    period: "/3 міс",
    description_top: "Для активного росту",
    description_bottom: "та змагань",
    cta_label: "Обрати core",
  },
  {
    name: "Pro",
    price: "₴19.900",
    period: "/3 міс",
    description_top: "Максимальні можливості",
    description_bottom: "для професіоналів",
    cta_label: "Обрати pro",
  },
].map((t, i) => ({
  id: `seed-tier-${i}`,
  ...t,
  sort_order: i,
  published: true,
  created_at: "",
  updated_at: "",
}));

export const seedPricingFeatures: PricingFeature[] = [
  ["Доступ до контенту", "частково", "✅", "✅", "✅"],
  ["Тренувальні турніри", "3", "9", "9", "9"],
  ["Рейтингові турніри", "1", "3", "3", "3"],
  ["Оцінка журі", "❌", "❌", "✅", "✅\nпріоритет"],
  ["Сезонні досягнення", "❌", "✅", "✅", "✅"],
  ["Промо робіт у соцмережах", "❌", "✅", "✅\nтопи", "✅\nпріоритет"],
  [
    "Доступ до ком'юніті",
    "обмежений\n(доступ до частини контенту)",
    "✅\n(можна спілкуватися, писати, обговорювати)",
    "✅\n(повний доступ + участь у щомісячних фідбек-сесіях)",
    "✅ VIP\n(закриті чати з менторами, пріоритет у Q&A, активності)",
  ],
  ["Живі трансляції із розбором робіт", "❌", "✅\n(лише спостерігач)", "✅", "✅"],
  ["Щомісячна загальна фідбек-сесія з експертами", "❌", "❌", "✅", "✅"],
  ["Персональний review коду (архітектура + performance)", "❌", "❌", "❌", "🔥\nповний 1:1 review"],
  ["1:1 менторські сесії", "❌", "❌", "❌", "✅"],
  ["Early access до наступного сезону", "❌", "❌", "❌", "✅"],
  ["Переваги у викликах від компаній", "❌", "❌", "❌", "✅"],
  [
    "Сертифікат",
    "❌",
    "season pass",
    "учасник / топ-10\n→ із балами та місцем у рейтингу",
    "PRO\n+ рекомендація*",
  ],
].map(([label, value_free, value_basic, value_core, value_pro], i) => ({
  id: `seed-feature-${i}`,
  label,
  value_free,
  value_basic,
  value_core,
  value_pro,
  sort_order: i,
  published: true,
  created_at: "",
  updated_at: "",
}));

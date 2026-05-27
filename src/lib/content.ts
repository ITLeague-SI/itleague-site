import { figmaAsset as asset } from "@/lib/figma-asset";

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  quote: string;
  photo_url: string | null;
};

export type HeroSlide = {
  id: string;
  photo_url: string;
  alt: string | null;
};

export type Expert = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  bio: string | null;
  achievements: string | null;
};

export type PricingTier = {
  id: string;
  name: string;
  price: string;
  period: string;
  description_top: string;
  description_bottom: string;
  cta_label: string;
};

export type PricingFeature = {
  id: string;
  label: string;
  value_free: string;
  value_basic: string;
  value_core: string;
  value_pro: string;
};

export const heroSlides: HeroSlide[] = [
  "f03350a9-ad27-4d27-a1ee-74ee0b2adfdb",
  "d23d6728-2dbf-40eb-970b-c76d515a5aa2",
  "f30de078-11d3-463f-a4b0-ab5580a28fa3",
  "906813e9-ef0c-49d0-b1b2-b9874797fab1",
  "15e00f3d-6947-4c86-837b-15ad8111b2ba",
].map((id, i) => ({
  id: `hero-${i}`,
  photo_url: asset(id),
  alt: null,
}));

const testimonialPhotoIds = [
  "bdcd73ca-6a45-4c0f-9ac9-48e3d3e3b057",
  "b5fc5c9e-2a19-4b2c-87b4-1fe6f6d7a2ad",
  "f61db793-cf91-4e65-8397-35f0466cc29a",
  "4456726e-c080-4afc-818d-9dfac0f44135",
  "037c73f4-28cf-4ca0-9c2c-c0efde571a1a",
  "cdf2ee1c-4b2e-40d8-b501-ead5ac46d5f6",
];

export const testimonialPhotos: string[] = testimonialPhotoIds.map(asset);

/* Two distinct slide-rows for the testimonials gallery.
   Files live under /public/gallery/row1 and /row2. */
export const galleryRow1: string[] = [
  "/gallery/row1/1.png",
  "/gallery/row1/2.png",
  "/gallery/row1/3.png",
  "/gallery/row1/4.png",
  "/gallery/row1/5.png",
  "/gallery/row1/6.png",
];

export const galleryRow2: string[] = [
  "/gallery/row2/1.png",
  "/gallery/row2/2.png",
  "/gallery/row2/3.png",
  "/gallery/row2/4.png",
  "/gallery/row2/5.png",
  "/gallery/row2/6.png",
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    author_name: "Віктор П.",
    author_role: "Junior Developer",
    quote:
      "Формат ліги ідеальний для тих, хто хоче постійно прогресувати. Нарешті зрозумів, де мої прогалини. Дякую за чесну оцінку.",
    photo_url: testimonialPhotos[0],
  },
  {
    id: "t-2",
    author_name: "Олексій Г.",
    author_role: "Middle Backend Engineer",
    quote:
      "Перший турнір — і вже видно, де ти реально стоїш. Жодних курсів не давало такої конкретики. Рейтинг — це чесно.",
    photo_url: testimonialPhotos[1],
  },
  {
    id: "t-3",
    author_name: "Марина Л.",
    author_role: "Senior Engineer",
    quote:
      "Реальні кейси з production-систем, жорстка оцінка журі і нарешті адекватний зворотний зв'язок. IT League — не для слабких духом, але саме тому варто.",
    photo_url: testimonialPhotos[2],
  },
  {
    id: "t-4",
    author_name: "Дмитро К.",
    author_role: "Backend Developer",
    quote:
      "Три місяці — і два рівні вгору в рейтингу. IT League змушує думати інакше: не про теорію, а про рішення.",
    photo_url: testimonialPhotos[3],
  },
  {
    id: "t-5",
    author_name: "Аліна В.",
    author_role: "Software Engineer",
    quote:
      "Нарешті місце, де оцінюють код, а не резюме. Саме тут зрозуміла, що моє рішення архітектурно слабке — і виправила це за тиждень.",
    photo_url: testimonialPhotos[4],
  },
];

export const experts: Expert[] = [
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
  id: `expert-${i}`,
  ...e,
}));

export const faqs: Faq[] = [
  {
    question: "Це навчання чи змагання?",
    answer:
      "Це змагання. IT League — не курс і не менторська програма. Ми не вчимо з нуля, ми перевіряємо реальний рівень. Ти отримуєш задачу, вирішуєш її, журі оцінює, рейтинг оновлюється. Все чесно й конкретно.",
  },
  {
    question: "Чи можна почати безкоштовно?",
    answer:
      "Так. Базовий пакет безкоштовний і включає доступ до 3 тренувальних турнірів та 1 рейтингового турніру на місяць. Це дозволяє оцінити формат перед переходом на платний пакет.",
  },
  {
    question: "Як формується рейтинг?",
    answer:
      "Рейтинг будується на основі балів за кожен турнір. Враховуються: правильність рішення, архітектурна якість, продуктивність та читаємість коду. Журі виставляє оцінки за чіткими критеріями — без суб'єктивщини.",
  },
  {
    question: "Хто перевіряє роботи?",
    answer:
      "Роботи перевіряють практикуючі інженери рівня Senior і вище з реальних product-компаній. Усі судді проходять відбір і дотримуються стандартизованих критеріїв оцінки.",
  },
  {
    question: "Чи підходить для Junior?",
    answer:
      "Так. Для Junior є окремий рівень із задачами відповідної складності та можливістю зростати в рейтингу серед рівних. IT League — це місце, де можна зрозуміти, де ти зараз, і побачити, куди рухатись далі.",
  },
  {
    question: "Яку практичну цінність надає участь в IT LEAGUE, окрім позиції в рейтингу?",
    answer:
      "Учасник отримує практичний досвід вирішення прикладних backend-задач у змагальному середовищі. Результати дозволяють об'єктивно оцінити власний рівень та зони для розвитку.",
  },
  {
    question: "Чим IT LEAGUE відрізняється від LeetCode, Codewars або pet-проєктів?",
    answer:
      "IT LEAGUE фокусується на комплексних інженерних сценаріях, а не ізольованих алгоритмах. Завдання — реальні робочі кейси, які виконуються в умовах обмеженого часу.",
  },
  {
    question: "Яку користь IT LEAGUE надає розробникам із комерційним досвідом?",
    answer:
      "Платформа дозволяє перевірити власні підходи поза межами поточного проєкту та порівняти себе з іншими інженерами. Це інструмент саморефлексії, а не навчання з нуля.",
  },
  {
    question: "Чи передбачає участь регулярну активність або постійну присутність?",
    answer:
      "Участь не вимагає щоденної активності. Користувач самостійно обирає, коли долучатися до змагань у межах доступного періоду.",
  },
  {
    question: "Чи необхідно володіти конкретним технологічним стеком для участі?",
    answer:
      "Завдання не прив'язані до одного фреймворку або мови. Ключовим є розуміння backend-принципів, а не знання конкретних інструментів.",
  },
  {
    question: "Що відбувається, якщо учасник не може розв'язати жодне завдання?",
    answer:
      "Участь у лізі не має негативних наслідків. Навіть невдалий результат дозволяє зрозуміти власні прогалини та реальний рівень підготовки.",
  },
  {
    question: "Як IT LEAGUE сприяє професійному зростанню між змаганнями?",
    answer:
      "Результати участі формують чіткі уявлення про слабкі та сильні сторони. Це дозволяє цілеспрямовано розвивати необхідні навички поза платформою.",
  },
  {
    question: "Чи можна використовувати результати IT LEAGUE як підтвердження професійних навичок?",
    answer:
      "Рейтинг і результати зазвичай слугують додатковим доказом практичного рівня. Вони демонструють здатність працювати з реальними задачами в умовах конкуренції.",
  },
].map((f, i) => ({
  id: `faq-${i}`,
  ...f,
}));

export const pricingTiers: PricingTier[] = [
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
  id: `tier-${i}`,
  ...t,
}));

export const pricingFeatures: PricingFeature[] = [
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
  id: `feature-${i}`,
  label,
  value_free,
  value_basic,
  value_core,
  value_pro,
}));

import type { Expert, Faq, HeroSlide, Testimonial } from "@/lib/supabase/types";

const asset = (id: string) => `/api/figma-assets/${id}`;

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
  ["Олександр Коваленко", "CTO @ TechCorp", "68577c27-6b21-4a47-8fdb-5a0bba106327"],
  ["Марина Петренко", "Lead Backend Engineer", "3d3d4756-8326-425b-a0b9-21c641388e5b"],
  ["Дмитро Савченко", "Principal Architect", "624b50cc-d91c-45d6-aff1-7be00cb97be5"],
  ["Дмитро Савченко", "Principal Architect", "d013e21c-0445-43ae-b857-8d95729b4d9e"],
  ["Кирило Редька", "Staff Engineer", "6e603cd0-21b2-4093-b4d9-912dd0154571"],
].map(([name, role, id], i) => ({
  id: `seed-expert-${i}`,
  name,
  role,
  photo_url: asset(id),
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

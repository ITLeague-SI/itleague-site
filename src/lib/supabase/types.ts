export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  quote: string;
  photo_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type HeroSlide = {
  id: string;
  photo_url: string;
  alt: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Expert = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  bio: string | null;
  achievements: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminTableName = "faqs" | "testimonials" | "hero_slides" | "experts";

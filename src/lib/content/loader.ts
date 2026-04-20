import "server-only";
import { getPublicSupabase } from "@/lib/supabase/public";
import type {
  Expert,
  Faq,
  HeroSlide,
  Testimonial,
} from "@/lib/supabase/types";
import {
  seedExperts,
  seedFaqs,
  seedHeroSlides,
  seedTestimonials,
} from "./seed";

async function loadFrom<T>(
  table: "faqs" | "testimonials" | "hero_slides" | "experts",
  fallback: T[]
): Promise<T[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return fallback;
    if (!data || data.length === 0) return fallback;
    return data as T[];
  } catch {
    return fallback;
  }
}

export function loadFaqs(): Promise<Faq[]> {
  return loadFrom<Faq>("faqs", seedFaqs);
}

export function loadTestimonials(): Promise<Testimonial[]> {
  return loadFrom<Testimonial>("testimonials", seedTestimonials);
}

export function loadHeroSlides(): Promise<HeroSlide[]> {
  return loadFrom<HeroSlide>("hero_slides", seedHeroSlides);
}

export function loadExperts(): Promise<Expert[]> {
  return loadFrom<Expert>("experts", seedExperts);
}

import "server-only";
import { getPublicSupabase } from "@/lib/supabase/public";
import type {
  Expert,
  Faq,
  HeroSlide,
  PricingFeature,
  PricingTier,
  Testimonial,
} from "@/lib/supabase/types";
import {
  seedExperts,
  seedFaqs,
  seedHeroSlides,
  seedPricingFeatures,
  seedPricingTiers,
  seedTestimonials,
} from "./seed";

type TableName =
  | "faqs"
  | "testimonials"
  | "hero_slides"
  | "experts"
  | "pricing_tiers"
  | "pricing_features";

async function loadFrom<T>(table: TableName, fallback: T[]): Promise<T[]> {
  const supabase = getPublicSupabase();
  if (!supabase) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        `[content/loader] Supabase is not configured; using seed for "${table}".`,
      );
    }
    return fallback;
  }
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      console.error(
        `[content/loader] Supabase returned an error for "${table}":`,
        error.message,
      );
      return fallback;
    }
    if (!data || data.length === 0) {
      console.warn(
        `[content/loader] No published rows in "${table}"; using seed.`,
      );
      return fallback;
    }
    return data as T[];
  } catch (e) {
    console.error(
      `[content/loader] Unexpected error while loading "${table}":`,
      e,
    );
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

export function loadPricingTiers(): Promise<PricingTier[]> {
  return loadFrom<PricingTier>("pricing_tiers", seedPricingTiers);
}

export function loadPricingFeatures(): Promise<PricingFeature[]> {
  return loadFrom<PricingFeature>("pricing_features", seedPricingFeatures);
}
